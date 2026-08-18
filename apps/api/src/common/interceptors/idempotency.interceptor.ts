import { createHash } from "node:crypto";
import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { HTTP_CODE_METADATA } from "@nestjs/common/constants";
import { Reflector } from "@nestjs/core";
import { Observable, from, of, throwError } from "rxjs";
import { catchError, concatMap, map } from "rxjs/operators";
import type { Request } from "express";
import { getPrismaClient, type IdempotencyRecord, type Prisma } from "@nauterio/database";
import { IDEMPOTENCY_KEY_METADATA } from "../decorators/require-idempotency-key.decorator";
import { apiLogger } from "../../logger";

const RECORD_TTL_HOURS = 24;
// Sentinel for a hypothetical future public+idempotent route - every
// current @RequireIdempotencyKey() route sits behind AuthGuard, so
// req.user is always populated in practice.
// DATA-009: IdempotencyRecord.userId now carries a real FK to users.id, so
// this sentinel would fail with P2003 the moment it was ever actually used
// (it does not correspond to a real row). A future public+idempotent route
// must make userId nullable rather than reviving this fake-UUID approach.
const ANONYMOUS_USER_ID = "00000000-0000-0000-0000-000000000000";

/**
 * Enforces Idempotency-Key semantics on routes tagged with
 * @RequireIdempotencyKey() (spec section 26.1). Behaviour matches the
 * common Stripe-style contract, scoped per (route, caller):
 *   - missing header -> 400
 *   - unseen key -> claim it (INSERT), run the handler, store the response
 *   - seen key (same caller), same request body -> replay the stored
 *     response, handler does not run again
 *   - seen key (same caller), different request body -> 409
 *   - seen key, still IN_PROGRESS (a genuine concurrent duplicate) -> 409
 *   - seen key, FAILED and not yet expired -> 409 (ambiguous outcome, see
 *     below - never silently retried before TTL)
 *   - expired record (any terminal state) -> reclaimed, handler runs again
 *   - handler throws a client error (4xx) -> claim released, retry can
 *     succeed immediately
 *   - handler throws anything else (5xx/unknown) -> marked FAILED, not
 *     deleted - the operation may have already committed, so an immediate
 *     retry is not safe; only TTL expiry reclaims it (SEC-005/DATA-003)
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const required = this.reflector.get<boolean>(IDEMPOTENCY_KEY_METADATA, context.getHandler());
    if (!required) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request>();
    const logger = apiLogger.child({ correlationId: req.correlationId });
    const keyHeader = req.headers["idempotency-key"];
    const key = Array.isArray(keyHeader) ? keyHeader[0] : keyHeader;
    if (!key) {
      throw new BadRequestException("Idempotency-Key header is required for this operation");
    }

    const scope = `${context.getClass().name}.${context.getHandler().name}`;
    const userId = req.user?.userId ?? ANONYMOUS_USER_ID;
    const requestHash = hashBody(req.body);
    const prisma = getPrismaClient();
    const claimArgs = {
      scope,
      key,
      userId,
      requestHash,
      expiresAt: new Date(Date.now() + RECORD_TTL_HOURS * 60 * 60 * 1000),
    };

    let claim = await tryClaim(prisma, claimArgs);

    if (claim.status === "existing" && claim.record.expiresAt.getTime() < Date.now()) {
      // Expired - reclaim the key rather than treat it as live. Delete-then-
      // recreate, not update-in-place, so a genuinely concurrent claimant
      // racing this same reclaim still gets a clean unique-constraint
      // decision rather than two writers touching one row.
      await prisma.idempotencyRecord
        .delete({ where: { id: claim.record.id } })
        .catch((e) => logger.warn({ err: e }, "Failed to reclaim expired idempotency record"));
      claim = await tryClaim(prisma, claimArgs);
    }

    if (claim.status === "existing") {
      const existing = claim.record;
      if (existing.requestHash !== requestHash) {
        throw new ConflictException(
          "This Idempotency-Key was already used with a different request payload."
        );
      }
      if (existing.status === "IN_PROGRESS") {
        throw new ConflictException("A request with this Idempotency-Key is already being processed.");
      }
      if (existing.status === "FAILED") {
        throw new ConflictException(
          "A previous request with this Idempotency-Key failed with an ambiguous outcome and has not yet " +
            "expired for retry. Use a new Idempotency-Key to try again immediately."
        );
      }
      return of(existing.responseBodyJson);
    }

    const recordId = claim.recordId;
    const declaredStatus = this.reflector.get<number>(HTTP_CODE_METADATA, context.getHandler()) ?? defaultStatusFor(req.method);

    return next.handle().pipe(
      // concatMap (not tap) so the COMPLETED write is genuinely awaited
      // before the response is emitted to the client (DATA-003) - a
      // fire-and-forget write here is exactly what let a crash between
      // commit and this update strand the record IN_PROGRESS forever.
      concatMap((body: unknown) =>
        from(
          prisma.idempotencyRecord.update({
            where: { id: recordId },
            data: {
              status: "COMPLETED",
              responseStatus: declaredStatus,
              responseBodyJson: (body ?? {}) as Prisma.InputJsonValue,
              completedAt: new Date(),
            },
          })
        ).pipe(
          catchError((e) => {
            logger.error({ err: e }, "Failed to persist idempotency response");
            return of(null); // do not fail the request over a bookkeeping write
          }),
          map(() => body)
        )
      ),
      catchError((err: unknown) => {
        const isClientError = err instanceof HttpException && err.getStatus() < 500;
        const release = isClientError
          ? prisma.idempotencyRecord.delete({ where: { id: recordId } })
          : prisma.idempotencyRecord.update({ where: { id: recordId }, data: { status: "FAILED" } });

        return from(release).pipe(
          catchError((e) => {
            logger.error({ err: e }, "Failed to finalise idempotency claim after handler error");
            return of(null);
          }),
          concatMap(() => throwError(() => err))
        );
      })
    );
  }
}

type ClaimResult =
  | { status: "claimed"; recordId: string }
  | { status: "existing"; record: IdempotencyRecord };

async function tryClaim(
  prisma: ReturnType<typeof getPrismaClient>,
  args: { scope: string; key: string; userId: string; requestHash: string; expiresAt: Date }
): Promise<ClaimResult> {
  try {
    const record = await prisma.idempotencyRecord.create({ data: args });
    return { status: "claimed", recordId: record.id };
  } catch (err) {
    if (!isUniqueConstraintViolation(err)) throw err;
    const existing = await prisma.idempotencyRecord.findUnique({
      where: { scope_userId_key: { scope: args.scope, userId: args.userId, key: args.key } },
    });
    if (!existing) throw err; // raced with a delete; extremely unlikely, surface the original error
    return { status: "existing", record: existing };
  }
}

function defaultStatusFor(method: string): number {
  return method === "POST" ? HttpStatus.CREATED : HttpStatus.OK;
}

function hashBody(body: unknown): string {
  return createHash("sha256").update(JSON.stringify(body ?? {})).digest("hex");
}

function isUniqueConstraintViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";
}

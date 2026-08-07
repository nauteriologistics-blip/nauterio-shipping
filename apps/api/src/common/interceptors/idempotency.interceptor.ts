import { createHash } from "node:crypto";
import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import type { Request } from "express";
import { getPrismaClient } from "@nauterio/database";
import { IDEMPOTENCY_KEY_METADATA } from "../decorators/require-idempotency-key.decorator";

const RECORD_TTL_HOURS = 24;

/**
 * Enforces Idempotency-Key semantics on routes tagged with
 * @RequireIdempotencyKey() (spec section 26.1). Behaviour matches the
 * common Stripe-style contract:
 *   - missing header -> 400
 *   - unseen key -> claim it (INSERT), run the handler, store the response
 *   - seen key, same request body -> replay the stored response, handler
 *     does not run again
 *   - seen key, different request body -> 409 (client bug, not a retry)
 *   - seen key, still IN_PROGRESS (a genuine concurrent duplicate) -> 409
 *   - handler throws -> the claimed record is deleted so a real retry with
 *     the same key can succeed later
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name);

  constructor(private readonly reflector: Reflector) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const required = this.reflector.get<boolean>(IDEMPOTENCY_KEY_METADATA, context.getHandler());
    if (!required) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request>();
    const keyHeader = req.headers["idempotency-key"];
    const key = Array.isArray(keyHeader) ? keyHeader[0] : keyHeader;
    if (!key) {
      throw new BadRequestException("Idempotency-Key header is required for this operation");
    }

    const scope = `${context.getClass().name}.${context.getHandler().name}`;
    const requestHash = hashBody(req.body);
    const prisma = getPrismaClient();

    let recordId: string;
    try {
      const record = await prisma.idempotencyRecord.create({
        data: {
          scope,
          key,
          requestHash,
          userId: req.user?.userId,
          expiresAt: new Date(Date.now() + RECORD_TTL_HOURS * 60 * 60 * 1000),
        },
      });
      recordId = record.id;
    } catch (err) {
      if (!isUniqueConstraintViolation(err)) throw err;

      const existing = await prisma.idempotencyRecord.findUnique({
        where: { scope_key: { scope, key } },
      });
      if (!existing) throw err; // raced with a delete; extremely unlikely, surface the original error

      if (existing.requestHash !== requestHash) {
        throw new ConflictException(
          "This Idempotency-Key was already used with a different request payload."
        );
      }
      if (existing.status === "IN_PROGRESS") {
        throw new ConflictException(
          "A request with this Idempotency-Key is already being processed."
        );
      }
      return of(existing.responseBodyJson);
    }

    return next.handle().pipe(
      tap({
        next: (body) => {
          prisma.idempotencyRecord
            .update({
              where: { id: recordId },
              data: { status: "COMPLETED", responseBodyJson: (body ?? {}) as object, completedAt: new Date() },
            })
            .catch((e) => this.logger.error(`Failed to persist idempotency response: ${String(e)}`));
        },
        error: () => {
          // The operation failed - release the claim so a genuine retry with
          // the same key can succeed instead of permanently 409ing.
          prisma.idempotencyRecord
            .delete({ where: { id: recordId } })
            .catch((e) => this.logger.error(`Failed to release idempotency claim: ${String(e)}`));
        },
      })
    );
  }
}

function hashBody(body: unknown): string {
  return createHash("sha256").update(JSON.stringify(body ?? {})).digest("hex");
}

function isUniqueConstraintViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";
}

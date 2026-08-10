import { BadRequestException, Controller, Get, Injectable, Module, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient, Prisma } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { NoPermissionRequired } from "../../common/decorators/no-permission-required.decorator";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { AuditService } from "../audit/audit.module";

/**
 * SEC-011/ADR 0002: deterministic, non-PII tombstone values. `phone` on
 * Contact is required (not nullable), so it gets a placeholder rather than
 * null; everything else nullable is nulled outright.
 */
const ERASED_FULL_NAME = "Erased User";
const ERASED_ADDRESS_LINE = "ERASED";
const ERASED_POSTAL_CODE = "00000";
const ERASED_COUNTRY_CODE = "XX"; // not a real ISO 3166-1 alpha-2 code, deliberately
const ERASED_CONTACT_PHONE = "000-000-0000";

/**
 * Identity module (spec section 24): Cognito linkage, users, sessions,
 * verification, account recovery. Real session/MFA/passkey management is
 * Cognito-side work blocked on a real User Pool (ADR 0001 section 11) -
 * this implements the Nauterio-side profile endpoint (`GET /me`, spec
 * section 26.1) since that only needs the database, which is real.
 */
@Injectable()
class IdentityService {
  constructor(private readonly auditService: AuditService) {}

  async getProfile(userId: string) {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      preferredLanguage: user.preferredLanguage,
      staffRole: user.staffRole,
      // DATA-007: a client needs the current version to supply as
      // UpdateProfileDto.expectedVersion on its next edit - without this,
      // the optimistic-locking guard is implemented but practically unusable.
      version: user.version,
    };
  }

  /**
   * SEC-011/ADR 0002 (`docs/decisions/0002-gdpr-erasure-via-pseudonymisation.md`):
   * overwrites PII on the User row and its Address/Contact book with
   * tombstone values, in the same transaction as the erasure's own audit
   * event - never a `DELETE`, which the append-only audit trigger would
   * reject the instant this user has any audit history (every real
   * customer). Idempotent on `erasedAt`: a second call is a no-op that
   * still returns success, rather than re-erasing an already-erased row or
   * erroring on it.
   */
  async eraseUser(targetUserId: string, actor: AuthenticatedUser, correlationId?: string) {
    const prisma = getPrismaClient();
    const target = await prisma.user.findUniqueOrThrow({ where: { id: targetUserId } });

    if (target.erasedAt) {
      return { id: target.id, erasedAt: target.erasedAt, alreadyErased: true };
    }

    return prisma.$transaction(async (tx) => {
      const erasedAt = new Date();

      const updated = await tx.user.update({
        where: { id: targetUserId },
        data: {
          email: `erased-${targetUserId}@deleted.nauterio.internal`,
          fullName: ERASED_FULL_NAME,
          phone: null,
          marketingConsent: false,
          status: "CLOSED",
          erasedAt,
          // DATA-007: keep the optimistic-locking counter meaningful for
          // any concurrent/subsequent update, same as customers.service.ts.
          version: { increment: 1 },
        },
      });

      await tx.address.updateMany({
        where: { userId: targetUserId },
        data: {
          line1: ERASED_ADDRESS_LINE,
          line2: null,
          city: ERASED_ADDRESS_LINE,
          region: null,
          postalCode: ERASED_POSTAL_CODE,
          countryCode: ERASED_COUNTRY_CODE,
          providerResultJson: Prisma.JsonNull,
        },
      });

      await tx.contact.updateMany({
        where: { userId: targetUserId },
        data: {
          fullName: ERASED_FULL_NAME,
          phone: ERASED_CONTACT_PHONE,
          email: null,
          companyName: null,
        },
      });

      await this.auditService.record(
        {
          actorUserId: actor.userId,
          action: "USER_ERASE",
          entityType: "User",
          entityId: targetUserId,
          reason: "GDPR Article 17 erasure request",
          correlationId,
        },
        tx
      );

      return { id: updated.id, erasedAt, alreadyErased: false };
    });
  }
}

@ApiTags("identity")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller()
class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get("me")
  @NoPermissionRequired()
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.identityService.getProfile(user.userId);
  }

  @Post("admin/users/:id/erase")
  @RequirePermission("user:erase")
  @RequireIdempotencyKey()
  async eraseUser(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() actor: AuthenticatedUser,
    @CorrelationId() correlationId: string
  ) {
    if (id === actor.userId) {
      // Not a security control (SUPER_ADMIN already has the only permission
      // that reaches this route) - a operational guardrail so an admin can't
      // accidentally erase and lock themselves out of their own session.
      throw new BadRequestException("Cannot erase the account you are currently authenticated as.");
    }
    return this.identityService.eraseUser(id, actor, correlationId);
  }
}

@Module({
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}

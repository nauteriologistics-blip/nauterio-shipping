import { randomBytes, createHash } from "node:crypto";
import { BadRequestException, Controller, Injectable, Module, Post, Body } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { getPrismaClient } from "@nauterio/database";
import { loadApiConfig } from "@nauterio/configuration";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import { AuditService } from "../audit/audit.module";
import { RegisterDto, VerifyEmailDto } from "./dto/auth.dto";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h, spec 27.1 "short-lived"

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Customer self-registration (spec 27.1, screens 75/76). Real identity is
 * meant to live in Cognito - this module exists because no real Cognito
 * User Pool is provisioned in this environment yet (see
 * `infra/cdk/lib/compute-stack.ts`'s own comment). `cognitoSub` here is a
 * locally-generated opaque secret that doubles as the LOCAL_AUTH_MODE
 * bearer token (`apps/api/src/common/guards/cognito-jwt-verifier.ts`'s dev
 * passthrough already treats whatever bearer token is presented as the
 * cognitoSub directly) - the same mechanism `apps/admin`'s dev login uses,
 * just self-service instead of a seeded value. When a real Cognito pool
 * exists, this module's registration half is replaced by Cognito Hosted UI
 * and this becomes dead code; nothing downstream (AuthGuard, PermissionGuard,
 * the rest of the API) needs to change, since they only ever look at
 * `cognitoSub` as an opaque identifier already.
 */
@Injectable()
class AuthService {
  constructor(private readonly auditService: AuditService) {}

  async register(dto: RegisterDto, correlationId?: string) {
    if (!dto.acceptedTerms) {
      throw new BadRequestException("You must accept the terms to create an account.");
    }

    const prisma = getPrismaClient();
    const config = loadApiConfig();
    const cognitoSub = `cus_${randomBytes(20).toString("base64url")}`;
    const rawVerificationToken = randomBytes(32).toString("base64url");

    const { user, verificationUrl } = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          cognitoSub,
          email: dto.email,
          fullName: dto.fullName,
          phone: dto.phone,
          preferredLanguage: dto.preferredLanguage ?? "en",
          marketingConsent: dto.marketingConsent ?? false,
          status: "PENDING_VERIFICATION",
        },
      });

      await tx.emailVerificationToken.create({
        data: {
          userId: created.id,
          tokenHash: hashToken(rawVerificationToken),
          expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
        },
      });

      await this.auditService.record(
        {
          actorUserId: created.id,
          action: "USER_REGISTERED",
          entityType: "User",
          entityId: created.id,
          correlationId,
        },
        tx
      );

      const url = new URL("/verify-email", config.WEB_APP_URL);
      url.searchParams.set("token", rawVerificationToken);
      return { user: created, verificationUrl: url.toString() };
    });

    const isDev = config.NODE_ENV !== "production";
    return {
      userId: user.id,
      email: user.email,
      verificationRequired: true,
      // REQUIRES_BUSINESS_EVIDENCE: no SES sending identity is configured in
      // this environment, so the verification email is not actually sent.
      // In non-production, the link is returned directly here instead of
      // being emailed, so the flow is end-to-end testable without SES. This
      // must never happen in production - a real deployment needs SES
      // wired and this field removed from the response.
      ...(isDev ? { devVerificationUrl: verificationUrl } : {}),
    };
  }

  async verifyEmail(dto: VerifyEmailDto, correlationId?: string) {
    const prisma = getPrismaClient();
    const tokenHash = hashToken(dto.token);

    return prisma.$transaction(async (tx) => {
      // Read-then-write on `consumedAt` (a separate findUnique before this
      // transaction, checked, then updated) let two concurrent requests
      // for the same token both pass the check before either committed -
      // caught live via React StrictMode's double-invoked effect firing
      // two real POST requests for one token, both succeeding. The
      // conditional `updateMany` makes consumption atomic: only the
      // request whose UPDATE actually matches a still-unconsumed,
      // unexpired row (`count === 1`) gets to proceed.
      const claim = await tx.emailVerificationToken.updateMany({
        where: { tokenHash, consumedAt: null, expiresAt: { gt: new Date() } },
        data: { consumedAt: new Date() },
      });

      if (claim.count === 0) {
        throw new BadRequestException("This verification link is invalid or has expired.");
      }

      const record = await tx.emailVerificationToken.findUniqueOrThrow({ where: { tokenHash } });

      const updated = await tx.user.update({
        where: { id: record.userId },
        data: {
          status: "ACTIVE",
          emailVerifiedAt: new Date(),
          version: { increment: 1 },
        },
      });

      await this.auditService.record(
        {
          actorUserId: updated.id,
          action: "USER_EMAIL_VERIFIED",
          entityType: "User",
          entityId: updated.id,
          correlationId,
        },
        tx
      );

      // The web BFF uses this as the session token going forward (the same
      // dev-passthrough bearer-token mechanism registration itself relied
      // on) - verifying email and establishing a session happen together,
      // a standard "magic link" pattern, since there is no separate
      // password to sign in with in this dev-mode model.
      return { cognitoSub: updated.cognitoSub, userId: updated.id };
    });
  }
}

@ApiTags("auth")
@Controller("auth")
class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Public, anonymous - deliberately tighter than the app default given
   * account-creation is a higher-abuse-value action than most anonymous
   * endpoints. */
  @Post("register")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: "Create a customer account (individual)" })
  async register(@Body() dto: RegisterDto, @CorrelationId() correlationId: string) {
    return this.authService.register(dto, correlationId);
  }

  @Post("verify-email")
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @ApiOperation({ summary: "Consume an email verification token and activate the account" })
  async verifyEmail(@Body() dto: VerifyEmailDto, @CorrelationId() correlationId: string) {
    return this.authService.verifyEmail(dto, correlationId);
  }
}

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

import { randomBytes, createHash } from "node:crypto";
import { BadRequestException, Controller, ForbiddenException, Injectable, Module, Post, Body, Req } from "@nestjs/common";
import type { Request } from "express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { getPrismaClient } from "@nauterio/database";
import { loadApiConfig } from "@nauterio/configuration";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import { AuditService } from "../audit/audit.module";
import { RegisterDto, RequestSignInDto, VerifyEmailDto } from "./dto/auth.dto";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h, spec 27.1 "short-lived"
const SIGN_IN_TOKEN_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

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
    if (config.PILOT_MODE) {
      const allowed = new Set(config.PILOT_ALLOWED_EMAILS.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
      if (!allowed.has(dto.email.trim().toLowerCase())) throw new ForbiddenException("Registration is currently limited to invited pilot customers.");
    }
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

      const url = new URL("/verify-email", config.WEB_APP_URL);
      url.searchParams.set("token", rawVerificationToken);
      await tx.outboxEvent.create({
        data: {
          eventType: "user.email_verification.requested",
          correlationId,
          payloadJson: { userId: created.id, email: created.email, verificationUrl: url.toString() },
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

      return { user: created, verificationUrl: url.toString() };
    });

    const isDev = config.NODE_ENV !== "production";
    return {
      userId: user.id,
      email: user.email,
      verificationRequired: true,
      // Local development exposes the link for convenient testing. In
      // production it is delivered only through the transactional outbox.
      ...(isDev ? { devVerificationUrl: verificationUrl } : {}),
    };
  }

  async requestSignIn(dto: RequestSignInDto, correlationId?: string) {
    const prisma = getPrismaClient();
    const user = await prisma.user.findFirst({
      where: { email: { equals: dto.email.trim(), mode: "insensitive" }, status: "ACTIVE" },
    });

    // Always return the same response so this endpoint cannot be used to
    // discover which email addresses have Nauterio accounts.
    if (!user) return { accepted: true };

    const rawToken = randomBytes(32).toString("base64url");
    const config = loadApiConfig();
    const url = new URL("/verify-email", config.WEB_APP_URL);
    url.searchParams.set("token", rawToken);
    url.searchParams.set("mode", "signin");

    await prisma.$transaction(async (tx) => {
      await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(rawToken),
          expiresAt: new Date(Date.now() + SIGN_IN_TOKEN_TTL_MS),
        },
      });
      await tx.outboxEvent.create({
        data: {
          eventType: "user.signin_link.requested",
          correlationId,
          payloadJson: { userId: user.id, email: user.email, signInUrl: url.toString() },
        },
      });
      await this.auditService.record(
        {
          actorUserId: user.id,
          action: "USER_SIGNIN_LINK_REQUESTED",
          entityType: "User",
          entityId: user.id,
          correlationId,
        },
        tx
      );
    });

    return { accepted: true };
  }

  async requestStaffSignIn(dto: RequestSignInDto, correlationId?: string) {
    const prisma = getPrismaClient();
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: dto.email.trim(), mode: "insensitive" },
        status: "ACTIVE",
        staffRole: { not: null },
      },
    });
    if (!user) return { accepted: true };

    const rawToken = randomBytes(32).toString("base64url");
    const config = loadApiConfig();
    const url = new URL("/verify-email", config.ADMIN_APP_URL);
    url.searchParams.set("token", rawToken);

    await prisma.$transaction(async (tx) => {
      await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(rawToken),
          expiresAt: new Date(Date.now() + SIGN_IN_TOKEN_TTL_MS),
        },
      });
      await tx.outboxEvent.create({
        data: {
          eventType: "user.staff_signin_link.requested",
          correlationId,
          payloadJson: { userId: user.id, email: user.email, signInUrl: url.toString() },
        },
      });
      await this.auditService.record(
        {
          actorUserId: user.id,
          action: "STAFF_SIGNIN_LINK_REQUESTED",
          entityType: "User",
          entityId: user.id,
          correlationId,
        },
        tx
      );
    });

    return { accepted: true };
  }

  async verifyEmail(dto: VerifyEmailDto, correlationId?: string) {
    const prisma = getPrismaClient();
    const tokenHash = hashToken(dto.token);
    const rawSessionToken = `nts_${randomBytes(32).toString("base64url")}`;

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

      await tx.authSession.create({
        data: {
          userId: updated.id,
          tokenHash: hashToken(rawSessionToken),
          expiresAt: new Date(Date.now() + SESSION_TTL_MS),
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
      return { sessionToken: rawSessionToken, userId: updated.id, expiresInSeconds: SESSION_TTL_MS / 1000 };
    });
  }

  async logout(rawSessionToken: string | undefined) {
    if (!rawSessionToken) return { revoked: false };
    const result = await getPrismaClient().authSession.updateMany({
      where: { tokenHash: hashToken(rawSessionToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { revoked: result.count === 1 };
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

  @Post("request-signin")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: "Email a single-use customer sign-in link" })
  async requestSignIn(@Body() dto: RequestSignInDto, @CorrelationId() correlationId: string) {
    return this.authService.requestSignIn(dto, correlationId);
  }

  @Post("request-staff-signin")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: "Email a single-use staff sign-in link" })
  async requestStaffSignIn(@Body() dto: RequestSignInDto, @CorrelationId() correlationId: string) {
    return this.authService.requestStaffSignIn(dto, correlationId);
  }

  @Post("logout")
  async logout(@Req() req: Request) {
    const header = req.headers.authorization;
    return this.authService.logout(header?.startsWith("Bearer ") ? header.slice(7) : undefined);
  }
}

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

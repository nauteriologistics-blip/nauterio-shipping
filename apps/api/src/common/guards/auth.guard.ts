import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { getPrismaClient } from "@nauterio/database";
import type { AppRole } from "@nauterio/contracts";
import { loadApiConfig } from "@nauterio/configuration";
import { verifyCognitoToken } from "./cognito-jwt-verifier";

export interface AuthenticatedUser {
  userId: string;
  cognitoSub: string;
  role: AppRole;
  organisationId?: string;
  warehouseIds: string[];
  accountStatus: string;
  approvalLimitAmountMinorUnits?: number;
}

declare module "express" {
  interface Request {
    user?: AuthenticatedUser;
  }
}

/**
 * Two-step identity check (ADR 0001 section 6.1):
 *   1. Verify the bearer token proves WHO the caller is.
 *   2. Load the Nauterio-side role/org/warehouse context from Postgres,
 *      which proves WHAT they're allowed to do.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }
    const token = authHeader.slice("Bearer ".length);

    const config = loadApiConfig();
    const cognitoSub = await verifyCognitoToken(token, {
      userPoolId: config.COGNITO_USER_POOL_ID,
      region: config.COGNITO_REGION,
      clientId: config.COGNITO_CLIENT_ID,
      localAuthMode: config.LOCAL_AUTH_MODE,
      nodeEnv: config.NODE_ENV,
    });

    if (!cognitoSub) {
      throw new UnauthorizedException("Invalid token");
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({ where: { cognitoSub } });
    if (!user) {
      throw new UnauthorizedException("No Nauterio account linked to this identity");
    }

    // Enforced here, not only inside evaluatePermission, because
    // PermissionGuard/evaluatePermission only run on routes that declare
    // @RequirePermission - account suspension must revoke access on every
    // route, not only the ones that happen to check permissions (SEC-006).
    if (user.status !== "ACTIVE") {
      throw new UnauthorizedException(`Account status is ${user.status}, not ACTIVE`);
    }

    const membership = await prisma.organisationMember.findFirst({
      where: { userId: user.id, status: "ACTIVE" },
    });

    req.user = {
      userId: user.id,
      cognitoSub: user.cognitoSub,
      role: (user.staffRole as AppRole) ?? "CUSTOMER",
      organisationId: membership?.organisationId,
      warehouseIds: user.staffWarehouseIds,
      accountStatus: user.status,
      // `!= null` rather than truthy: an approval limit of exactly 0 ("may
      // approve nothing") must not be coerced to `undefined` ("unlimited",
      // per evaluatePermission's treatment of a missing limit pre-fix, and
      // still the fallback for a caller with no membership row at all).
      approvalLimitAmountMinorUnits:
        membership?.approvalLimitAmountMinorUnits != null
          ? Number(membership.approvalLimitAmountMinorUnits)
          : undefined,
    };
    return true;
  }
}

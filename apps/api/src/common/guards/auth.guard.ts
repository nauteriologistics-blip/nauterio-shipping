import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { getPrismaClient } from "@nauterio/database";
import type { AppRole } from "@nauterio/contracts";

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
 *      which proves WHAT they're allowed to do - a valid token alone is
 *      never sufficient (spec section 27.3).
 *
 * In production, step 1 validates a real Cognito JWT against Cognito's
 * JWKS endpoint. No real Cognito User Pool exists yet (ADR 0001 section 11),
 * so LOCAL_AUTH_MODE substitutes a simple bearer-token-as-cognito-sub
 * lookup for local development ONLY - this must never be enabled outside
 * development/test (enforced by loadApiConfig's NODE_ENV check at the call
 * site in each module, not silently here).
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

    const cognitoSub = await this.resolveCognitoSub(token);
    if (!cognitoSub) {
      throw new UnauthorizedException("Invalid token");
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({ where: { cognitoSub } });
    if (!user) {
      throw new UnauthorizedException("No Nauterio account linked to this identity");
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
      approvalLimitAmountMinorUnits: membership?.approvalLimitAmountMinorUnits
        ? Number(membership.approvalLimitAmountMinorUnits)
        : undefined,
    };
    return true;
  }

  /**
   * LOCAL DEV ONLY: treats the bearer token as a Cognito sub directly.
   * Replace with real JWKS-based JWT verification before any non-local use
   * (see ADR 0001 section 6.1) - this is intentionally the only place that
   * needs to change when a real Cognito User Pool is provisioned.
   */
  private async resolveCognitoSub(token: string): Promise<string | null> {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AuthGuard.resolveCognitoSub: real Cognito JWT verification is not implemented yet - " +
          "refusing to start with the local-dev token passthrough in production."
      );
    }
    return token || null;
  }
}

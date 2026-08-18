import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { evaluatePermission } from "@nauterio/validation";
import { PERMISSION_KEY } from "../decorators/require-permission.decorator";
import { NO_PERMISSION_REQUIRED_KEY } from "../decorators/no-permission-required.decorator";

/**
 * Runs the spec section 27.3 evaluation chain (packages/validation's
 * evaluatePermission) against the AuthGuard-populated request.user context.
 * This is the ONE guard every permission-checked controller action uses -
 * per CLAUDE.md and ADR 0001 section 3.2, permission logic is never
 * duplicated inline in a controller.
 *
 * Fails closed (SEC-009): a route reached through this guard with neither
 * @RequirePermission() nor @NoPermissionRequired() throws, rather than
 * silently passing. A missing decorator on a security control is a
 * configuration error to surface immediately, not "no restriction".
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const action = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);
    const noPermissionRequired = this.reflector.getAllAndOverride<boolean>(
      NO_PERMISSION_REQUIRED_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!action) {
      if (noPermissionRequired) return true;
      throw new ForbiddenException(
        `${context.getClass().name}.${context.getHandler().name} is attached to PermissionGuard but declares ` +
          "neither @RequirePermission() nor @NoPermissionRequired() - refusing to serve rather than fail open."
      );
    }

    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user;
    if (!user) {
      throw new ForbiddenException("No authenticated user context");
    }

    const decision = evaluatePermission(
      {
        userId: user.userId,
        accountStatus: user.accountStatus as never,
        role: user.role,
        organisationId: user.organisationId,
        warehouseIds: user.warehouseIds,
        approvalLimitAmountMinorUnits: user.approvalLimitAmountMinorUnits,
      },
      { action: action as never }
    );

    if (!decision.allowed) {
      throw new ForbiddenException(decision.reason);
    }
    return true;
  }
}

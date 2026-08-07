import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { evaluatePermission } from "@nauterio/validation";
import { PERMISSION_KEY } from "../decorators/require-permission.decorator";

/**
 * Runs the spec section 27.3 evaluation chain (packages/validation's
 * evaluatePermission) against the AuthGuard-populated request.user context.
 * This is the ONE guard every permission-checked controller action uses -
 * per CLAUDE.md and ADR 0001 section 3.2, permission logic is never
 * duplicated inline in a controller.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const action = this.reflector.get<string>(PERMISSION_KEY, context.getHandler());
    if (!action) return true; // route did not declare @RequirePermission - AuthGuard alone applies

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

import { SetMetadata } from "@nestjs/common";

export const NO_PERMISSION_REQUIRED_KEY = "noPermissionRequired";

/**
 * Explicit escape hatch for a route attached to PermissionGuard that is
 * deliberately gated by something other than a role-baseline action -
 * usually a service-layer ownership/scope check (e.g. BillingService's
 * invoice list, scoped by the caller's own organisationId/userId, not by
 * a staff-only action). Any route reached through PermissionGuard MUST
 * declare either this or @RequirePermission() - an undecorated handler is
 * treated as a configuration error, not as "no restriction", per SEC-009.
 */
export const NoPermissionRequired = () => SetMetadata(NO_PERMISSION_REQUIRED_KEY, true);

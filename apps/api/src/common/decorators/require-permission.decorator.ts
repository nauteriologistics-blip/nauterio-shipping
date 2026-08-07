import { SetMetadata } from "@nestjs/common";
import type { PermissionAction } from "@nauterio/contracts";

export const PERMISSION_KEY = "requiredPermission";

/** Declares the permission a route requires - the guard resolves actual scope at request time. */
export const RequirePermission = (action: PermissionAction) => SetMetadata(PERMISSION_KEY, action);

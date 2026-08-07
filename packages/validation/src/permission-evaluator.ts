import type { AppRole, PermissionAction } from "@nauterio/contracts";
import { ROLE_BASELINE_ACTIONS, STAFF_ROLES } from "@nauterio/contracts";

/**
 * Server-side permission evaluation chain.
 * Source of truth: spec section 27.3 - "Every server action evaluates
 * identity, account status, global role, organisation membership,
 * warehouse/assignment scope, record relationship, requested operation,
 * approval limit and any separation-of-duties rule. Hiding a button in the
 * interface is not permission enforcement."
 *
 * This evaluator is the ONE place that chain is implemented. apps/api's
 * NestJS guard calls this - do not reimplement permission logic inline in
 * a controller (that is exactly how authorization bugs happen).
 */
export interface PermissionContext {
  userId: string;
  accountStatus: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "CLOSED";
  role: AppRole;
  organisationId?: string;
  warehouseIds: string[];
  approvalLimitAmountMinorUnits?: number;
}

export interface PermissionRequest {
  action: PermissionAction;
  /** The record's owning organisation/warehouse/customer, if any - used for scope checks. */
  recordOrganisationId?: string;
  recordWarehouseId?: string;
  recordOwnerUserId?: string;
  /** For actions with a monetary threshold (e.g. refund:approve). */
  requestedAmountMinorUnits?: number;
}

export interface PermissionDecision {
  allowed: boolean;
  reason: string;
}

function deny(reason: string): PermissionDecision {
  return { allowed: false, reason };
}

function allow(): PermissionDecision {
  return { allowed: true, reason: "granted" };
}

export function evaluatePermission(
  ctx: PermissionContext,
  req: PermissionRequest
): PermissionDecision {
  // 1. Account status
  if (ctx.accountStatus !== "ACTIVE") {
    return deny(`Account status is ${ctx.accountStatus}, not ACTIVE`);
  }

  // 2. Global role baseline
  const isStaff = (STAFF_ROLES as readonly string[]).includes(ctx.role);
  if (isStaff) {
    const allowedActions = ROLE_BASELINE_ACTIONS[ctx.role as (typeof STAFF_ROLES)[number]];
    if (!allowedActions.includes(req.action)) {
      return deny(`Role ${ctx.role} does not include action ${req.action}`);
    }
  } else {
    // Customer/organisation roles only ever act on their own records -
    // enforced below by the relationship check, not by a baseline action list.
  }

  // 3. Organisation membership scope
  if (req.recordOrganisationId && ctx.organisationId !== req.recordOrganisationId && isStaff === false) {
    return deny("Record belongs to a different organisation than the caller's membership");
  }

  // 4. Warehouse/assignment scope (staff only)
  if (isStaff && req.recordWarehouseId && ctx.warehouseIds.length > 0) {
    if (!ctx.warehouseIds.includes(req.recordWarehouseId)) {
      return deny(`Staff member is not assigned to warehouse ${req.recordWarehouseId}`);
    }
  }

  // 5. Record relationship (customer acting on their own record)
  if (!isStaff && req.recordOwnerUserId && req.recordOwnerUserId !== ctx.userId) {
    return deny("Caller does not own this record");
  }

  // 6. Approval limit (e.g. refund:approve, claim:approve)
  if (req.requestedAmountMinorUnits !== undefined && ctx.approvalLimitAmountMinorUnits !== undefined) {
    if (req.requestedAmountMinorUnits > ctx.approvalLimitAmountMinorUnits) {
      return deny(
        `Requested amount ${req.requestedAmountMinorUnits} exceeds approval limit ${ctx.approvalLimitAmountMinorUnits}`
      );
    }
  }

  // 7. Separation of duties: the same person who submits a claim/refund
  // request must not also be the one who approves it.
  if (
    (req.action === "refund:approve" || req.action === "claim:approve") &&
    req.recordOwnerUserId === ctx.userId
  ) {
    return deny("Separation of duties: approver must differ from the record owner/submitter");
  }

  return allow();
}

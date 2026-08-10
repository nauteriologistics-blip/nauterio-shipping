import type { AppRole, PermissionAction } from "@nauterio/contracts";
import { CUSTOMER_BASELINE_ACTIONS, ROLE_BASELINE_ACTIONS, STAFF_ROLES } from "@nauterio/contracts";

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

/**
 * SEC-010 item 5: which `PermissionRequest` fields each action's real
 * enforcement depends on. `refund:approve` obviously needs an amount to
 * check against a limit and an owner to check separation of duties;
 * `claim:approve`/`claim:reject` already correctly pass `recordOwnerUserId`
 * from `ClaimsReturnsService.decide()` today. Deliberately does NOT declare
 * requirements for every `PermissionAction` - only ones with a
 * domain-obvious requirement and/or an existing call site that already
 * supplies it, so this can't retroactively break a working flow or assert
 * something invented rather than observed.
 *
 * Only checked when `req` already carries *some* record-level context (see
 * `hasRecordContext` below) - the coarse guard-time check
 * (`PermissionGuard`, before any record is loaded) legitimately calls this
 * function with only `{ action }` and must keep working unchanged; this
 * metadata exists to catch a future service-layer call that loaded the
 * record but forgot one of the fields its own action needs, not to demand
 * context the guard structurally cannot have yet.
 */
const REQUIRED_SCOPE_FIELDS: Partial<Record<PermissionAction, (keyof PermissionRequest)[]>> = {
  "refund:approve": ["recordOwnerUserId", "requestedAmountMinorUnits"],
  "claim:approve": ["recordOwnerUserId"],
  "claim:reject": ["recordOwnerUserId"],
};

function hasRecordContext(req: PermissionRequest): boolean {
  return (
    req.recordOrganisationId !== undefined ||
    req.recordWarehouseId !== undefined ||
    req.recordOwnerUserId !== undefined ||
    req.requestedAmountMinorUnits !== undefined
  );
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
    // Customer/organisation roles are restricted to their own explicit
    // baseline - never exempted from a baseline check on the assumption
    // that the record-relationship check (step 5) will compensate. That
    // check cannot run meaningfully at guard time (no record is loaded
    // yet), so leaving this branch empty previously granted every
    // PermissionAction, including staff-only ones, to every customer.
    if (!CUSTOMER_BASELINE_ACTIONS.includes(req.action)) {
      return deny(`Role ${ctx.role} does not include action ${req.action}`);
    }
  }

  // SEC-010 item 5: a caller that supplied SOME record context (meaning
  // this is a real per-record evaluation, not the guard's bare coarse
  // check) must supply ALL of the context fields this action's own
  // enforcement depends on - a caller loading a real refund record and
  // calling this with `recordOwnerUserId` but forgetting
  // `requestedAmountMinorUnits` must not have the approval-limit check
  // silently skipped (step 6 below is `if (requestedAmountMinorUnits !==
  // undefined)`, which would otherwise treat "forgot to pass it" the same
  // as "no limit applies").
  if (hasRecordContext(req)) {
    const required = REQUIRED_SCOPE_FIELDS[req.action];
    if (required) {
      const missing = required.filter((field) => req[field] === undefined);
      if (missing.length > 0) {
        return deny(
          `Action ${req.action} requires ${missing.join(", ")} to be supplied for evaluation, but ${
            missing.length > 1 ? "they were" : "it was"
          } not - this looks like a caller bug, not a legitimate permission denial`
        );
      }
    }
  }

  // 3. Organisation membership scope
  if (req.recordOrganisationId && ctx.organisationId !== req.recordOrganisationId && isStaff === false) {
    return deny("Record belongs to a different organisation than the caller's membership");
  }

  // 4. Warehouse/assignment scope (staff only). An empty warehouseIds array
  // means "assigned to no warehouse", not "scoping does not apply" - a
  // staff member with no assignments must not pass this check by default.
  if (isStaff && req.recordWarehouseId) {
    if (!ctx.warehouseIds.includes(req.recordWarehouseId)) {
      return deny(`Staff member is not assigned to warehouse ${req.recordWarehouseId}`);
    }
  }

  // 5. Record relationship (customer acting on their own record)
  if (!isStaff && req.recordOwnerUserId && req.recordOwnerUserId !== ctx.userId) {
    return deny("Caller does not own this record");
  }

  // 6. Approval limit (e.g. refund:approve, claim:approve). A missing limit
  // means "may approve nothing" (treated as 0), not "unlimited" - an action
  // that carries a requested amount always requires an explicit, positive
  // limit to clear this check.
  if (req.requestedAmountMinorUnits !== undefined) {
    const limit = ctx.approvalLimitAmountMinorUnits ?? 0;
    if (req.requestedAmountMinorUnits > limit) {
      return deny(`Requested amount ${req.requestedAmountMinorUnits} exceeds approval limit ${limit}`);
    }
  }

  // 7. Separation of duties: the same person who submits a claim/refund
  // request must not also be the one who approves it.
  if (
    (req.action === "refund:approve" || req.action === "claim:approve" || req.action === "claim:reject") &&
    req.recordOwnerUserId === ctx.userId
  ) {
    return deny("Separation of duties: approver must differ from the record owner/submitter");
  }

  return allow();
}

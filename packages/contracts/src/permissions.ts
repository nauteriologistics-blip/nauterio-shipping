/**
 * Staff roles from docs/nauterio-complete-specification.md, Appendix E.
 * This is a baseline role list only - the server permission model also
 * applies warehouse, assignment, organisation, customer relationship,
 * approval limit, record state, and separation-of-duties constraints on
 * top of role (see packages/validation/src/permission-evaluator.ts and
 * spec section 27.3). Never treat "has role X" as sufficient authorization
 * by itself.
 */
export const STAFF_ROLES = [
  "SUPER_ADMIN",
  "OPERATIONS",
  "WAREHOUSE",
  "SUPPORT",
  "FINANCE",
  "CUSTOMS",
  "DRIVER",
  "AUDITOR",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const CUSTOMER_ROLES = ["CUSTOMER", "ORGANISATION_MEMBER", "ORGANISATION_ADMIN"] as const;
export type CustomerRole = (typeof CUSTOMER_ROLES)[number];

export type AppRole = StaffRole | CustomerRole;

export type PermissionAction =
  | "shipment:create"
  | "shipment:edit"
  | "shipment:hold"
  | "shipment:read"
  | "tracking_event:add"
  | "tracking_event:correct"
  | "customer_pii:view"
  | "identity_document:view"
  | "document:read"
  | "document:review"
  | "invoice:read"
  | "invoice:manage"
  | "organisation:read"
  | "warehouse:read"
  | "bank_transfer:confirm"
  | "refund:approve"
  | "claim:approve"
  | "claim:reject"
  | "staff:manage"
  | "data:export"
  | "user:erase"
  | "pilot:manage"
  | "support:manage";

/**
 * Baseline role -> allowed-action map mirroring Appendix E's matrix.
 * "Limited"/"According to limit"/"Restricted" entries from the spec are
 * intentionally NOT reduced to a boolean here - those require the fuller
 * evaluation chain in packages/validation, keyed off this constant plus
 * runtime context (approval limit, warehouse scope, record state).
 */
export const ROLE_BASELINE_ACTIONS: Record<StaffRole, PermissionAction[]> = {
  SUPER_ADMIN: [
    "shipment:create",
    "shipment:edit",
    "shipment:hold",
    "shipment:read",
    "tracking_event:add",
    "tracking_event:correct",
    "customer_pii:view",
    "identity_document:view",
    "document:read",
    "document:review",
    "invoice:read",
    "invoice:manage",
    "organisation:read",
    "warehouse:read",
    "bank_transfer:confirm",
    "refund:approve",
    "claim:approve",
    "claim:reject",
    "staff:manage",
    "data:export",
    // SEC-011/ADR 0002: GDPR erasure is the most sensitive action in the
    // catalogue - SUPER_ADMIN only, not shared with OPERATIONS or any other
    // staff role.
    "user:erase",
    "pilot:manage",
    "support:manage",
  ],
  OPERATIONS: [
    "shipment:create",
    "shipment:edit",
    "shipment:hold",
    "shipment:read",
    "tracking_event:add",
    "tracking_event:correct",
    "customer_pii:view",
    "document:read",
    "document:review",
    "invoice:read",
    "invoice:manage",
    "organisation:read",
    "warehouse:read",
    "refund:approve",
    "claim:approve",
    "claim:reject",
    "data:export",
    "pilot:manage",
    "support:manage",
  ],
  WAREHOUSE: ["shipment:read", "tracking_event:add", "customer_pii:view", "warehouse:read"],
  SUPPORT: ["shipment:read", "customer_pii:view", "document:read", "invoice:read", "organisation:read", "pilot:manage", "support:manage"],
  FINANCE: [
    "shipment:read",
    "customer_pii:view",
    "bank_transfer:confirm",
    "invoice:read",
    "invoice:manage",
    "organisation:read",
  ],
  CUSTOMS: [
    "shipment:read",
    "tracking_event:add",
    "customer_pii:view",
    "identity_document:view",
    "document:read",
    "document:review",
    "data:export",
  ],
  DRIVER: ["shipment:read", "tracking_event:add"],
  AUDITOR: ["shipment:read", "document:read", "invoice:read", "organisation:read"],
};

/**
 * Baseline actions available to every non-staff (customer/organisation)
 * caller, before the record-relationship check in the evaluator narrows it
 * to records they actually own (spec section 27.3). Deliberately does not
 * include anything staff-only (refund:approve, claim:approve, staff:manage,
 * data:export, bank_transfer:confirm) - a customer must never be granted
 * those regardless of what record context is or isn't supplied. Historical
 * note: prior to this list existing, non-staff roles were exempted from any
 * baseline check at all on the assumption the record-relationship check
 * would compensate - it structurally cannot, since PermissionGuard runs
 * before any record is loaded (see permission-evaluator.ts step 2).
 */
export const CUSTOMER_BASELINE_ACTIONS: PermissionAction[] = [
  "shipment:read",
  "document:read",
  "invoice:read",
  "organisation:read",
];

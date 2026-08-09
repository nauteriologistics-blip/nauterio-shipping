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
  | "shipment:read"
  | "tracking_event:add"
  | "tracking_event:correct"
  | "customer_pii:view"
  | "identity_document:view"
  | "bank_transfer:confirm"
  | "refund:approve"
  | "claim:approve"
  | "claim:reject"
  | "staff:manage"
  | "data:export";

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
    "shipment:read",
    "tracking_event:add",
    "tracking_event:correct",
    "customer_pii:view",
    "identity_document:view",
    "bank_transfer:confirm",
    "refund:approve",
    "claim:approve",
    "claim:reject",
    "staff:manage",
    "data:export",
  ],
  OPERATIONS: [
    "shipment:create",
    "shipment:edit",
    "shipment:read",
    "tracking_event:add",
    "tracking_event:correct",
    "customer_pii:view",
    "refund:approve",
    "claim:approve",
    "claim:reject",
    "data:export",
  ],
  WAREHOUSE: ["shipment:read", "tracking_event:add", "customer_pii:view"],
  SUPPORT: ["shipment:read", "customer_pii:view"],
  FINANCE: ["shipment:read", "customer_pii:view", "bank_transfer:confirm"],
  CUSTOMS: ["shipment:read", "tracking_event:add", "customer_pii:view", "identity_document:view", "data:export"],
  DRIVER: ["shipment:read", "tracking_event:add"],
  AUDITOR: ["shipment:read"],
};

import { describe, it, expect } from "vitest";
import { evaluatePermission, type PermissionContext } from "./permission-evaluator";

const baseCtx: PermissionContext = {
  userId: "user-1",
  accountStatus: "ACTIVE",
  role: "OPERATIONS",
  warehouseIds: [],
};

describe("evaluatePermission", () => {
  it("denies any action when the account is not ACTIVE (spec 27.3)", () => {
    const decision = evaluatePermission(
      { ...baseCtx, accountStatus: "SUSPENDED" },
      { action: "shipment:read" }
    );
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toMatch(/SUSPENDED/);
  });

  it("allows a staff role to perform an action in its baseline set", () => {
    const decision = evaluatePermission(baseCtx, { action: "shipment:create" });
    expect(decision.allowed).toBe(true);
  });

  it("denies a staff role an action outside its baseline set (WAREHOUSE cannot confirm bank transfers)", () => {
    const decision = evaluatePermission(
      { ...baseCtx, role: "WAREHOUSE" },
      { action: "bank_transfer:confirm" }
    );
    expect(decision.allowed).toBe(false);
  });

  it("denies a customer acting on a record they do not own", () => {
    const decision = evaluatePermission(
      { ...baseCtx, role: "CUSTOMER" },
      { action: "shipment:read", recordOwnerUserId: "someone-else" }
    );
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toMatch(/does not own/);
  });

  it("allows a customer acting on their own record", () => {
    const decision = evaluatePermission(
      { ...baseCtx, role: "CUSTOMER" },
      { action: "shipment:read", recordOwnerUserId: "user-1" }
    );
    expect(decision.allowed).toBe(true);
  });

  it("denies staff acting on a record outside their assigned warehouse", () => {
    const decision = evaluatePermission(
      { ...baseCtx, role: "WAREHOUSE", warehouseIds: ["warehouse-a"] },
      { action: "shipment:read", recordWarehouseId: "warehouse-b" }
    );
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toMatch(/not assigned/);
  });

  it("denies a refund request exceeding the caller's approval limit", () => {
    const decision = evaluatePermission(
      { ...baseCtx, approvalLimitAmountMinorUnits: 10_000 },
      { action: "refund:approve", requestedAmountMinorUnits: 50_000 }
    );
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toMatch(/exceeds approval limit/);
  });

  it("allows a refund request within the caller's approval limit", () => {
    const decision = evaluatePermission(
      { ...baseCtx, approvalLimitAmountMinorUnits: 100_000 },
      { action: "refund:approve", requestedAmountMinorUnits: 50_000 }
    );
    expect(decision.allowed).toBe(true);
  });

  it("enforces separation of duties: approver must differ from record owner", () => {
    const decision = evaluatePermission(baseCtx, {
      action: "refund:approve",
      recordOwnerUserId: "user-1", // same as ctx.userId
      requestedAmountMinorUnits: 100,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toMatch(/Separation of duties/);
  });
});

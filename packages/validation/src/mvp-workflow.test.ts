import { describe, expect, it } from "vitest";
import { MVP_ADMIN_TRACKING_STATUSES, canTransitionDocumentReview, canTransitionMalwareScan, canTransitionShipmentLifecycle, canTransitionShipmentRequest } from "@nauterio/contracts";

describe("MVP workflow contracts", () => {
  it("moves an approved submitted request to payment but not directly to shipment conversion", () => {
    expect(canTransitionShipmentRequest("SUBMITTED", "AWAITING_PAYMENT")).toBe(true);
    expect(canTransitionShipmentRequest("SUBMITTED", "APPROVED")).toBe(false);
    expect(canTransitionShipmentRequest("SUBMITTED", "CONVERTED")).toBe(false);
  });

  it("makes rejected and converted requests terminal", () => {
    expect(canTransitionShipmentRequest("REJECTED", "DRAFT")).toBe(false);
    expect(canTransitionShipmentRequest("CONVERTED", "DRAFT")).toBe(false);
  });

  it("does not let a delivered shipment return to active", () => {
    expect(canTransitionShipmentLifecycle("DELIVERED", "ACTIVE")).toBe(false);
    expect(canTransitionShipmentLifecycle("DELIVERED", "ARCHIVED")).toBe(true);
  });

  it("excludes deferred payment and return statuses from manual admin choices", () => {
    const codes = MVP_ADMIN_TRACKING_STATUSES.map((status) => status.code);
    expect(codes).not.toContain("AWAITING_PAYMENT");
    expect(codes).not.toContain("RETURN_REQUESTED");
    expect(codes).toContain("DELIVERED");
  });

  it("keeps document review decisions terminal except a requested replacement", () => {
    expect(canTransitionDocumentReview("PROCESSING", "APPROVED")).toBe(true);
    expect(canTransitionDocumentReview("APPROVED", "PROCESSING")).toBe(false);
    expect(canTransitionDocumentReview("REPLACEMENT_REQUIRED", "PROCESSING")).toBe(true);
  });

  it("allows a malware result to be written only once", () => {
    expect(canTransitionMalwareScan("PENDING", "CLEAN")).toBe(true);
    expect(canTransitionMalwareScan("INFECTED", "CLEAN")).toBe(false);
    expect(canTransitionMalwareScan("CLEAN", "ERROR")).toBe(false);
  });
});

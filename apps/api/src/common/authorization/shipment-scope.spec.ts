import { shipmentScopeWhere } from "./shipment-scope";

describe("shipmentScopeWhere", () => {
  it("restricts drivers to pickup or delivery assignments", () => {
    expect(shipmentScopeWhere({ role: "DRIVER", userId: "driver-1" })).toEqual({
      OR: [
        { deliveries: { some: { assignedDriverUserId: "driver-1" } } },
        { pickups: { some: { assignedDriverUserId: "driver-1" } } },
      ],
    });
  });

  it("keeps customer records owner-scoped", () => {
    expect(shipmentScopeWhere({ role: "CUSTOMER", userId: "customer-1" })).toEqual({ ownerUserId: "customer-1" });
  });
});

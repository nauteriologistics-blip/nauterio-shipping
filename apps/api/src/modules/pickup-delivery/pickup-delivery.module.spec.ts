import { ForbiddenException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as databaseModule from "@nauterio/database";
import { AuditService } from "../audit/audit.module";
import { PickupDeliveryService } from "./pickup-delivery.module";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

jest.mock("@nauterio/database", () => ({ getPrismaClient: jest.fn() }));

const driver: AuthenticatedUser = {
  userId: "driver-1",
  cognitoSub: "driver-sub-1",
  role: "DRIVER",
  accountStatus: "ACTIVE",
  warehouseIds: [],
};

describe("PickupDeliveryService", () => {
  let service: PickupDeliveryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PickupDeliveryService, { provide: AuditService, useValue: { record: jest.fn() } }],
    }).compile();
    service = module.get(PickupDeliveryService);
  });

  it("lists only the signed-in driver's open assignments", async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    (databaseModule.getPrismaClient as jest.Mock).mockReturnValue({ delivery: { findMany } });
    await service.listMyAssignments(driver);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { assignedDriverUserId: "driver-1", status: { in: ["SCHEDULED", "OUT_FOR_DELIVERY"] } },
    }));
  });

  it("rejects the driver screen for non-driver staff", async () => {
    await expect(service.listMyAssignments({ ...driver, role: "OPERATIONS" })).rejects.toThrow(ForbiddenException);
  });

  it("refuses delivery confirmation without an active assignment", async () => {
    (databaseModule.getPrismaClient as jest.Mock).mockReturnValue({ delivery: { findFirst: jest.fn().mockResolvedValue(null) } });
    await expect(service.confirmDelivery("shipment-1", { recipientName: "Recipient" }, driver)).rejects.toThrow("not assigned");
  });
});

import { BadRequestException } from "@nestjs/common";
import * as databaseModule from "@nauterio/database";
import { TrackingService } from "./tracking.service";

jest.mock("@nauterio/database", () => ({ getPrismaClient: jest.fn() }));

describe("TrackingService estimated delivery", () => {
  const audit = { record: jest.fn().mockResolvedValue(undefined) };
  const service = new TrackingService(audit);

  beforeEach(() => jest.clearAllMocks());

  it("persists an ETA window and emits an update for customer tracking", async () => {
    const shipment = {
      id: "shipment-1",
      version: 3,
      lifecycleStatus: "ACTIVE",
      trackingNumber: "NT-1234567890-US",
      estimatedDeliveryFrom: null,
      estimatedDeliveryTo: null,
    };
    const updateMany = jest.fn<Promise<{ count: number }>, [{ where: { id: string; version: number }; data: { version: { increment: number } } }]>().mockResolvedValue({ count: 1 });
    const outboxCreate = jest.fn<Promise<object>, [{ data: { eventType: string } }]>().mockResolvedValue({});
    const findUniqueOrThrow = jest.fn().mockResolvedValue({
      ...shipment,
      estimatedDeliveryFrom: new Date("2026-09-14T00:00:00.000Z"),
      estimatedDeliveryTo: new Date("2026-09-16T00:00:00.000Z"),
    });
    const tx = { shipment: { updateMany, findUniqueOrThrow }, outboxEvent: { create: outboxCreate } };
    (databaseModule.getPrismaClient as jest.Mock).mockReturnValue({
      shipment: { findUnique: jest.fn().mockResolvedValue(shipment) },
      $transaction: jest.fn((callback: (value: typeof tx) => unknown) => callback(tx)),
    });

    await service.updateEstimatedDelivery(
      "shipment-1",
      { estimatedDeliveryFrom: "2026-09-14", estimatedDeliveryTo: "2026-09-16" },
      "staff-1",
      "correlation-1"
    );

    expect(updateMany.mock.calls[0]?.[0].where).toEqual({ id: "shipment-1", version: 3 });
    expect(updateMany.mock.calls[0]?.[0].data.version).toEqual({ increment: 1 });
    expect(outboxCreate.mock.calls[0]?.[0].data.eventType).toBe("shipment.eta.updated");
    expect(audit.record).toHaveBeenCalledWith(expect.objectContaining({ action: "SHIPMENT_ESTIMATED_DELIVERY_UPDATED" }), tx);
  });

  it("rejects a delivery window whose end precedes its start", async () => {
    await expect(service.updateEstimatedDelivery(
      "shipment-1",
      { estimatedDeliveryFrom: "2026-09-16", estimatedDeliveryTo: "2026-09-14" },
      "staff-1",
      "correlation-1"
    )).rejects.toThrow(BadRequestException);
  });
});

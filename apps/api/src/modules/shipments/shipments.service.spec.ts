import * as databaseModule from "@nauterio/database";
import { ShipmentsService } from "./shipments.service";

jest.mock("@nauterio/database", () => ({ getPrismaClient: jest.fn() }));

describe("ShipmentsService tracking number generation", () => {
  const audit = { record: jest.fn().mockResolvedValue(undefined) };
  beforeEach(() => jest.clearAllMocks());

  it("generates an opaque Crockford-base32 tracking number", async () => {
    (databaseModule.getPrismaClient as jest.Mock).mockReturnValue({
      shipment: { findUnique: jest.fn().mockResolvedValue(null) },
    });

    const trackingNumber = await new ShipmentsService(audit).generateTrackingNumber();

    expect(trackingNumber).toMatch(/^NT-[0-9A-HJKMNP-TV-Z]{10}-US$/);
  });

  it("checks database uniqueness and retries a collision", async () => {
    const findUnique = jest.fn()
      .mockResolvedValueOnce({ id: "collision" })
      .mockResolvedValueOnce(null);
    (databaseModule.getPrismaClient as jest.Mock).mockReturnValue({ shipment: { findUnique } });

    await new ShipmentsService(audit).generateTrackingNumber();

    expect(findUnique).toHaveBeenCalledTimes(2);
  });

  it("uses the validated destination country as the tracking suffix", async () => {
    (databaseModule.getPrismaClient as jest.Mock).mockReturnValue({
      shipment: { findUnique: jest.fn().mockResolvedValue(null) },
    });

    const trackingNumber = await new ShipmentsService(audit).generateTrackingNumber("DE");

    expect(trackingNumber).toMatch(/^NT-[0-9A-HJKMNP-TV-Z]{10}-DE$/);
  });

  it("creates a manual shipment, package, first tracking event, and outbox event atomically", async () => {
    const createdShipment = { id: "shipment-1", trackingNumber: "NT-1234567890-DE" };
    const tx = {
      shipment: { create: jest.fn().mockResolvedValue(createdShipment) },
      package: { create: jest.fn().mockResolvedValue({}) },
      trackingEvent: { create: jest.fn().mockResolvedValue({}) },
      outboxEvent: { create: jest.fn().mockResolvedValue({}) },
    };
    (databaseModule.getPrismaClient as jest.Mock).mockReturnValue({
      user: { findFirst: jest.fn().mockResolvedValue({ id: "00000000-0000-0000-0000-000000000001", organisationMemberships: [] }) },
      service: { findFirst: jest.fn().mockResolvedValue({ id: "AIR_EXPRESS" }) },
      shipment: { findUnique: jest.fn().mockResolvedValue(null) },
      $transaction: jest.fn((callback: (value: typeof tx) => unknown) => callback(tx)),
    });

    const result = await new ShipmentsService(audit).createAdminShipment({
      ownerUserId: "00000000-0000-0000-0000-000000000001",
      serviceId: "AIR_EXPRESS",
      senderName: "Sender", senderLine1: "1 Via Roma", senderCity: "Milan", senderPostalCode: "20121", senderCountry: "IT", senderPhone: "+390000000", senderEmail: "sender@example.com",
      receiverName: "Receiver", receiverLine1: "1 Hauptstrasse", receiverCity: "Berlin", receiverPostalCode: "10115", receiverCountry: "DE", receiverPhone: "+490000000", receiverEmail: "receiver@example.com",
      weightKg: 10, lengthCm: 40, widthCm: 30, heightCm: 20,
      declaredValue: 500, totalAmount: 125, currency: "EUR", customerReference: "MANUAL-1",
    }, "staff-1", "correlation-1");

    expect(result).toBe(createdShipment);
    expect(tx.shipment.create).toHaveBeenCalledTimes(1);
    expect(tx.package.create).toHaveBeenCalledTimes(1);
    expect(tx.trackingEvent.create).toHaveBeenCalledTimes(1);
    expect(tx.outboxEvent.create).toHaveBeenCalledTimes(1);
    expect(audit.record).toHaveBeenCalledWith(expect.objectContaining({ action: "SHIPMENT_CREATED_MANUALLY" }), tx);
  });
});

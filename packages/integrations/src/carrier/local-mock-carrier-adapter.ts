import { randomUUID } from "node:crypto";
import type { CarrierAdapter, CarrierTrackingEvent, CreateCarrierShipmentInput } from "./carrier-adapter";

/** Local-dev only - see LocalMockPaymentAdapter for the same rationale. */
export class LocalMockCarrierAdapter implements CarrierAdapter {
  readonly carrierName = "LOCAL_MOCK";

  async createShipment(_input: CreateCarrierShipmentInput): Promise<{ carrierReference: string }> {
    return { carrierReference: `MOCK-${randomUUID().slice(0, 8).toUpperCase()}` };
  }

  async fetchTrackingEvents(carrierReference: string): Promise<CarrierTrackingEvent[]> {
    return [
      {
        providerEventId: `${carrierReference}-1`,
        status: "DEPARTED_ORIGIN",
        occurredAt: new Date().toISOString(),
        locationText: "Milan Malpensa Airport (MXP)",
      },
    ];
  }
}

import { CarrierAdapter, CreateCarrierShipmentInput, CarrierTrackingEvent } from "./carrier-adapter";

export class DhlCarrierAdapter implements CarrierAdapter {
  readonly carrierName = "DHL_EXPRESS" as const;

  async createShipment(input: CreateCarrierShipmentInput): Promise<{ carrierReference: string }> {
    console.log(`[DhlCarrierAdapter] Creating DHL shipment for service ${input.serviceId}`);
    return {
      carrierReference: `DHL-${Date.now().toString(36).toUpperCase()}`,
    };
  }

  async fetchTrackingEvents(carrierReference: string): Promise<CarrierTrackingEvent[]> {
    console.log(`[DhlCarrierAdapter] Fetching tracking events for ${carrierReference}`);
    return [
      {
        providerEventId: `dhl-evt-1`,
        status: "PROCESSING_ORIGIN",
        occurredAt: new Date().toISOString(),
        locationText: "DHL Hub Leipzig, Germany",
      },
    ];
  }
}

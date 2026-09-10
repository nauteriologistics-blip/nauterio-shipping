/**
 * Provider-neutral carrier adapter interface (ADR 0001 section 9.1).
 * No real carrier is contracted yet (ADR section 11, item 1) - this
 * interface exists so ShipmentsModule/TrackingModule can be built and
 * available for local contract tests only. The production operating model
 * coordinates independent carriers manually and does not instantiate this
 * interface (ADR 0004).
 * without touching domain logic.
 */
import type { TrackingStatus } from "@nauterio/contracts";

export interface CarrierTrackingEvent {
  providerEventId: string;
  status: TrackingStatus;
  occurredAt: string; // ISO 8601
  locationText?: string;
}

export interface CreateCarrierShipmentInput {
  serviceId: string;
  originAddress: Record<string, string>;
  destinationAddress: Record<string, string>;
  chargeableWeightKg: number;
}

export interface CarrierAdapter {
  readonly carrierName: string;
  createShipment(input: CreateCarrierShipmentInput): Promise<{ carrierReference: string }>;
  fetchTrackingEvents(carrierReference: string): Promise<CarrierTrackingEvent[]>;
}

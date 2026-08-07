import { Injectable, NotFoundException } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { TRACKING_STATUS_META, type TrackingStatus } from "@nauterio/contracts";

export interface PublicTrackingEvent {
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
}

/** Coarse category for UI badge colouring only - the customer-facing text
 * always comes from the full canonical catalogue's customerLabel, never
 * this category (see spec Appendix C: 34 statuses, not 4). */
export type StatusCategory = "delivered" | "action_required" | "in_progress" | "cancelled";

export interface PublicShipmentTracking {
  id: string;
  service: string;
  origin: string;
  destination: string;
  status: string;
  statusCategory: StatusCategory;
  estimatedDelivery: string;
  chargeableWeight: string;
  actionRequired?: string;
  events: PublicTrackingEvent[];
}

/**
 * Public tracking lookup. Spec section 31: threat-model "tracking
 * enumeration" - tracking numbers are opaque (not sequential), and this
 * endpoint's route in tracking.controller.ts carries a stricter rate limit
 * than authenticated endpoints (enforced at the guard/throttle layer, not
 * duplicated here).
 */
@Injectable()
export class TrackingService {
  async getByTrackingNumber(trackingNumber: string): Promise<PublicShipmentTracking> {
    const prisma = getPrismaClient();
    const clean = trackingNumber.trim().toUpperCase();

    const shipment = await prisma.shipment.findFirst({
      where: { trackingNumber: { equals: clean, mode: "insensitive" } },
      include: {
        trackingEvents: { orderBy: { eventTime: "desc" } },
        service: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment tracking number '${clean}' not found.`);
    }

    const senderSnapshot = shipment.senderAddressSnapshot as Record<string, string>;
    const receiverSnapshot = shipment.receiverAddressSnapshot as Record<string, string>;

    const visibleEvents = shipment.trackingEvents.filter((e) => e.visibility !== "INTERNAL");
    const latestEvent = visibleEvents[0];
    const latestMeta = latestEvent
      ? TRACKING_STATUS_META[latestEvent.canonicalCode as TrackingStatus]
      : undefined;

    return {
      id: shipment.trackingNumber,
      service: shipment.service.name,
      origin: formatLocation(senderSnapshot),
      destination: formatLocation(receiverSnapshot),
      status: latestMeta?.customerLabel ?? shipment.lifecycleStatus,
      statusCategory: deriveStatusCategory(shipment.lifecycleStatus, latestMeta?.actionRequired ?? false),
      estimatedDelivery: shipment.deliveredAt
        ? `Delivered ${shipment.deliveredAt.toISOString().slice(0, 10)}`
        : shipment.estimatedDeliveryTo?.toISOString().slice(0, 10) ?? "Not yet available",
      chargeableWeight: `${shipment.totalChargeableWeightKg.toFixed(2)} kg`,
      actionRequired: shipment.actionRequiredReason ?? undefined,
      events: visibleEvents.map((e) => ({
        date: e.eventTime.toISOString().slice(0, 10),
        time: e.eventTime.toISOString().slice(11, 16),
        location: formatLocationJson(e.locationJson),
        status: e.publicTitleEn,
        description: e.publicDescriptionEn ?? "",
      })),
    };
  }
}

function deriveStatusCategory(
  lifecycleStatus: string,
  actionRequired: boolean
): "delivered" | "action_required" | "in_progress" | "cancelled" {
  if (lifecycleStatus === "DELIVERED" || lifecycleStatus === "ARCHIVED") return "delivered";
  if (lifecycleStatus === "CANCELLED") return "cancelled";
  if (actionRequired || lifecycleStatus === "ACTION_REQUIRED") return "action_required";
  return "in_progress";
}

function formatLocation(snapshot: Record<string, string>): string {
  const parts = [snapshot.city, snapshot.countryCode].filter(Boolean);
  return parts.join(", ") || "Unknown";
}

function formatLocationJson(json: unknown): string {
  if (json && typeof json === "object") {
    const loc = json as Record<string, string>;
    return [loc.city, loc.facility].filter(Boolean).join(", ") || "In transit";
  }
  return "In transit";
}

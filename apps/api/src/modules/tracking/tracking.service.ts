import { Injectable, NotFoundException } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { TRACKING_STATUS_META, TRACKING_STATUSES, type TrackingStatus } from "@nauterio/contracts";

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
const MAX_TRACKING_EVENTS_RETURNED = 100;

@Injectable()
export class TrackingService {
  async getByTrackingNumber(trackingNumber: string): Promise<PublicShipmentTracking> {
    const prisma = getPrismaClient();
    const clean = trackingNumber.trim().toUpperCase();

    // REL-003: the input is already uppercased, so `mode: "insensitive"`
    // (compiles to ILIKE) was pure cost - it can use neither the plain
    // unique B-tree on tracking_number nor the UNIQUE INDEX ON
    // shipments(UPPER(tracking_number)) the constraints migration
    // deliberately created for exactly this lookup. `findUnique` on the
    // already-normalised value hits that index directly, turning the
    // hottest anonymous endpoint from a sequential scan back into O(1).
    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber: clean },
      include: {
        trackingEvents: {
          // DATA-012: exclude events a later correction has superseded,
          // and use `id` (UUIDv7, time-ordered) as a deterministic
          // secondary sort so two events sharing an `eventTime` (common
          // with minute-granularity carrier feeds) don't reorder between
          // requests - `id desc` is both stable and chronologically valid.
          // REL-017: visibility is now filtered here, in the query, rather
          // than in JS after fetch - matches shipments.service.ts's
          // already-correct pattern, and means `take` caps at 100 *public*
          // events rather than 100 total-then-filtered (which could return
          // fewer than 100 visible events if internal ones were interspersed
          // within the top 100 fetched).
          where: { corrections: { none: {} }, visibility: { not: "INTERNAL" } },
          orderBy: [{ eventTime: "desc" }, { id: "desc" }],
          take: MAX_TRACKING_EVENTS_RETURNED,
        },
        service: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment tracking number '${clean}' not found.`);
    }

    const senderSnapshot = shipment.senderAddressSnapshot as Record<string, string>;
    const receiverSnapshot = shipment.receiverAddressSnapshot as Record<string, string>;

    const visibleEvents = shipment.trackingEvents;
    const latestEvent = visibleEvents[0];
    // DATA-011: canonicalCode is now guarded by a database CHECK constraint
    // mirroring TRACKING_STATUSES, but this lookup is still keyed by
    // whatever string is in the row - an explicit `in` guard fails closed
    // (falls back to lifecycleStatus, same as no event at all) instead of
    // an unchecked cast silently producing `undefined` metadata.
    const latestMeta =
      latestEvent && isTrackingStatus(latestEvent.canonicalCode) ? TRACKING_STATUS_META[latestEvent.canonicalCode] : undefined;

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

function isTrackingStatus(code: string): code is TrackingStatus {
  return (TRACKING_STATUSES as readonly string[]).includes(code);
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

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { MVP_ADMIN_TRACKING_STATUSES, TRACKING_STATUS_META, TRACKING_STATUSES, canTransitionShipmentLifecycle, type MvpShipmentLifecycleStatus, type TrackingStatus } from "@nauterio/contracts";
import { AuditService } from "../audit/audit.module";
import type { AddAdminTrackingEventDto, CorrectAdminTrackingEventDto } from "./dto/admin-tracking-event.dto";

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
  constructor(private readonly auditService: AuditService) {}

  async getAdminStatuses(shipmentId: string) {
    const shipment = await getPrismaClient().shipment.findUnique({ where: { id: shipmentId }, select: { lifecycleStatus: true } });
    if (!shipment) throw new NotFoundException("Shipment not found");
    const current = shipment.lifecycleStatus;
    return MVP_ADMIN_TRACKING_STATUSES.map((status) => {
      const next = lifecycleForTrackingStatus(status.code);
      return { ...status, allowedForNewEvent: current === next || canTransitionShipmentLifecycle(current, next) };
    });
  }

  async addAdminEvent(shipmentId: string, dto: AddAdminTrackingEventDto, actorUserId: string, correlationId: string) {
    return this.writeAdminEvent(shipmentId, dto, actorUserId, correlationId);
  }

  async setOperationalHold(shipmentId: string, hold: boolean, reason: string | undefined, actorUserId: string, correlationId: string) {
    const cleanReason = reason?.trim();
    if (hold && !cleanReason) throw new BadRequestException("A hold reason is required");
    const prisma = getPrismaClient();
    const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
    if (!shipment) throw new NotFoundException("Shipment not found");
    if (["DELIVERED", "CANCELLED", "ARCHIVED"].includes(shipment.lifecycleStatus)) throw new BadRequestException("This shipment can no longer be held");
    if (hold && shipment.lifecycleStatus !== "ACTIVE") throw new BadRequestException("Resolve the current action-required state before placing an operational hold");
    if (shipment.operationalHold === hold) return shipment;

    return prisma.$transaction(async (tx) => {
      const claimed = await tx.shipment.updateMany({ where: { id: shipmentId, version: shipment.version, operationalHold: !hold }, data: { operationalHold: hold, holdReason: hold ? cleanReason : null, heldAt: hold ? new Date() : null, heldByUserId: hold ? actorUserId : null, lifecycleStatus: hold ? "ACTION_REQUIRED" : "ACTIVE", actionRequiredReason: hold ? cleanReason : null, version: { increment: 1 } } });
      if (claimed.count !== 1) throw new BadRequestException("Shipment changed; refresh and try again");
      const event = await tx.trackingEvent.create({ data: { shipmentId, canonicalCode: hold ? "DELAYED" : "PROCESSING_ORIGIN", publicTitleEn: hold ? "Shipment on hold" : "Shipment hold released", publicTitleIt: hold ? "Spedizione in sospeso" : "Sospensione rimossa", publicDescriptionEn: hold ? cleanReason : "Your shipment has resumed processing.", publicDescriptionIt: hold ? cleanReason : "La spedizione ha ripreso l'elaborazione.", internalDescription: hold ? cleanReason : "Operational hold released", sourceType: "STAFF", eventTime: new Date(), actorUserId, reason: cleanReason, notificationState: "ELIGIBLE" } });
      await tx.outboxEvent.create({ data: { eventType: "shipment.status.updated", correlationId, payloadJson: { shipmentId, trackingNumber: shipment.trackingNumber, trackingEventId: event.id, status: hold ? "OPERATIONAL_HOLD" : "HOLD_RELEASED" } } });
      await this.auditService.record({ actorUserId, action: hold ? "SHIPMENT_HOLD_PLACED" : "SHIPMENT_HOLD_RELEASED", entityType: "Shipment", entityId: shipmentId, afterJson: { operationalHold: hold, reason: cleanReason }, correlationId, reason: cleanReason }, tx);
      return tx.shipment.findUniqueOrThrow({ where: { id: shipmentId } });
    });
  }

  async correctAdminEvent(shipmentId: string, eventId: string, dto: CorrectAdminTrackingEventDto, actorUserId: string, correlationId: string) {
    const prisma = getPrismaClient();
    const original = await prisma.trackingEvent.findFirst({ where: { id: eventId, shipmentId }, include: { corrections: { select: { id: true }, take: 1 } } });
    if (!original) throw new NotFoundException("Tracking event not found");
    if (original.corrections.length) throw new BadRequestException("This event has already been corrected");
    const latest = await prisma.trackingEvent.findFirst({ where: { shipmentId, corrections: { none: {} } }, orderBy: [{ eventTime: "desc" }, { id: "desc" }] });
    if (latest?.id !== original.id) throw new BadRequestException("Only the current tracking event can be corrected");
    return this.writeAdminEvent(shipmentId, dto, actorUserId, correlationId, { id: original.id, canonicalCode: original.canonicalCode, reason: dto.correctionReason });
  }

  private async writeAdminEvent(shipmentId: string, dto: AddAdminTrackingEventDto, actorUserId: string, correlationId: string, correction?: { id: string; canonicalCode: string; reason: string }) {
    const option = MVP_ADMIN_TRACKING_STATUSES.find((status) => status.code === dto.canonicalCode);
    if (!option) throw new BadRequestException("Unsupported tracking status");
    if (option.requiresReason && !dto.reason?.trim()) throw new BadRequestException("This status requires a reason");
    if (option.requiresEvidence && !dto.evidenceDocumentId) throw new BadRequestException("This status requires an evidence document");

    const eventTime = new Date(dto.eventTime);
    if (eventTime.getTime() > Date.now() + 5 * 60_000) throw new BadRequestException("Event time cannot be in the future");

    const prisma = getPrismaClient();
    const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
    if (!shipment) throw new NotFoundException("Shipment not found");
    if (shipment.lifecycleStatus === "ARCHIVED") throw new BadRequestException("Archived shipments cannot be changed");
    if (shipment.operationalHold && !correction) throw new BadRequestException("Release the operational hold before adding movement updates");
    const latestEffectiveEvent = await prisma.trackingEvent.findFirst({
      where: { shipmentId, corrections: { none: {} } },
      orderBy: [{ eventTime: "desc" }, { id: "desc" }],
      select: { eventTime: true },
    });
    if (!correction && latestEffectiveEvent && eventTime < latestEffectiveEvent.eventTime) {
      throw new BadRequestException("A new movement cannot be earlier than the current tracking event; correct the current event instead");
    }
    if (dto.evidenceDocumentId) {
      const evidence = await prisma.document.findFirst({ where: { id: dto.evidenceDocumentId, shipmentId, reviewStatus: "APPROVED" } });
      if (!evidence) throw new BadRequestException("Evidence must be an approved document attached to this shipment");
    }

    const nextLifecycle = lifecycleForTrackingStatus(option.code);
    const currentLifecycle = shipment.lifecycleStatus as MvpShipmentLifecycleStatus;
    if (!correction && currentLifecycle !== nextLifecycle && !canTransitionShipmentLifecycle(currentLifecycle, nextLifecycle)) {
      throw new BadRequestException(`Shipment cannot transition from ${currentLifecycle} to ${nextLifecycle}`);
    }

    return prisma.$transaction(async (tx) => {
      const claimedShipment = await tx.shipment.updateMany({
        where: { id: shipmentId, version: shipment.version },
        data: { version: { increment: 1 } },
      });
      if (claimedShipment.count !== 1) throw new BadRequestException("Shipment changed while this event was being saved; refresh and try again");
      const event = await tx.trackingEvent.create({
        data: {
          shipmentId,
          canonicalCode: option.code,
          publicTitleEn: option.labelEn,
          publicTitleIt: option.labelIt,
          publicDescriptionEn: dto.publicDescription?.trim() || null,
          publicDescriptionIt: dto.publicDescription?.trim() || null,
          internalDescription: dto.internalDescription?.trim() || null,
          sourceType: "STAFF",
          eventTime,
          locationJson: dto.location as never,
          visibility: "PUBLIC",
          evidenceDocumentId: dto.evidenceDocumentId,
          correctionOfId: correction?.id,
          actorUserId,
          reason: correction?.reason ?? dto.reason?.trim(),
          notificationState: "ELIGIBLE",
        },
      });
      await tx.shipment.update({
        where: { id: shipmentId },
        data: {
          currentTrackingCode: option.code,
          lifecycleStatus: nextLifecycle,
          actionRequiredReason: nextLifecycle === "ACTION_REQUIRED" ? (dto.reason?.trim() || dto.publicDescription?.trim() || option.labelEn) : null,
          ...(nextLifecycle === "DELIVERED" ? { deliveredAt: eventTime } : {}),
          ...(correction?.canonicalCode === "DELIVERED" && nextLifecycle !== "DELIVERED" ? { deliveredAt: null } : {}),
        },
      });
      await tx.outboxEvent.create({ data: { eventType: "shipment.status.updated", correlationId, payloadJson: { shipmentId, trackingNumber: shipment.trackingNumber, trackingEventId: event.id, status: option.code } } });
      await this.auditService.record({ actorUserId, action: correction ? "TRACKING_EVENT_CORRECTED" : "TRACKING_EVENT_ADDED", entityType: "TrackingEvent", entityId: event.id, afterJson: { shipmentId, status: option.code, correctionOfId: correction?.id }, correlationId, reason: correction?.reason ?? dto.reason }, tx);
      return event;
    });
  }

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

function lifecycleForTrackingStatus(code: TrackingStatus): MvpShipmentLifecycleStatus {
  if (code === "DELIVERED") return "DELIVERED";
  if (code === "CANCELLED") return "CANCELLED";
  if (code === "ARCHIVED") return "ARCHIVED";
  if (["DOCUMENTATION_REQUIRED", "DELIVERY_ATTEMPTED", "ADDRESS_ISSUE"].includes(code)) return "ACTION_REQUIRED";
  return "ACTIVE";
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

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { getPrismaClient, type Prisma } from "@nauterio/database";
import { randomBytes } from "node:crypto";
import { STAFF_ROLES } from "@nauterio/contracts";
import { paginateCursor } from "../../common/pagination/paginate-cursor";
import { shipmentScopeWhere, type ShipmentScopeCaller } from "../../common/authorization/shipment-scope";
import type { ShipmentLifecycleStatusFilter } from "./dto/list-shipments.dto";
import type { CreateAdminShipmentDto } from "./dto/create-admin-shipment.dto";
import { AuditService } from "../audit/audit.module";
import { calculateChargeableWeight } from "@nauterio/validation";

const MAX_TRACKING_EVENTS_RETURNED = 100;

// DATA-013/REL-018: Crockford base32 (excludes I, L, O, U - each confusable
// with 1, 1, 0, V when read off a label or dictated over the phone).
const TRACKING_NUMBER_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
// 10 base32 characters = 50 bits = ~1.1e15 values, in the range the audit
// recommended. The previous 6 hex characters (24 bits, 16.7M values) put a
// collision at a coin flip by ~4,800 shipments; this pushes it past any
// realistic lifetime volume for the corridor.
const TRACKING_NUMBER_LENGTH = 10;
const MAX_GENERATION_ATTEMPTS = 5;

/**
 * Owns the Shipment lifecycle (spec section 24.1's module ownership rule -
 * other modules never write to the shipments table directly). Creation is
 * Shipment-request approval is implemented by BookingsService, which uses
 * this service's collision-resistant tracking-number generator and creates
 * the shipment, first package, initial tracking event, and outbox event in
 * one transaction. Payment is deliberately outside the launch MVP.
 */
export type ShipmentListScope = ShipmentScopeCaller;

@Injectable()
export class ShipmentsService {
  constructor(private readonly auditService: AuditService) {}

  async createAdminShipment(dto: CreateAdminShipmentDto, actorUserId: string, correlationId: string) {
    const prisma = getPrismaClient();
    const owner = await prisma.user.findFirst({
      where: { id: dto.ownerUserId, staffRole: null, erasedAt: null, status: "ACTIVE" },
      select: {
        id: true,
        organisationMemberships: {
          where: { status: "ACTIVE" },
          take: 1,
          select: { organisationId: true },
        },
      },
    });
    if (!owner) throw new BadRequestException("Select an active customer account");

    const service = await prisma.service.findFirst({ where: { id: dto.serviceId, active: true }, select: { id: true } });
    if (!service) throw new BadRequestException("Select an active shipping service");

    const weights = calculateChargeableWeight({
      actualWeightKg: dto.weightKg,
      lengthCm: dto.lengthCm,
      widthCm: dto.widthCm,
      heightCm: dto.heightCm,
    });
    const trackingNumber = await this.generateTrackingNumber(dto.receiverCountry);
    const declaredValueAmountMinorUnits = BigInt(Math.round(dto.declaredValue * 100));
    const totalAmountMinorUnits = BigInt(Math.round(dto.totalAmount * 100));

    return prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.create({
        data: {
          trackingNumber,
          ownerUserId: owner.id,
          organisationId: owner.organisationMemberships[0]?.organisationId,
          senderNameSnapshot: dto.senderName.trim(),
          senderAddressSnapshot: {
            line1: dto.senderLine1.trim(), city: dto.senderCity.trim(), postalCode: dto.senderPostalCode.trim(),
            countryCode: dto.senderCountry, phone: dto.senderPhone.trim(), email: dto.senderEmail?.trim() || null,
          },
          receiverNameSnapshot: dto.receiverName.trim(),
          receiverAddressSnapshot: {
            line1: dto.receiverLine1.trim(), city: dto.receiverCity.trim(), postalCode: dto.receiverPostalCode.trim(),
            countryCode: dto.receiverCountry, phone: dto.receiverPhone.trim(), email: dto.receiverEmail?.trim() || null,
          },
          customerReference: dto.customerReference?.trim() || undefined,
          serviceId: service.id,
          packageCount: 1,
          totalActualWeightKg: weights.actualWeightKg,
          totalVolumetricWeightKg: weights.volumetricWeightKg,
          totalChargeableWeightKg: weights.chargeableWeightKg,
          declaredValueAmountMinorUnits,
          declaredValueCurrency: dto.currency,
          isDeMinimisEligible: false,
          totalAmountMinorUnits,
          currency: dto.currency,
          lifecycleStatus: "ACTIVE",
          currentTrackingCode: "SHIPMENT_CREATED",
          createdByUserId: actorUserId,
          source: "admin",
        },
      });
      await tx.package.create({
        data: {
          shipmentId: shipment.id,
          packageNumber: `${trackingNumber}-P001`,
          sequenceNumber: 1,
          actualWeightKg: weights.actualWeightKg,
          lengthCm: dto.lengthCm,
          widthCm: dto.widthCm,
          heightCm: dto.heightCm,
          volumetricWeightKg: weights.volumetricWeightKg,
          chargeableWeightKg: weights.chargeableWeightKg,
        },
      });
      await tx.trackingEvent.create({
        data: {
          shipmentId: shipment.id,
          canonicalCode: "SHIPMENT_CREATED",
          publicTitleEn: "Shipment created",
          publicTitleIt: "Spedizione creata",
          publicDescriptionEn: "Nauterio Logistics has created this shipment.",
          sourceType: "STAFF",
          eventTime: new Date(),
          actorUserId,
          notificationState: "ELIGIBLE",
        },
      });
      await tx.outboxEvent.create({
        data: { eventType: "shipment.created", correlationId, payloadJson: { shipmentId: shipment.id, trackingNumber, source: "admin" } },
      });
      await this.auditService.record({
        actorUserId,
        action: "SHIPMENT_CREATED_MANUALLY",
        entityType: "Shipment",
        entityId: shipment.id,
        afterJson: { trackingNumber, ownerUserId: owner.id, serviceId: service.id, source: "admin" },
        correlationId,
      }, tx);
      return shipment;
    });
  }

  /**
   * List scoping happens here, not in PermissionGuard: the guard only knows
   * the caller's role at route-entry time, before any records are loaded
   * (spec section 27.3's "record relationship" check needs the record to
   * exist first). Staff see every shipment within their baseline action set;
   * organisation members see their organisation's shipments; customers see
   * only shipments they own.
   */
  async list(
    scope: ShipmentListScope,
    pagination: { cursor?: string; limit?: number },
    filters: { status?: ShipmentLifecycleStatusFilter; createdAfter?: string; createdBefore?: string } = {}
  ) {
    const prisma = getPrismaClient();

    // REL-016 residual: the staff path (`shipmentScopeWhere` returns `{}`
    // for staff roles) previously had no way to narrow the list at all
    // besides paginating linearly. `status`/`createdAfter`/`createdBefore`
    // are additive filters, ANDed with the existing tenancy scope, so a
    // customer/org-member caller's results are still bounded by their own
    // scope first - these narrow further, they never widen it.
    const where: Prisma.ShipmentWhereInput = {
      ...shipmentScopeWhere(scope),
      ...(filters.status ? { lifecycleStatus: filters.status } : {}),
      ...(filters.createdAfter || filters.createdBefore
        ? {
            createdAt: {
              ...(filters.createdAfter ? { gte: new Date(filters.createdAfter) } : {}),
              ...(filters.createdBefore ? { lte: new Date(filters.createdBefore) } : {}),
            },
          }
        : {}),
    };

    return paginateCursor(
      (page) =>
        prisma.shipment.findMany({
          where,
          orderBy: { id: "desc" },
          ...page,
        }),
      pagination
    );
  }

  /**
   * SEC-003 fix: scope is expressed in the query itself (`findFirst` with
   * the same `shipmentScopeWhere` the list endpoint already used
   * correctly), not checked after an unscoped load - a shipment outside
   * the caller's scope 404s exactly like one that does not exist, so the
   * response code cannot be used to enumerate valid IDs.
   */
  async getById(id: string, caller: ShipmentScopeCaller) {
    const prisma = getPrismaClient();
    const isStaff = (STAFF_ROLES as readonly string[]).includes(caller.role);

    const shipment = await prisma.shipment.findFirst({
      where: { id, ...shipmentScopeWhere(caller) },
      include: {
        packages: true,
        documents: isStaff ? { where: { reviewStatus: "APPROVED" }, select: { id: true, type: true, reviewStatus: true } } : false,
        trackingEvents: {
          // SEC-003/REL-017: never return INTERNAL-visibility events or
          // internal-only fields to a non-staff caller - this mirrors the
          // filter tracking.service.ts already applies to the public
          // lookup, which this route had not been applying at all.
          where: isStaff ? undefined : { visibility: { not: "INTERNAL" } },
          // DATA-012: exclude events a later correction has superseded,
          // and use `id` (UUIDv7, time-ordered) as a deterministic
          // secondary sort so two events sharing an `eventTime` don't
          // reorder between requests.
          orderBy: [{ eventTime: "desc" }, { id: "desc" }],
          take: MAX_TRACKING_EVENTS_RETURNED,
        },
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment ${id} not found`);
    }

    if (!isStaff) {
      // Drop internal-only fields even on visible events, matching
      // tracking.service.ts's customer-facing shape.
      return {
        ...shipment,
        trackingEvents: shipment.trackingEvents.map((e) => ({
          ...e,
          internalDescription: null,
          reason: null,
          actorUserId: null,
        })),
      };
    }

    return shipment;
  }

  /**
   * DATA-013/REL-018: uniqueness must come from the database, not from
   * entropy alone - so this checks the candidate against
   * `shipments_tracking_number_key` (the real source of truth) and retries
   * on collision, the same way the eventual `shipment.create()` call should
   * catch P2002. A bounded retry here means the future creation endpoint
   * gets a tracking number that is already known-unique, rather than
   * discovering a collision only at insert time.
   */
  async generateTrackingNumber(destinationCountry = "US"): Promise<string> {
    const prisma = getPrismaClient();
    const destinationSuffix = /^[A-Z]{2}$/.test(destinationCountry) ? destinationCountry : "XX";
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
      const candidate = `NT-${randomTrackingSuffix()}-${destinationSuffix}`;
      const existing = await prisma.shipment.findUnique({
        where: { trackingNumber: candidate },
        select: { id: true },
      });
      if (!existing) return candidate;
    }
    throw new Error(`Failed to generate a unique tracking number after ${MAX_GENERATION_ATTEMPTS} attempts`);
  }
}

function randomTrackingSuffix(): string {
  // 7 random bytes = 56 bits, a multiple of 5 bits' worth of headroom above
  // the 50 bits (10 chars) taken, so `% 32n` has no modulo bias - 2^56 is
  // exactly divisible by 32, so every base32 digit is equally likely.
  const value = BigInt(`0x${randomBytes(7).toString("hex")}`);
  let remaining = value;
  let suffix = "";
  for (let i = 0; i < TRACKING_NUMBER_LENGTH; i++) {
    suffix = TRACKING_NUMBER_ALPHABET[Number(remaining % 32n)] + suffix;
    remaining /= 32n;
  }
  return suffix;
}

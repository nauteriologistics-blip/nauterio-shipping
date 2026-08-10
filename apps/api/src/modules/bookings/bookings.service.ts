import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { AuditService } from "../audit/audit.module";
import { ShipmentsService } from "../shipments/shipments.service";
import { SaveDraftDto, ConfirmBookingDto } from "./dto/booking.dto";
import { sliceCursorPage } from "../../common/pagination/paginate-cursor";

@Injectable()
export class BookingsService {
  constructor(
    private readonly auditService: AuditService,
    private readonly shipmentsService: ShipmentsService
  ) {}

  async listBookings(params: { userId: string; organisationId?: string; after?: string; limit?: number }) {
    const prisma = getPrismaClient();
    const limit = Math.min(params.limit ?? 20, 100);

    // Bookings are always scoped to the caller's own userId - unlike
    // shipments/invoices there is no staff "see everything" case for
    // drafts, so organisationId (if present) only narrows further, it
    // never widens beyond the caller.
    const where: { userId: string; organisationId?: string } = { userId: params.userId };
    if (params.organisationId) where.organisationId = params.organisationId;

    const cursor = params.after ? { id: params.after } : undefined;

    const bookings = await prisma.booking.findMany({
      where,
      take: limit + 1,
      cursor,
      skip: cursor ? 1 : 0,
      orderBy: { id: "desc" },
    });

    return sliceCursorPage(bookings, limit);
  }

  async getBookingById(id: string, userId: string) {
    const prisma = getPrismaClient();
    const booking = await prisma.booking.findFirst({
      where: { id, userId },
    });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return booking;
  }

  async saveDraft(userId: string, dto: SaveDraftDto) {
    const prisma = getPrismaClient();

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          userId,
          organisationId: dto.organisationId,
          currentStep: dto.currentStep as never,
          draftDataJson: dto.draftDataJson as never,
          quoteId: dto.quoteId,
        },
      });

      await this.auditService.record(
        {
          actorUserId: userId,
          action: "BOOKING_DRAFT_CREATED",
          entityType: "Booking",
          entityId: created.id,
          afterJson: created,
        },
        tx
      );

      return created;
    });

    return booking;
  }

  async updateDraft(id: string, userId: string, dto: SaveDraftDto) {
    const booking = await this.getBookingById(id, userId);
    if (booking.convertedShipmentId) {
      throw new BadRequestException(`Booking ${id} has already been converted to a shipment`);
    }

    const prisma = getPrismaClient();

    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id },
        data: {
          currentStep: dto.currentStep as never,
          draftDataJson: dto.draftDataJson as never,
          quoteId: dto.quoteId ?? booking.quoteId,
        },
      });

      await this.auditService.record(
        {
          actorUserId: userId,
          action: "BOOKING_DRAFT_UPDATED",
          entityType: "Booking",
          entityId: id,
          afterJson: b,
        },
        tx
      );

      return b;
    });

    return updated;
  }

  /**
   * Confirms a draft into a real, active Shipment. Requires a CONFIRMED
   * Payment record matching `dto.paymentReference` - CLAUDE.md: "never
   * infer payment success only from a browser redirect". No webhook
   * handler exists yet anywhere in this codebase to ever set a Payment to
   * CONFIRMED (see billing.module.ts), so this correctly, deliberately
   * refuses every confirmation until that real integration lands - that is
   * fail-safe behaviour, not a bug to work around by trusting the client's
   * string instead.
   */
  async confirmBooking(id: string, userId: string, dto: ConfirmBookingDto, correlationId: string) {
    const booking = await this.getBookingById(id, userId);
    if (booking.convertedShipmentId) {
      throw new BadRequestException(`Booking ${id} is already confirmed`);
    }

    const prisma = getPrismaClient();
    const confirmedPayment = await prisma.payment.findFirst({
      where: { providerPaymentId: dto.paymentReference, status: "CONFIRMED" },
    });
    if (!confirmedPayment) {
      throw new BadRequestException(
        `No confirmed payment found for reference '${dto.paymentReference}'. Initiate payment via POST /v1/invoices/:id/pay and wait for provider confirmation before confirming this booking.`
      );
    }

    const draft = booking.draftDataJson as Record<string, unknown> | null;
    // DATA-013/REL-018: this used to generate its own tracking number
    // inline (`randomBytes(3)` - 24 bits, the exact low-entropy scheme
    // those findings flagged) instead of the shared, DB-verified generator -
    // the one real caller of shipment creation was bypassing the fix
    // entirely. `generateTrackingNumber()` is the single source of truth for
    // this format now.
    const trackingNumber = await this.shipmentsService.generateTrackingNumber();

    const result = await prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.create({
        data: {
          trackingNumber,
          serviceId: (draft?.serviceId as never) || "AIR_EXPRESS",
          ownerUserId: userId,
          organisationId: booking.organisationId,
          senderNameSnapshot: (draft?.senderName as string) || "Sender",
          senderAddressSnapshot: (draft?.senderAddress as object) || { city: "Milan", countryCode: "IT" },
          receiverNameSnapshot: (draft?.receiverName as string) || "Receiver",
          receiverAddressSnapshot: (draft?.receiverAddress as object) || { city: "New York", countryCode: "US" },
          totalActualWeightKg: (draft?.weightKg as number) || 1.0,
          totalVolumetricWeightKg: (draft?.weightKg as number) || 1.0,
          totalChargeableWeightKg: (draft?.weightKg as number) || 1.0,
          declaredValueAmountMinorUnits: BigInt((draft?.declaredValueMinor as number) || 10000),
          declaredValueCurrency: (draft?.currency as string) || "EUR",
          totalAmountMinorUnits: confirmedPayment.amountMinorUnits,
          currency: confirmedPayment.currency,
          lifecycleStatus: "ACTIVE",
        },
      });

      // System-generated, not staff/warehouse/carrier/driver input - no
      // TrackingEventSourceType value exists for "customer confirmed a
      // booking", and this event is the system reacting to that, not the
      // customer directly asserting shipment state.
      await tx.trackingEvent.create({
        data: {
          shipmentId: shipment.id,
          canonicalCode: "SHIPMENT_CREATED",
          publicTitleEn: "Shipment created",
          publicTitleIt: "Spedizione creata",
          sourceType: "SYSTEM_AUTOMATION",
          eventTime: new Date(),
        },
      });

      await tx.booking.update({
        where: { id },
        data: { convertedShipmentId: shipment.id },
      });

      // eventType must match outbox-relay.ts's EVENT_TYPE_TO_QUEUE routing
      // key exactly ("shipment.created") or the relay marks it FAILED as
      // unroutable.
      await tx.outboxEvent.create({
        data: {
          eventType: "shipment.created",
          correlationId,
          payloadJson: {
            shipmentId: shipment.id,
            trackingNumber: shipment.trackingNumber,
            bookingId: id,
          },
        },
      });

      await this.auditService.record(
        {
          actorUserId: userId,
          action: "BOOKING_CONFIRMED",
          entityType: "Booking",
          entityId: id,
          afterJson: { bookingId: id, shipmentId: shipment.id, trackingNumber },
          correlationId,
        },
        tx
      );

      return shipment;
    });

    return result;
  }
}

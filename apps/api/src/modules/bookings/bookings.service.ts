import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { AuditService } from "../audit/audit.module";
import { ShipmentsService } from "../shipments/shipments.service";
import { SaveDraftDto } from "./dto/booking.dto";
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

  async listRequests(params: { status?: string; after?: string; limit?: number }) {
    const prisma = getPrismaClient();
    const limit = Math.min(params.limit ?? 25, 100);
    const allowed = new Set(["SUBMITTED", "APPROVED", "AWAITING_PAYMENT", "PAID", "REJECTED", "CONVERTED", "CANCELLED"]);
    const status = params.status && allowed.has(params.status) ? params.status : "SUBMITTED";
    const cursor = params.after ? { id: params.after } : undefined;
    const rows = await prisma.booking.findMany({
      where: { requestStatus: status as never },
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { id: "desc" },
      take: limit + 1,
      cursor,
      skip: cursor ? 1 : 0,
    });
    return sliceCursorPage(rows, limit);
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
    if (booking.requestStatus !== "DRAFT") {
      throw new BadRequestException("Only draft shipment requests can be edited");
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

  async submitRequest(id: string, userId: string, correlationId: string) {
    const booking = await this.getBookingById(id, userId);
    if (booking.requestStatus !== "DRAFT") throw new BadRequestException("Only draft requests can be submitted");
    validateShipmentRequest(booking.draftDataJson as Record<string, unknown>);
    const prisma = getPrismaClient();
    if (!booking.quoteId) throw new BadRequestException("Generate and select a quote before submitting this request");
    const quote = await prisma.quote.findFirst({ where: { id: booking.quoteId, status: "DRAFT", expiresAt: { gt: new Date() } } });
    if (!quote) throw new BadRequestException("The selected quote is invalid or expired");
    const draft = booking.draftDataJson as Record<string, unknown>;
    const quotedInput = quote.inputSnapshotJson as Record<string, unknown>;
    const pricedFieldsMatch =
      quote.serviceId === draft.serviceId &&
      numbersMatch(quotedInput.weightKg, draft.weightKg) &&
      numbersMatch(quotedInput.lengthCm, draft.lengthCm) &&
      numbersMatch(quotedInput.widthCm, draft.widthCm) &&
      numbersMatch(quotedInput.heightCm, draft.heightCm) &&
      numbersMatch(quotedInput.declaredValueEur, draft.declaredValueEur);
    if (!pricedFieldsMatch) throw new BadRequestException("Package details changed after quoting; generate a new quote");
    return prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { requestStatus: "SUBMITTED" as never, currentStep: "CONFIRMED", submittedAt: new Date() },
      });
      await this.auditService.record({ actorUserId: userId, action: "SHIPMENT_REQUEST_SUBMITTED", entityType: "Booking", entityId: id, afterJson: { requestStatus: "SUBMITTED" }, correlationId }, tx);
      return updated;
    });
  }

  async rejectRequest(id: string, reviewerUserId: string, reason: string, correlationId: string) {
    const prisma = getPrismaClient();
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException(`Shipment request ${id} not found`);
    if (booking.requestStatus !== "SUBMITTED") throw new BadRequestException("Only submitted requests can be rejected");
    return prisma.$transaction(async (tx) => {
      const claimed = await tx.booking.updateMany({ where: { id, requestStatus: "SUBMITTED" as never }, data: { requestStatus: "REJECTED" as never, decisionReason: reason.trim(), reviewedAt: new Date(), reviewedByUserId: reviewerUserId } });
      if (claimed.count !== 1) throw new BadRequestException("This request has already been reviewed");
      const updated = await tx.booking.findUniqueOrThrow({ where: { id } });
      await this.auditService.record({ actorUserId: reviewerUserId, action: "SHIPMENT_REQUEST_REJECTED", entityType: "Booking", entityId: id, afterJson: { requestStatus: "REJECTED", reason: reason.trim() }, correlationId }, tx);
      return updated;
    });
  }

  async approveRequest(id: string, reviewerUserId: string, correlationId: string) {
    const prisma = getPrismaClient();
    const booking = await prisma.booking.findUnique({ where: { id }, include: { quote: { include: { lines: true } } } });
    if (!booking) throw new NotFoundException(`Shipment request ${id} not found`);
    if (booking.requestStatus !== "SUBMITTED") throw new BadRequestException("Only submitted requests can be approved");
    if (!booking.userId) throw new BadRequestException("Request has no customer owner");
    if (!booking.quote || booking.quote.expiresAt <= new Date()) throw new BadRequestException("A current quote is required before approving the request");
    if (booking.quote.totalAmountMinorUnits <= 0n) throw new BadRequestException("Quote total must be greater than zero");

    const draft = booking.draftDataJson as Record<string, unknown> | null;
    const trackingNumber = await this.shipmentsService.generateTrackingNumber();
    const weight = Number(draft?.weightKg ?? 1);
    const length = Number(draft?.lengthCm ?? 1);
    const width = Number(draft?.widthCm ?? 1);
    const height = Number(draft?.heightCm ?? 1);
    const volumetricWeight = (length * width * height) / 5000;

    return prisma.$transaction(async (tx) => {
      const claimed = await tx.booking.updateMany({ where: { id, requestStatus: "SUBMITTED" as never, convertedShipmentId: null }, data: { reviewedAt: new Date(), reviewedByUserId: reviewerUserId } });
      if (claimed.count !== 1) throw new BadRequestException("This request has already been reviewed");
      const acceptedQuote = await tx.quote.updateMany({ where: { id: booking.quote.id, status: "DRAFT" }, data: { status: "ACCEPTED", userId: booking.userId } });
      if (acceptedQuote.count !== 1) throw new BadRequestException("This quote has already been used or is no longer available");

      const shipment = await tx.shipment.create({
        data: {
          trackingNumber,
          serviceId: (draft?.serviceId as never) || "AIR_EXPRESS",
          ownerUserId: booking.userId,
          organisationId: booking.organisationId,
          senderNameSnapshot: stringFromDraft(draft, "senderName", "Sender"),
          senderAddressSnapshot: {
            line1: stringFromDraft(draft, "senderLine1"),
            city: stringFromDraft(draft, "senderCity"),
            postalCode: stringFromDraft(draft, "senderPostalCode"),
            countryCode: stringFromDraft(draft, "senderCountry"),
            phone: stringFromDraft(draft, "senderPhone"),
            email: optionalStringFromDraft(draft, "senderEmail"),
          },
          receiverNameSnapshot: stringFromDraft(draft, "receiverName", "Receiver"),
          receiverAddressSnapshot: {
            line1: stringFromDraft(draft, "receiverLine1"),
            city: stringFromDraft(draft, "receiverCity"),
            postalCode: stringFromDraft(draft, "receiverPostalCode"),
            countryCode: stringFromDraft(draft, "receiverCountry"),
            phone: stringFromDraft(draft, "receiverPhone"),
            email: optionalStringFromDraft(draft, "receiverEmail"),
          },
          customerReference: (draft?.customerReference as string) || undefined,
          packageCount: 1,
          totalActualWeightKg: weight,
          totalVolumetricWeightKg: volumetricWeight,
          totalChargeableWeightKg: Math.max(weight, volumetricWeight),
          declaredValueAmountMinorUnits: BigInt(Math.round(Number(draft?.declaredValueEur ?? 0) * 100)),
          declaredValueCurrency: (draft?.currency as string) || "EUR",
          totalAmountMinorUnits: booking.quote.totalAmountMinorUnits,
          currency: booking.quote.currency,
          lifecycleStatus: "ACTIVE",
          quoteId: booking.quote.id,
          createdByUserId: reviewerUserId,
          source: "admin",
        },
      });

      await tx.package.create({
        data: {
          shipmentId: shipment.id,
          packageNumber: `${trackingNumber}-P001`,
          sequenceNumber: 1,
          actualWeightKg: weight,
          lengthCm: length,
          widthCm: width,
          heightCm: height,
          volumetricWeightKg: volumetricWeight,
          chargeableWeightKg: Math.max(weight, volumetricWeight),
        },
      });

      await tx.trackingEvent.create({
        data: {
          shipmentId: shipment.id,
          canonicalCode: "PACKAGE_COLLECTED",
          publicTitleEn: "Package received",
          publicTitleIt: "Pacco ricevuto",
          publicDescriptionEn: "Your package is with Nauterio Logistics.",
          sourceType: "SYSTEM_AUTOMATION",
          eventTime: new Date(),
        },
      });

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}-${id.slice(0, 6).toUpperCase()}`,
          bookingId: booking.id,
          quoteId: booking.quote.id,
          organisationId: booking.organisationId,
          customerUserId: booking.userId,
          totalAmountMinorUnits: booking.quote.totalAmountMinorUnits,
          currency: booking.quote.currency,
          status: "ISSUED",
          issuedAt: new Date(),
          dueAt: booking.quote.expiresAt,
          lines: {
            create: booking.quote.lines.map((line) => ({
              description: line.label,
              shipmentId: shipment.id,
              amountMinorUnits: line.amountMinorUnits,
              currency: line.currency,
            })),
          },
        },
        include: { lines: true },
      });

      const updated = await tx.booking.update({
        where: { id },
        data: { convertedShipmentId: shipment.id, requestStatus: "CONVERTED" as never },
      });

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

      await tx.notification.create({
        data: {
          userId: booking.userId,
          templateCode: "invoice_issued_for_review",
          channel: "IN_APP",
          renderedSubject: `Invoice ${invoice.invoiceNumber} is ready for review`,
          renderedBodyHash: invoice.id.replaceAll("-", ""),
        },
      });

      await this.auditService.record({ actorUserId: reviewerUserId, action: "SHIPMENT_REQUEST_APPROVED_WITH_INVOICE_AND_TRACKING", entityType: "Booking", entityId: id, afterJson: { shipmentId: shipment.id, invoiceId: invoice.id, trackingNumber, requestStatus: updated.requestStatus, onlinePaymentRequired: false }, correlationId }, tx);
      return { bookingId: id, requestStatus: updated.requestStatus, shipment, invoice };
    });
  }

}

function numbersMatch(a: unknown, b: unknown): boolean {
  const left = Number(a);
  const right = Number(b);
  return Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) <= 0.001;
}

function validateShipmentRequest(draft: Record<string, unknown> | null): void {
  if (!draft) throw new BadRequestException("Shipment request details are missing");
  const requiredStrings = ["senderName", "senderPhone", "senderLine1", "senderCity", "senderPostalCode", "senderCountry", "receiverName", "receiverPhone", "receiverLine1", "receiverCity", "receiverPostalCode", "receiverCountry", "goodsDescription"];
  const missing = requiredStrings.filter((field) => typeof draft[field] !== "string" || !(draft[field]).trim());
  if (missing.length) throw new BadRequestException(`Complete the required fields: ${missing.join(", ")}`);
  if (typeof draft.weightKg !== "number" || draft.weightKg <= 0) throw new BadRequestException("Weight must be greater than zero");
  for (const field of ["lengthCm", "widthCm", "heightCm"]) {
    if (typeof draft[field] !== "number" || (draft[field]) <= 0) throw new BadRequestException(`${field} must be greater than zero`);
  }
  if (typeof draft.serviceId !== "string" || !["AIR_EXPRESS", "AIR_ECONOMY", "OCEAN_FREIGHT"].includes(draft.serviceId)) throw new BadRequestException("Select a supported service");
}

function stringFromDraft(draft: Record<string, unknown> | null, field: string, fallback = ""): string {
  const value = draft?.[field];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function optionalStringFromDraft(draft: Record<string, unknown> | null, field: string): string | null {
  const value = draft?.[field];
  return typeof value === "string" && value.trim() ? value : null;
}

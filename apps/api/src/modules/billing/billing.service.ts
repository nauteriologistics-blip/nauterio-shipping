import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { LocalMockPaymentAdapter, StripePaymentAdapter, type PaymentAdapter } from "@nauterio/integrations";
import { loadApiConfig } from "@nauterio/configuration";
import { AuditService } from "../audit/audit.module";
import { CreateInvoiceDto, PayInvoiceDto } from "./dto/create-invoice.dto";
import { sliceCursorPage } from "../../common/pagination/paginate-cursor";
import { STAFF_ROLES, type AppRole } from "@nauterio/contracts";
import { BookingsService } from "../bookings/bookings.service";

export interface InvoiceListScope {
  role: AppRole;
  userId: string;
  organisationId?: string;
}

@Injectable()
export class BillingService {
  private paymentAdapter: PaymentAdapter;

  constructor(private readonly auditService: AuditService, private readonly bookingsService: BookingsService) {
    const config = loadApiConfig();
    this.paymentAdapter = config.STRIPE_SECRET_KEY && config.STRIPE_WEBHOOK_SECRET
      ? new StripePaymentAdapter({ apiKey: config.STRIPE_SECRET_KEY, webhookSecret: config.STRIPE_WEBHOOK_SECRET, successUrl: `${config.WEB_APP_URL}/portal?payment=success`, cancelUrl: `${config.WEB_APP_URL}/portal?payment=cancelled` })
      : new LocalMockPaymentAdapter();
  }

  /**
   * Scope is derived from the authenticated caller (guard-populated
   * `req.user`), never from a client-supplied query param - matching
   * ShipmentsService.list()'s pattern. Trusting a caller-supplied
   * `organisationId` here would let any authenticated user read any
   * organisation's invoices just by changing a query string.
   */
  async listInvoices(scope: InvoiceListScope, params: { after?: string; limit?: number }) {
    const prisma = getPrismaClient();
    const limit = Math.min(params.limit ?? 20, 100);
    const isStaff = (STAFF_ROLES as readonly string[]).includes(scope.role);

    const where = isStaff
      ? {}
      : scope.organisationId
        ? { organisationId: scope.organisationId }
        : { customerUserId: scope.userId };

    const cursor = params.after ? { id: params.after } : undefined;

    const invoices = await prisma.invoice.findMany({
      where,
      take: limit + 1,
      cursor,
      skip: cursor ? 1 : 0,
      orderBy: { id: "desc" },
      include: { lines: true },
    });

    return sliceCursorPage(invoices, limit);
  }

  async getInvoiceById(id: string, scope: InvoiceListScope) {
    const prisma = getPrismaClient();
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { lines: true, allocations: { include: { payment: true } } },
    });
    if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);

    const isStaff = (STAFF_ROLES as readonly string[]).includes(scope.role);
    const owns =
      invoice.customerUserId === scope.userId ||
      (scope.organisationId && invoice.organisationId === scope.organisationId);
    if (!isStaff && !owns) {
      throw new NotFoundException(`Invoice ${id} not found`);
    }

    return invoice;
  }

  async createInvoice(dto: CreateInvoiceDto, actorUserId: string) {
    const prisma = getPrismaClient();

    const shipment = await prisma.shipment.findUnique({
      where: { id: dto.shipmentId },
    });
    if (!shipment) {
      throw new NotFoundException(`Shipment ${dto.shipmentId} not found`);
    }

    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;

    const invoice = await prisma.$transaction(async (tx) => {
      const created = await tx.invoice.create({
        data: {
          invoiceNumber,
          organisationId: dto.organisationId ?? shipment.organisationId ?? undefined,
          customerUserId: shipment.ownerUserId ?? actorUserId,
          totalAmountMinorUnits: shipment.totalAmountMinorUnits,
          currency: dto.currency || shipment.currency || "EUR",
          status: "ISSUED",
          issuedAt: new Date(),
          dueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          lines: {
            create: [
              {
                description: `Shipping charge for ${shipment.trackingNumber}`,
                shipmentId: shipment.id,
                amountMinorUnits: shipment.totalAmountMinorUnits,
                currency: dto.currency || shipment.currency || "EUR",
              },
            ],
          },
        },
        include: { lines: true },
      });

      await this.auditService.record(
        {
          actorUserId,
          action: "INVOICE_CREATED",
          entityType: "Invoice",
          entityId: created.id,
          afterJson: created,
        },
        tx
      );

      return created;
    });

    return invoice;
  }

  /**
   * Only ever creates a PENDING payment intent - never marks the invoice
   * PAID here (CLAUDE.md: "never infer payment success only from a browser
   * redirect"). Real confirmation must come from a verified provider
   * webhook, which does not exist yet in this codebase (billing.module.ts
   * has no webhook endpoint) - until that lands, an invoice legitimately
   * cannot be marked PAID by anything in this API, which is the correct
   * fail-safe behaviour rather than a gap to silently paper over.
   */
  async payInvoice(id: string, dto: PayInvoiceDto, actorUserId: string, scope: InvoiceListScope) {
    const invoice = await this.getInvoiceById(id, scope);
    if (invoice.status !== "ISSUED") throw new BadRequestException(`Invoice ${id} is not payable in its current state`);

    const prisma = getPrismaClient();

    const existingPending = invoice.allocations.find((allocation) => allocation.payment.status === "PENDING" && allocation.payment.providerCheckoutUrl);
    if (existingPending) {
      return {
        invoiceId: id,
        paymentId: existingPending.payment.id,
        status: existingPending.payment.status,
        clientSecretOrRedirectUrl: existingPending.payment.providerCheckoutUrl,
      };
    }

    const paymentResult = await this.paymentAdapter.createPaymentIntent({
      amountMinorUnits: Number(invoice.totalAmountMinorUnits),
      currency: invoice.currency,
      idempotencyKey: `pay-inv-${id}-attempt-${invoice.allocations.length + 1}`,
      metadata: { invoiceId: id, actorUserId, paymentMethod: dto.paymentMethod },
    });

    const payment = await prisma.$transaction(async (tx) => {
      const created = await tx.payment.upsert({
        where: { provider_providerPaymentId: { provider: "STRIPE", providerPaymentId: paymentResult.providerPaymentId } },
        update: {},
        create: {
          provider: "STRIPE",
          providerPaymentId: paymentResult.providerPaymentId,
          providerCheckoutUrl: paymentResult.clientSecretOrRedirectUrl,
          status: "PENDING",
          amountMinorUnits: invoice.totalAmountMinorUnits,
          currency: invoice.currency,
        },
      });

      await tx.paymentAllocation.upsert({
        where: { paymentId_invoiceId: { paymentId: created.id, invoiceId: id } },
        update: {},
        create: {
          paymentId: created.id,
          invoiceId: id,
          amountMinorUnits: invoice.totalAmountMinorUnits,
          currency: invoice.currency,
        },
      });

      await this.auditService.record(
        {
          actorUserId,
          action: "PAYMENT_INTENT_CREATED",
          entityType: "Invoice",
          entityId: id,
          afterJson: created,
        },
        tx
      );

      return created;
    });

    return {
      invoiceId: id,
      paymentId: payment.id,
      status: payment.status,
      clientSecretOrRedirectUrl: paymentResult.clientSecretOrRedirectUrl,
    };
  }

  async processStripeWebhook(rawBody: string, signature: string, correlationId: string) {
    if (!(this.paymentAdapter instanceof StripePaymentAdapter)) throw new BadRequestException("Stripe is not configured");
    const event = await this.paymentAdapter.verifyWebhookSignature(rawBody, signature).catch(() => {
      throw new BadRequestException("Invalid Stripe webhook signature or payload");
    });
    const prisma = getPrismaClient();
    const outcome = await prisma.$transaction(async (tx) => {
      const duplicate = await tx.paymentEvent.findUnique({
        where: { provider_providerEventId: { provider: "STRIPE", providerEventId: event.providerEventId } },
        include: { payment: { include: { allocations: { include: { invoice: true } } } } },
      });
      // A provider retries webhooks. If payment was committed but shipment
      // creation failed afterwards, the retry must resume fulfilment rather
      // than becoming a no-op merely because the event row already exists.
      if (duplicate) {
        const invoice = duplicate.payment.allocations[0]?.invoice;
        return { duplicate: true as const, bookingId: invoice?.status === "PAID" ? invoice.bookingId : null };
      }
      const payment = await tx.payment.findUnique({ where: { provider_providerPaymentId: { provider: "STRIPE", providerPaymentId: event.providerPaymentId } }, include: { allocations: { include: { invoice: true } } } });
      if (!payment) throw new NotFoundException("Payment intent not found");
      await tx.paymentEvent.create({ data: { paymentId: payment.id, provider: "STRIPE", providerEventId: event.providerEventId, eventType: event.eventType, signatureVerified: true, rawPayloadJson: JSON.parse(rawBody) as never } });
      if (event.eventType === "checkout.session.expired") {
        await tx.payment.updateMany({ where: { id: payment.id, status: "PENDING" }, data: { status: "FAILED" } });
        return { duplicate: false as const, bookingId: null };
      }
      const paymentSucceeded = event.eventType === "checkout.session.async_payment_succeeded" ||
        (event.eventType === "checkout.session.completed" && event.paymentStatus === "paid");
      if (!paymentSucceeded) return { duplicate: false as const, bookingId: null };
      const allocation = payment.allocations[0];
      if (!allocation || allocation.amountMinorUnits !== payment.amountMinorUnits || allocation.currency !== payment.currency) throw new BadRequestException("Payment allocation does not match the payment");
      const invoice = allocation.invoice;
      if (invoice.totalAmountMinorUnits !== payment.amountMinorUnits || invoice.currency !== payment.currency) throw new BadRequestException("Payment does not settle the invoice total");
      if (event.amountTotalMinorUnits !== undefined && BigInt(event.amountTotalMinorUnits) !== payment.amountMinorUnits) throw new BadRequestException("Stripe session amount does not match the payment");
      if (event.currency && event.currency !== payment.currency.toUpperCase()) throw new BadRequestException("Stripe session currency does not match the payment");
      await tx.payment.update({ where: { id: payment.id }, data: { status: "CONFIRMED", confirmedAt: new Date() } });
      await tx.invoice.update({ where: { id: invoice.id }, data: { status: "PAID", version: { increment: 1 } } });
      if (invoice.bookingId) await tx.booking.updateMany({ where: { id: invoice.bookingId, requestStatus: "AWAITING_PAYMENT" as never }, data: { requestStatus: "PAID" as never } });
      await this.auditService.record({ action: "PAYMENT_CONFIRMED", entityType: "Payment", entityId: payment.id, afterJson: { invoiceId: invoice.id, providerEventId: event.providerEventId }, correlationId }, tx);
      return { duplicate: false as const, bookingId: invoice.bookingId };
    });
    if (outcome.bookingId) await this.bookingsService.fulfillPaidBooking(outcome.bookingId, correlationId);
    return { received: true, duplicate: outcome.duplicate };
  }
}

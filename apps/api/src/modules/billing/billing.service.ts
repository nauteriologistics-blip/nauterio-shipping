import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { LocalMockPaymentAdapter } from "@nauterio/integrations";
import { AuditService } from "../audit/audit.module";
import { CreateInvoiceDto, PayInvoiceDto } from "./dto/create-invoice.dto";
import { sliceCursorPage } from "../../common/pagination/paginate-cursor";
import { STAFF_ROLES, type AppRole } from "@nauterio/contracts";

export interface InvoiceListScope {
  role: AppRole;
  userId: string;
  organisationId?: string;
}

@Injectable()
export class BillingService {
  private paymentAdapter = new LocalMockPaymentAdapter();

  constructor(private readonly auditService: AuditService) {}

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
    if (invoice.status === "PAID") {
      throw new BadRequestException(`Invoice ${id} is already paid`);
    }

    const prisma = getPrismaClient();

    const paymentResult = await this.paymentAdapter.createPaymentIntent({
      amountMinorUnits: Number(invoice.totalAmountMinorUnits),
      currency: invoice.currency,
      idempotencyKey: `pay-inv-${id}-${Date.now()}`,
      metadata: { invoiceId: id, actorUserId, paymentMethod: dto.paymentMethod },
    });

    const payment = await prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: {
          provider: "STRIPE",
          providerPaymentId: paymentResult.providerPaymentId,
          status: "PENDING",
          amountMinorUnits: invoice.totalAmountMinorUnits,
          currency: invoice.currency,
        },
      });

      await tx.paymentAllocation.create({
        data: {
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
}

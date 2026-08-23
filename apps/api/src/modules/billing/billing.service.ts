import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { AuditService } from "../audit/audit.module";
import { CreateInvoiceDto, PayInvoiceDto, UpdateInvoiceStatusDto } from "./dto/create-invoice.dto";
import { sliceCursorPage } from "../../common/pagination/paginate-cursor";
import { STAFF_ROLES, type AppRole } from "@nauterio/contracts";

export interface InvoiceListScope {
  role: AppRole;
  userId: string;
  organisationId?: string;
}

@Injectable()
export class BillingService {
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
      include: {
        lines: { include: { shipment: { select: { id: true, trackingNumber: true, lifecycleStatus: true } } } },
        customerUser: { select: { id: true, fullName: true, email: true } },
        organisation: { select: { id: true, legalName: true } },
      },
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
          dueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
          action: "OFFLINE_INVOICE_CREATED",
          entityType: "Invoice",
          entityId: created.id,
          afterJson: { invoiceId: created.id, shipmentId: shipment.id, onlinePaymentRequired: false },
        },
        tx
      );

      return created;
    });

    return invoice;
  }

  async updateInvoiceStatus(id: string, dto: UpdateInvoiceStatusDto, actorUserId: string, correlationId: string) {
    const prisma = getPrismaClient();
    const note = dto.note?.trim();

    return prisma.$transaction(async (tx) => {
      const existing = await tx.invoice.findUnique({
        where: { id },
        include: { lines: { include: { shipment: { select: { id: true, trackingNumber: true, lifecycleStatus: true } } } } },
      });
      if (!existing) throw new NotFoundException(`Invoice ${id} not found`);
      if (existing.status === "VOID" && dto.status !== "VOID") {
        throw new BadRequestException("A void invoice cannot be re-opened. Create a new invoice instead.");
      }

      const updated = await tx.invoice.update({
        where: { id },
        data: {
          status: dto.status,
          ...(dto.status === "ISSUED" && !existing.issuedAt ? { issuedAt: new Date() } : {}),
          version: { increment: 1 },
        },
        include: {
          lines: { include: { shipment: { select: { id: true, trackingNumber: true, lifecycleStatus: true } } } },
          customerUser: { select: { id: true, fullName: true, email: true } },
          organisation: { select: { id: true, legalName: true } },
        },
      });

      await this.auditService.record(
        {
          actorUserId,
          action: "OFFLINE_INVOICE_STATUS_UPDATED",
          entityType: "Invoice",
          entityId: id,
          beforeJson: { status: existing.status, version: existing.version },
          afterJson: { status: updated.status, version: updated.version, note: note || undefined },
          correlationId,
          reason: note || undefined,
        },
        tx
      );

      return updated;
    });
  }

  async payInvoice(_id: string, _dto: PayInvoiceDto, _actorUserId: string, _scope: InvoiceListScope) {
    void _id;
    void _dto;
    void _actorUserId;
    void _scope;
    await Promise.resolve();
    throw new BadRequestException("Online payments are disabled. Nauterio operations will confirm any required settlement offline.");
  }
}

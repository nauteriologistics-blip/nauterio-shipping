import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { getPrismaClient, Prisma, type User } from "@nauterio/database";
import { AuditService } from "../audit/audit.module";
import { CreateAddressDto, UpdateAddressDto, UpdateProfileDto } from "./dto/customer.dto";

@Injectable()
export class CustomersService {
  constructor(private readonly auditService: AuditService) {}

  /** Staff-facing customer directory (admin console). Individual customers
   * (staffRole null) only - staff accounts aren't "customers" to manage
   * here. Organisation name comes from the first ACTIVE membership, since a
   * customer can belong to at most one organisation in practice today. */
  async listForAdmin() {
    const prisma = getPrismaClient();
    const users = await prisma.user.findMany({
      where: { staffRole: null, erasedAt: null },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        createdAt: true,
        organisationMemberships: {
          where: { status: "ACTIVE" },
          take: 1,
          select: { organisation: { select: { legalName: true } } },
        },
        bookings: {
          orderBy: { updatedAt: "desc" },
          take: 1,
          select: { id: true, requestStatus: true, currentStep: true, submittedAt: true, updatedAt: true },
        },
        shipmentsAsOwner: {
          orderBy: { updatedAt: "desc" },
          take: 1,
          select: {
            id: true,
            trackingNumber: true,
            lifecycleStatus: true,
            currentTrackingCode: true,
            actionRequiredReason: true,
            operationalHold: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        invoicesAsCustomer: {
          orderBy: { id: "desc" },
          take: 1,
          select: { id: true, invoiceNumber: true, status: true, totalAmountMinorUnits: true, currency: true, dueAt: true, createdAt: true },
        },
        _count: {
          select: {
            bookings: true,
            shipmentsAsOwner: true,
            invoicesAsCustomer: true,
            supportConversations: true,
          },
        },
      },
    });

    return Promise.all(
      users.map(async (u) => {
        const [
          activeShipmentsCount,
          actionRequiredShipmentsCount,
          deliveredShipmentsCount,
          submittedRequestsCount,
          draftRequestsCount,
          openInvoicesCount,
          overdueInvoicesCount,
        ] = await Promise.all([
          prisma.shipment.count({ where: { ownerUserId: u.id, lifecycleStatus: "ACTIVE" } }),
          prisma.shipment.count({ where: { ownerUserId: u.id, lifecycleStatus: "ACTION_REQUIRED" } }),
          prisma.shipment.count({ where: { ownerUserId: u.id, lifecycleStatus: "DELIVERED" } }),
          prisma.booking.count({ where: { userId: u.id, requestStatus: "SUBMITTED" } }),
          prisma.booking.count({ where: { userId: u.id, requestStatus: "DRAFT" } }),
          prisma.invoice.count({ where: { customerUserId: u.id, status: { in: ["ISSUED", "OVERDUE"] } } }),
          prisma.invoice.count({ where: { customerUserId: u.id, status: "OVERDUE" } }),
        ]);

        return {
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          status: u.status,
          createdAt: u.createdAt,
          organisationName: u.organisationMemberships[0]?.organisation.legalName ?? null,
          shipmentsCount: u._count.shipmentsAsOwner,
          bookingsCount: u._count.bookings,
          invoicesCount: u._count.invoicesAsCustomer,
          supportConversationsCount: u._count.supportConversations,
          activeShipmentsCount,
          actionRequiredShipmentsCount,
          deliveredShipmentsCount,
          submittedRequestsCount,
          draftRequestsCount,
          openInvoicesCount,
          overdueInvoicesCount,
          operationsStatus: customerOperationsStatus({
            accountStatus: u.status,
            activeShipments: activeShipmentsCount,
            actionRequiredShipments: actionRequiredShipmentsCount,
            submittedRequests: submittedRequestsCount,
            draftRequests: draftRequestsCount,
            overdueInvoices: overdueInvoicesCount,
            openInvoices: openInvoicesCount,
            deliveredShipments: deliveredShipmentsCount,
            shipments: u._count.shipmentsAsOwner,
          }),
          latestBooking: u.bookings[0] ?? null,
          latestShipment: u.shipmentsAsOwner[0] ?? null,
          latestInvoice: u.invoicesAsCustomer[0] ?? null,
        };
      })
    );
  }

  async listAddresses(userId: string) {
    const prisma = getPrismaClient();
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async addAddress(userId: string, dto: CreateAddressDto) {
    const prisma = getPrismaClient();

    const address = await prisma.$transaction(async (tx) => {
      const created = await tx.address.create({
        data: { userId, ...dto },
      });

      await this.auditService.record({
        actorUserId: userId,
        action: "ADDRESS_CREATED",
        entityType: "Address",
        entityId: created.id,
        afterJson: created,
      }, tx);

      return created;
    });

    return address;
  }

  async updateAddress(id: string, userId: string, dto: UpdateAddressDto) {
    const prisma = getPrismaClient();

    const existing = await prisma.address.findFirst({ where: { id, userId } });
    if (!existing) {
      throw new NotFoundException(`Address ${id} not found`);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const addr = await tx.address.update({
        where: { id },
        data: dto,
      });

      await this.auditService.record({
        actorUserId: userId,
        action: "ADDRESS_UPDATED",
        entityType: "Address",
        entityId: id,
        afterJson: addr,
      }, tx);

      return addr;
    });

    return updated;
  }

  async deleteAddress(id: string, userId: string) {
    const prisma = getPrismaClient();

    const existing = await prisma.address.findFirst({ where: { id, userId } });
    if (!existing) {
      throw new NotFoundException(`Address ${id} not found`);
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({ where: { id } });

      await this.auditService.record({
        actorUserId: userId,
        action: "ADDRESS_DELETED",
        entityType: "Address",
        entityId: id,
      }, tx);
    });

    return { success: true };
  }

  async getProfile(userId: string) {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true, organisationMemberships: { include: { organisation: true } } },
    });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    return user;
  }

  /**
   * DATA-007: `User.version` is real optimistic locking now, not dead
   * schema - see `UpdateProfileDto.expectedVersion`'s doc comment. Every
   * successful update increments it regardless of whether the caller
   * supplied `expectedVersion`, so the counter stays meaningful for the
   * next caller even if this one didn't opt in to the conflict check.
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const prisma = getPrismaClient();
    const { expectedVersion, ...data } = dto;

    const updated = await prisma.$transaction(async (tx) => {
      let user: User;
      if (expectedVersion !== undefined) {
        try {
          user = await tx.user.update({
            where: { id: userId, version: expectedVersion },
            data: { ...data, version: { increment: 1 } },
          });
        } catch (err) {
          if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            // P2025 means the compound WHERE matched no row - disambiguate
            // "id doesn't exist" (genuine 404) from "id exists but version
            // moved on" (a real concurrent-edit conflict) rather than
            // reporting one as the other.
            const exists = await tx.user.findUnique({ where: { id: userId }, select: { id: true } });
            if (!exists) {
              throw new NotFoundException(`User ${userId} not found`);
            }
            throw new ConflictException(
              `Profile was modified since you last loaded it (expected version ${expectedVersion}). Reload and retry.`
            );
          }
          throw err;
        }
      } else {
        user = await tx.user.update({
          where: { id: userId },
          data: { ...data, version: { increment: 1 } },
        });
      }

      await this.auditService.record({
        actorUserId: userId,
        action: "PROFILE_UPDATED",
        entityType: "User",
        entityId: userId,
        afterJson: user,
      }, tx);

      return user;
    });

    return updated;
  }
}

function customerOperationsStatus(input: {
  accountStatus: string;
  activeShipments: number;
  actionRequiredShipments: number;
  submittedRequests: number;
  draftRequests: number;
  overdueInvoices: number;
  openInvoices: number;
  deliveredShipments: number;
  shipments: number;
}): "ACCOUNT_NOT_ACTIVE" | "NEEDS_ATTENTION" | "AWAITING_REVIEW" | "SHIPPING_NOW" | "INVOICE_OPEN" | "DRAFT_ONLY" | "DELIVERED_BEFORE" | "REGISTERED_ONLY" {
  if (input.accountStatus !== "ACTIVE") return "ACCOUNT_NOT_ACTIVE";
  if (input.actionRequiredShipments > 0 || input.overdueInvoices > 0) return "NEEDS_ATTENTION";
  if (input.submittedRequests > 0) return "AWAITING_REVIEW";
  if (input.activeShipments > 0) return "SHIPPING_NOW";
  if (input.openInvoices > 0) return "INVOICE_OPEN";
  if (input.draftRequests > 0) return "DRAFT_ONLY";
  if (input.deliveredShipments > 0 || input.shipments > 0) return "DELIVERED_BEFORE";
  return "REGISTERED_ONLY";
}

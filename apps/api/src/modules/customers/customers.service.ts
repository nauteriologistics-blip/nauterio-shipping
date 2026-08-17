import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { getPrismaClient, Prisma } from "@nauterio/database";
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
        _count: { select: { shipmentsAsOwner: true } },
      },
    });

    return users.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      status: u.status,
      createdAt: u.createdAt,
      organisationName: u.organisationMemberships[0]?.organisation.legalName ?? null,
      shipmentsCount: u._count.shipmentsAsOwner,
    }));
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
      let user;
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

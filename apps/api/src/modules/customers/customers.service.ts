import { Injectable, NotFoundException } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { AuditService } from "../audit/audit.module";
import { CreateAddressDto, UpdateAddressDto, UpdateProfileDto } from "./dto/customer.dto";

@Injectable()
export class CustomersService {
  constructor(private readonly auditService: AuditService) {}

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

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const prisma = getPrismaClient();

    const updated = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: dto,
      });

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

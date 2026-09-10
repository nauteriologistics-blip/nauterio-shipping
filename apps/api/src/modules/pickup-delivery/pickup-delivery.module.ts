import { BadRequestException, Controller, Get, Post, Body, ForbiddenException, Injectable, Module, Param, ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { getScopedShipmentOrThrow } from "../../common/authorization/shipment-scope";
import { IsEmail, IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";
import { AuditService } from "../audit/audit.module";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import { randomUUID } from "node:crypto";
import { STAFF_ROLES } from "@nauterio/contracts";

class DeliveryConfirmDto {
  @IsString()
  @MinLength(2)
  recipientName: string;
}

class AssignDeliveryDto {
  @IsUUID()
  driverUserId!: string;

  @IsOptional()
  @IsIn(["SCHEDULED", "OUT_FOR_DELIVERY"])
  status?: "SCHEDULED" | "OUT_FOR_DELIVERY";
}

class CreateDriverDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;
}

/** Pickup/delivery operations controlled by staff assignments. Drivers see
 * only work explicitly assigned to their user account and may complete only
 * those records. */
@Injectable()
export class PickupDeliveryService {
  constructor(private readonly auditService: AuditService) {}

  async listByShipment(shipmentId: string, caller: AuthenticatedUser) {
    await getScopedShipmentOrThrow(shipmentId, caller);

    const prisma = getPrismaClient();
    const [pickups, deliveries] = await Promise.all([
      prisma.pickup.findMany({ where: { shipmentId } }),
      prisma.delivery.findMany({ where: { shipmentId }, orderBy: { createdAt: "asc" } }),
    ]);
    if (!(STAFF_ROLES as readonly string[]).includes(caller.role)) {
      return {
        pickups: pickups.map((pickup) => ({ id: pickup.id, windowStart: pickup.windowStart, windowEnd: pickup.windowEnd, status: pickup.status, attemptCount: pickup.attemptCount })),
        deliveries: deliveries.map((delivery) => ({ id: delivery.id, windowStart: delivery.windowStart, windowEnd: delivery.windowEnd, status: delivery.status, attemptCount: delivery.attemptCount, recipientName: delivery.recipientName })),
      };
    }
    return { pickups, deliveries };
  }

  async listDrivers() {
    return getPrismaClient().user.findMany({
      where: { staffRole: "DRIVER", status: "ACTIVE", erasedAt: null },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, email: true },
    });
  }

  async createDriver(dto: CreateDriverDto, caller: AuthenticatedUser, correlationId: string) {
    const prisma = getPrismaClient();
    const email = dto.email.trim().toLowerCase();
    if (await prisma.user.count({ where: { email: { equals: email, mode: "insensitive" } } })) throw new BadRequestException("An account already uses this email address.");
    return prisma.$transaction(async (tx) => {
      const driver = await tx.user.create({ data: { cognitoSub: `drv_${randomUUID()}`, email, fullName: dto.fullName.trim(), status: "ACTIVE", staffRole: "DRIVER" }, select: { id: true, fullName: true, email: true } });
      await this.auditService.record({ actorUserId: caller.userId, action: "DRIVER_ACCOUNT_CREATED", entityType: "User", entityId: driver.id, afterJson: { email: driver.email, staffRole: "DRIVER" }, correlationId }, tx);
      return driver;
    });
  }

  async listMyAssignments(caller: AuthenticatedUser) {
    if (caller.role !== "DRIVER") throw new ForbiddenException("Driver access is required.");
    return getPrismaClient().delivery.findMany({
      where: { assignedDriverUserId: caller.userId, status: { in: ["SCHEDULED", "OUT_FOR_DELIVERY"] } },
      orderBy: [{ windowStart: "asc" }, { id: "asc" }],
      select: {
        id: true,
        status: true,
        windowStart: true,
        windowEnd: true,
        shipment: {
          select: {
            id: true,
            trackingNumber: true,
            receiverNameSnapshot: true,
            receiverAddressSnapshot: true,
            lifecycleStatus: true,
          },
        },
      },
    });
  }

  async assignDelivery(shipmentId: string, dto: AssignDeliveryDto, caller: AuthenticatedUser, correlationId: string) {
    const shipment = await getScopedShipmentOrThrow(shipmentId, caller);
    if (["DELIVERED", "CANCELLED", "ARCHIVED"].includes(shipment.lifecycleStatus)) throw new BadRequestException(`A ${shipment.lifecycleStatus.toLowerCase()} shipment cannot be assigned for delivery.`);
    const prisma = getPrismaClient();
    const driver = await prisma.user.findFirst({ where: { id: dto.driverUserId, staffRole: "DRIVER", status: "ACTIVE", erasedAt: null }, select: { id: true, fullName: true, email: true } });
    if (!driver) throw new ForbiddenException("Select an active driver account.");

    return prisma.$transaction(async (tx) => {
      const current = await tx.delivery.findFirst({ where: { shipmentId }, orderBy: { createdAt: "desc" } });
      const delivery = current
        ? await tx.delivery.update({ where: { id: current.id }, data: { assignedDriverUserId: driver.id, status: dto.status ?? "SCHEDULED" }, include: { assignedDriverUser: { select: { id: true, fullName: true, email: true } } } })
        : await tx.delivery.create({ data: { shipmentId, assignedDriverUserId: driver.id, status: dto.status ?? "SCHEDULED" }, include: { assignedDriverUser: { select: { id: true, fullName: true, email: true } } } });
      await this.auditService.record({ actorUserId: caller.userId, action: "DELIVERY_ASSIGNED", entityType: "Delivery", entityId: delivery.id, beforeJson: current ? { assignedDriverUserId: current.assignedDriverUserId, status: current.status } : undefined, afterJson: { shipmentId: shipment.id, assignedDriverUserId: driver.id, status: delivery.status }, correlationId }, tx);
      return delivery;
    });
  }

  async confirmDelivery(shipmentId: string, dto: DeliveryConfirmDto, caller: AuthenticatedUser, correlationId = "unknown") {
    const prisma = getPrismaClient();
    const assignment = await prisma.delivery.findFirst({ where: { shipmentId, assignedDriverUserId: caller.userId, status: { in: ["SCHEDULED", "OUT_FOR_DELIVERY"] } } });
    if (!assignment) throw new ForbiddenException("This delivery is not assigned to you or is already complete.");

    return prisma.$transaction(async (tx) => {
      const claimed = await tx.delivery.updateMany({
        where: { id: assignment.id, assignedDriverUserId: caller.userId, status: { in: ["SCHEDULED", "OUT_FOR_DELIVERY"] } },
        data: { status: "DELIVERED", recipientName: dto.recipientName, updatedAt: new Date() },
      });
      if (!claimed.count) throw new ForbiddenException("This delivery is not assigned to you or is already complete.");

      await tx.trackingEvent.create({
        data: {
          shipmentId,
          canonicalCode: "DELIVERED",
          publicTitleEn: "Delivered",
          publicTitleIt: "Consegnato",
          sourceType: "DRIVER",
          eventTime: new Date(),
          visibility: "PUBLIC",
          actorUserId: caller.userId,
        },
      });

      await tx.shipment.update({
        where: { id: shipmentId },
        data: {
          lifecycleStatus: "DELIVERED",
          currentTrackingCode: "DELIVERED",
          deliveredAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await this.auditService.record({ actorUserId: caller.userId, action: "DELIVERY_CONFIRMED", entityType: "Delivery", entityId: assignment.id, beforeJson: { status: assignment.status }, afterJson: { status: "DELIVERED", shipmentId }, correlationId }, tx);

      return { success: true };
    });
  }
}

@ApiTags("driver-deliveries")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("driver/deliveries")
class DriverDeliveryController {
  constructor(private readonly service: PickupDeliveryService) {}

  @Get()
  @RequirePermission("shipment:read")
  async list(@CurrentUser() user: AuthenticatedUser) { return this.service.listMyAssignments(user); }
}

@ApiTags("admin-deliveries")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("admin/deliveries")
class AdminDeliveryController {
  constructor(private readonly service: PickupDeliveryService) {}

  @Get("drivers")
  @RequirePermission("shipment:edit")
  async drivers() { return this.service.listDrivers(); }

  @Post("drivers")
  @RequirePermission("staff:manage")
  @RequireIdempotencyKey()
  async createDriver(@Body() dto: CreateDriverDto, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) {
    return this.service.createDriver(dto, user, correlationId);
  }

  @Post(":shipmentId/assign")
  @RequirePermission("shipment:edit")
  @RequireIdempotencyKey()
  async assign(@Param("shipmentId", ParseUUIDPipe) shipmentId: string, @Body() dto: AssignDeliveryDto, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) {
    return this.service.assignDelivery(shipmentId, dto, user, correlationId);
  }
}

@ApiTags("pickup-delivery")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("shipments/:shipmentId/pickup-delivery")
class PickupDeliveryController {
  constructor(private readonly service: PickupDeliveryService) {}

  @Get()
  @RequirePermission("shipment:read")
  async list(
    @Param("shipmentId", ParseUUIDPipe) shipmentId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.listByShipment(shipmentId, user);
  }

  @Post("delivery-confirm")
  @RequirePermission("tracking_event:add")
  @RequireIdempotencyKey()
  async confirmDelivery(
    @Param("shipmentId", ParseUUIDPipe) shipmentId: string,
    @Body() dto: DeliveryConfirmDto,
    @CurrentUser() user: AuthenticatedUser,
    @CorrelationId() correlationId: string
  ) {
    return this.service.confirmDelivery(shipmentId, dto, user, correlationId);
  }
}

@Module({
  controllers: [PickupDeliveryController, DriverDeliveryController, AdminDeliveryController],
  providers: [PickupDeliveryService],
  exports: [PickupDeliveryService],
})
export class PickupDeliveryModule {}

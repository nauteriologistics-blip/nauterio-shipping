import { Controller, Get, Injectable, Module, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { Body, Post, NotFoundException } from "@nestjs/common";
import { IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";

class IntakeDto {
  @IsString()
  @MinLength(6)
  trackingNumber: string;

  @IsUUID()
  warehouseId: string;

  @IsNumber()
  @IsPositive()
  measuredWeight: number;

  @IsNumber()
  @IsPositive()
  measuredL: number;

  @IsNumber()
  @IsPositive()
  measuredW: number;

  @IsNumber()
  @IsPositive()
  measuredH: number;

  @IsString()
  uldContainer: string;
}

/** Warehouse module (spec section 24): facilities, inventory location,
 * inspection, measurements, consolidation, repacking, dispatch. Facility
 * listing implemented (real data, seeded); scan/inspection/manifest
 * workflows need the warehouse PWA's real device flow (spec Phase 7) to
 * design against, deferred. */
@Injectable()
class WarehouseService {
  async listWarehouses() {
    const prisma = getPrismaClient();
    return prisma.warehouse.findMany({ where: { active: true } });
  }

  async processIntake(dto: IntakeDto, caller: AuthenticatedUser) {
    const prisma = getPrismaClient();
    const warehouse = await prisma.warehouse.findFirst({
      where: { id: dto.warehouseId, active: true },
    });
    if (!warehouse || !caller.warehouseIds.includes(warehouse.id)) {
      throw new NotFoundException("Warehouse not found or not assigned to this account");
    }
    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber: dto.trackingNumber.trim().toUpperCase() },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment not found`);
    }

    return prisma.$transaction(async (tx) => {
      await tx.trackingEvent.create({
        data: {
          shipmentId: shipment.id,
          canonicalCode: "RECEIVED_ORIGIN",
          publicTitleEn: "Received at origin facility",
          publicTitleIt: "Ricevuto presso la struttura di origine",
          sourceType: "WAREHOUSE_SCAN",
          eventTime: new Date(),
          visibility: "AUTHENTICATED_CUSTOMER",
          actorUserId: caller.userId,
          locationJson: {
            warehouseId: warehouse.id,
            facility: warehouse.name,
            city: warehouse.city,
            countryCode: warehouse.countryCode,
          },
          internalDescription: `Intake measured ${dto.measuredWeight}kg, ${dto.measuredL}x${dto.measuredW}x${dto.measuredH}cm${dto.uldContainer ? `, ULD ${dto.uldContainer}` : ""}`,
        },
      });
      return { success: true };
    });
  }
}

@ApiTags("warehouse")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("admin/warehouses")
class WarehouseController {
  constructor(private readonly service: WarehouseService) {}

  @Get()
  @RequirePermission("warehouse:read")
  async list() {
    return this.service.listWarehouses();
  }

  @Post("intake")
  @RequirePermission("tracking_event:add")
  @RequireIdempotencyKey()
  async processIntake(@Body() dto: IntakeDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.processIntake(dto, user);
  }
}

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}

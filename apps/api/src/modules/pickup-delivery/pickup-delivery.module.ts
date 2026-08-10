import { Controller, Get, Injectable, Module, Param, ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { getScopedShipmentOrThrow } from "../../common/authorization/shipment-scope";

/** Pickup/delivery module (spec section 24): time windows, assignments,
 * attempts, proof, partner workflow. Read path only for now - assignment
 * logic needs real driver/warehouse operations data (Phase 7 in the spec's
 * roadmap) that doesn't exist yet. */
@Injectable()
class PickupDeliveryService {
  async listByShipment(shipmentId: string, caller: AuthenticatedUser) {
    await getScopedShipmentOrThrow(shipmentId, caller);

    const prisma = getPrismaClient();
    const [pickups, deliveries] = await Promise.all([
      prisma.pickup.findMany({ where: { shipmentId } }),
      prisma.delivery.findMany({ where: { shipmentId } }),
    ]);
    return { pickups, deliveries };
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
}

@Module({
  controllers: [PickupDeliveryController],
  providers: [PickupDeliveryService],
  exports: [PickupDeliveryService],
})
export class PickupDeliveryModule {}

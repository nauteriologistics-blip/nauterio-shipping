import { Controller, Get, Injectable, Module, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";

/** Pickup/delivery module (spec section 24): time windows, assignments,
 * attempts, proof, partner workflow. Read path only for now - assignment
 * logic needs real driver/warehouse operations data (Phase 7 in the spec's
 * roadmap) that doesn't exist yet. */
@Injectable()
class PickupDeliveryService {
  async listByShipment(shipmentId: string) {
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
@UseGuards(AuthGuard)
@Controller("shipments/:shipmentId/pickup-delivery")
class PickupDeliveryController {
  constructor(private readonly service: PickupDeliveryService) {}

  @Get()
  async list(@Param("shipmentId") shipmentId: string) {
    return this.service.listByShipment(shipmentId);
  }
}

@Module({
  controllers: [PickupDeliveryController],
  providers: [PickupDeliveryService],
  exports: [PickupDeliveryService],
})
export class PickupDeliveryModule {}

import { Controller, Get, Injectable, Module, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ParseUUIDPipe } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { getScopedShipmentOrThrow } from "../../common/authorization/shipment-scope";

/** Customs/compliance module (spec section 24): customs cases, item
 * declarations, restricted-goods review, broker, deadlines. Read path only -
 * broker integration and restricted-goods rule engine need a real customs
 * broker contract (ADR 0001 section 11, item 1). */
@Injectable()
class CustomsService {
  async getCaseByShipment(shipmentId: string, caller: AuthenticatedUser) {
    // Resolve the parent shipment through the shared scope helper first
    // (SEC-003): a customs case for a shipment the caller cannot see must
    // 404 the same way the shipment itself would.
    await getScopedShipmentOrThrow(shipmentId, caller);

    const prisma = getPrismaClient();
    const customsCase = await prisma.customsCase.findUnique({ where: { shipmentId } });
    if (!customsCase) throw new NotFoundException(`No customs case for shipment ${shipmentId}`);
    return customsCase;
  }
}

@ApiTags("customs")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("shipments/:shipmentId/customs-case")
class CustomsController {
  constructor(private readonly service: CustomsService) {}

  @Get()
  @RequirePermission("shipment:read")
  async get(
    @Param("shipmentId", ParseUUIDPipe) shipmentId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.getCaseByShipment(shipmentId, user);
  }
}

@Module({
  controllers: [CustomsController],
  providers: [CustomsService],
  exports: [CustomsService],
})
export class CustomsModule {}

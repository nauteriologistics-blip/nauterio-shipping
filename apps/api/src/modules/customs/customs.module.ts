import { Controller, Get, Injectable, Module, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";

/** Customs/compliance module (spec section 24): customs cases, item
 * declarations, restricted-goods review, broker, deadlines. Read path only -
 * broker integration and restricted-goods rule engine need a real customs
 * broker contract (ADR 0001 section 11, item 1). */
@Injectable()
class CustomsService {
  async getCaseByShipment(shipmentId: string) {
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
  async get(@Param("shipmentId") shipmentId: string) {
    return this.service.getCaseByShipment(shipmentId);
  }
}

@Module({
  controllers: [CustomsController],
  providers: [CustomsService],
  exports: [CustomsService],
})
export class CustomsModule {}

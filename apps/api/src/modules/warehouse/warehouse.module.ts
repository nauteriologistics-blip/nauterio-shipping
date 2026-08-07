import { Controller, Get, Injectable, Module, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";

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
}

@ApiTags("warehouse")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("admin/warehouses")
class WarehouseController {
  constructor(private readonly service: WarehouseService) {}

  @Get()
  @RequirePermission("shipment:read")
  async list() {
    return this.service.listWarehouses();
  }
}

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}

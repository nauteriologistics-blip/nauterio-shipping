import { Controller, Get, Injectable, Module, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";

/** Reporting module (spec section 24): operational/financial datasets,
 * exports, scheduled reports. A single real operational metric (open
 * shipment count) rather than the full reporting suite - large exports
 * belong on the `reports` queue in apps/worker (ADR 0001 section 7.2),
 * never inside a request-serving transaction (spec section 24 rule). */
@Injectable()
class ReportingService {
  async getOperationalSummary() {
    const prisma = getPrismaClient();
    const [activeShipments, actionRequired, openClaims] = await Promise.all([
      prisma.shipment.count({ where: { lifecycleStatus: "ACTIVE" } }),
      prisma.shipment.count({ where: { lifecycleStatus: "ACTION_REQUIRED" } }),
      prisma.claim.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
    ]);
    return { activeShipments, actionRequired, openClaims };
  }
}

@ApiTags("reporting")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("admin/reports/operational-summary")
class ReportingController {
  constructor(private readonly service: ReportingService) {}

  @Get()
  @RequirePermission("data:export")
  async get() {
    return this.service.getOperationalSummary();
  }
}

@Module({
  controllers: [ReportingController],
  providers: [ReportingService],
  exports: [ReportingService],
})
export class ReportingModule {}

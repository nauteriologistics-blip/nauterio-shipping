import { Controller, Get, Injectable, Module, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";

/** Live operational counters for the admin console. Every value is derived
 * directly from production records; larger exports still belong on the
 * worker queue rather than inside this request. */
@Injectable()
class ReportingService {
  async getOperationalSummary() {
    const prisma = getPrismaClient();
    const [activeShipments, actionRequired, deliveredShipments, openClaims, awaitingDocuments, openSupport, pendingRequests, issuedInvoices, paidInvoices] = await Promise.all([
      prisma.shipment.count({ where: { lifecycleStatus: "ACTIVE" } }),
      prisma.shipment.count({ where: { lifecycleStatus: "ACTION_REQUIRED" } }),
      prisma.shipment.count({ where: { lifecycleStatus: "DELIVERED" } }),
      prisma.claim.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
      prisma.document.count({ where: { reviewStatus: "PROCESSING" } }),
      prisma.supportConversation.count({ where: { status: { in: ["OPEN", "WAITING_FOR_AGENT"] } } }),
      prisma.booking.count({ where: { requestStatus: "SUBMITTED" } }),
      prisma.invoice.count({ where: { status: "ISSUED" } }),
      prisma.invoice.count({ where: { status: "PAID" } }),
    ]);
    return { activeShipments, actionRequired, deliveredShipments, openClaims, awaitingDocuments, openSupport, pendingRequests, issuedInvoices, paidInvoices };
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

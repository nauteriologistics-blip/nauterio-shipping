import { Controller, Get, Injectable, Module, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";

/** Integrations module (spec section 24): carrier, customs broker, payment,
 * maps, messaging, support, accounting adapters + ApiClient/ApiKey/
 * WebhookEndpoint identity for business/partner integrations. This owns
 * the *identity* records; actual provider adapters live in
 * packages/integrations (typed interfaces + local mocks - see ADR 0001
 * section 9.1), wired to real credentials in each domain module as those
 * become available. */
@Injectable()
class IntegrationsService {
  async listApiClients(organisationId: string) {
    const prisma = getPrismaClient();
    return prisma.apiClient.findMany({ where: { organisationId }, include: { webhookEndpoints: true } });
  }
}

@ApiTags("integrations")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("business/organisations/:organisationId/api-clients")
class IntegrationsController {
  constructor(private readonly service: IntegrationsService) {}

  @Get()
  async list(organisationId: string) {
    return this.service.listApiClients(organisationId);
  }
}

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}

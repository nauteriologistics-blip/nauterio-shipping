import {
  Controller,
  ForbiddenException,
  Get,
  Injectable,
  Module,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { STAFF_ROLES } from "@nauterio/contracts";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

/** Integrations module (spec section 24): carrier, customs broker, payment,
 * maps, messaging, support, accounting adapters + ApiClient/ApiKey/
 * WebhookEndpoint identity for business/partner integrations. This owns
 * the *identity* records; actual provider adapters live in
 * packages/integrations (typed interfaces + local mocks - see ADR 0001
 * section 9.1), wired to real credentials in each domain module as those
 * become available. */
@Injectable()
class IntegrationsService {
  async listApiClients(organisationId: string, caller: AuthenticatedUser) {
    // SEC-001: the caller must actually belong to this organisation (or be
    // staff) - previously the route param was never bound to anything
    // (missing @Param decorator), so this filter was silently never
    // applied at all.
    const isStaff = (STAFF_ROLES as readonly string[]).includes(caller.role);
    if (!isStaff && caller.organisationId !== organisationId) {
      throw new ForbiddenException("Caller is not a member of this organisation");
    }

    const prisma = getPrismaClient();
    return prisma.apiClient.findMany({
      where: { organisationId },
      select: {
        id: true,
        organisationId: true,
        name: true,
        scopes: true,
        active: true,
        createdAt: true,
        webhookEndpoints: {
          // Never return hashedSecret - a webhook consumer never needs it
          // back, and it is exactly the kind of field an `include: true`
          // silently over-exposes.
          select: {
            id: true,
            apiClientId: true,
            url: true,
            eventTypes: true,
            active: true,
            lastDeliveryAt: true,
            lastFailureAt: true,
            createdAt: true,
          },
        },
      },
    });
  }
}

@ApiTags("integrations")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("business/organisations/:organisationId/api-clients")
class IntegrationsController {
  constructor(private readonly service: IntegrationsService) {}

  @Get()
  @RequirePermission("organisation:read")
  async list(
    @Param("organisationId", ParseUUIDPipe) organisationId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.listApiClients(organisationId, user);
  }
}

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}

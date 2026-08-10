import {
  Controller,
  Get,
  Injectable,
  Module,
  NotFoundException,
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

/**
 * Organisations module (spec section 24): business accounts, members,
 * roles, approvals, contracts, credit. Approval/contract/credit workflows
 * need real business rules from Phase 0 (spec section 37) that don't exist
 * yet - this implements the read path so BillingModule and the business
 * portal have something real to call against now.
 */
@Injectable()
class OrganisationsService {
  async getById(id: string, caller: AuthenticatedUser) {
    const prisma = getPrismaClient();
    const org = await prisma.organisation.findUnique({
      where: { id },
      include: { members: true },
    });
    if (!org) throw new NotFoundException(`Organisation ${id} not found`);

    // SEC-003: a customer/organisation-role caller may only see an
    // organisation they actually belong to - 404 (not 403) so the route
    // does not confirm the ID's existence to a non-member.
    const isStaff = (STAFF_ROLES as readonly string[]).includes(caller.role);
    if (!isStaff && caller.organisationId !== id) {
      throw new NotFoundException(`Organisation ${id} not found`);
    }

    return org;
  }
}

@ApiTags("organisations")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("business/organisations")
class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Get(":id")
  @RequirePermission("organisation:read")
  async getById(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.organisationsService.getById(id, user);
  }
}

@Module({
  controllers: [OrganisationsController],
  providers: [OrganisationsService],
  exports: [OrganisationsService],
})
export class OrganisationsModule {}

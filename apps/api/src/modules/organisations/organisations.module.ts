import { Controller, Get, Injectable, Module, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";

/**
 * Organisations module (spec section 24): business accounts, members,
 * roles, approvals, contracts, credit. Approval/contract/credit workflows
 * need real business rules from Phase 0 (spec section 37) that don't exist
 * yet - this implements the read path so BillingModule and the business
 * portal have something real to call against now.
 */
@Injectable()
class OrganisationsService {
  async getById(id: string) {
    const prisma = getPrismaClient();
    const org = await prisma.organisation.findUnique({
      where: { id },
      include: { members: true },
    });
    if (!org) throw new NotFoundException(`Organisation ${id} not found`);
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
  async getById(@Param("id") id: string) {
    return this.organisationsService.getById(id);
  }
}

@Module({
  controllers: [OrganisationsController],
  providers: [OrganisationsService],
  exports: [OrganisationsService],
})
export class OrganisationsModule {}

import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { ListShipmentsQueryDto } from "./dto/list-shipments.dto";
import { ShipmentsService } from "./shipments.service";

@ApiTags("shipments")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("shipments")
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  @RequirePermission("shipment:read")
  async list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListShipmentsQueryDto) {
    return this.shipmentsService.list(
      { role: user.role, userId: user.userId, organisationId: user.organisationId },
      { cursor: query.cursor, limit: query.limit },
      { status: query.status, createdAfter: query.createdAfter, createdBefore: query.createdBefore }
    );
  }

  @Get(":id")
  @RequirePermission("shipment:read")
  async getById(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.shipmentsService.getById(id, {
      role: user.role,
      userId: user.userId,
      organisationId: user.organisationId,
    });
  }
}

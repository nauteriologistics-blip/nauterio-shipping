import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { CursorPaginationQueryDto } from "../../common/pagination/cursor-pagination.dto";
import { ShipmentsService } from "./shipments.service";

@ApiTags("shipments")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("shipments")
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  @RequirePermission("shipment:read")
  async list(@CurrentUser() user: AuthenticatedUser, @Query() pagination: CursorPaginationQueryDto) {
    return this.shipmentsService.list(
      { role: user.role, userId: user.userId, organisationId: user.organisationId },
      pagination
    );
  }

  @Get(":id")
  @RequirePermission("shipment:read")
  async getById(@Param("id") id: string) {
    return this.shipmentsService.getById(id);
  }
}

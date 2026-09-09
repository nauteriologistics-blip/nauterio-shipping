import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { ListShipmentsQueryDto } from "./dto/list-shipments.dto";
import { CreateAdminShipmentDto } from "./dto/create-admin-shipment.dto";
import { ShipmentsService } from "./shipments.service";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";

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

  @Post("admin")
  @RequirePermission("shipment:create")
  @RequireIdempotencyKey()
  async createAdminShipment(@Body() dto: CreateAdminShipmentDto, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) {
    return this.shipmentsService.createAdminShipment(dto, user.userId, correlationId);
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

import { Body, Controller, Get, Headers, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { BusinessInquiriesService } from "./business-inquiries.service";
import { CreateBusinessInquiryDto, UpdateBusinessInquiryDto } from "./dto/business-inquiry.dto";

@ApiTags("business-inquiries")
@Controller("business-inquiries")
export class BusinessInquiriesController {
  constructor(private readonly service: BusinessInquiriesService) {}

  @Post()
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @ApiOperation({ summary: "Submit a public business inquiry" })
  async create(
    @Body() dto: CreateBusinessInquiryDto,
    @Headers("user-agent") userAgent: string | undefined,
    @CorrelationId() correlationId: string
  ) {
    return this.service.create(dto, { correlationId, userAgent });
  }
}

@ApiTags("admin-business-inquiries")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("admin/business-inquiries")
export class AdminBusinessInquiriesController {
  constructor(private readonly service: BusinessInquiriesService) {}

  @Get()
  @RequirePermission("support:manage")
  @ApiOperation({ summary: "List business inquiries for staff follow-up" })
  async list(@Query("status") status?: string, @Query("after") after?: string, @Query("limit") limit?: string) {
    return this.service.list({ status, after, limit: limit ? parseInt(limit, 10) : undefined });
  }

  @Patch(":id")
  @RequirePermission("support:manage")
  @ApiOperation({ summary: "Update business inquiry follow-up status" })
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateBusinessInquiryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.update(id, dto, user.userId);
  }
}

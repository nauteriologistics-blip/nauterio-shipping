import { Controller, Get, Post, Patch, Body, Param, ParseUUIDPipe, Query, UseGuards, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { NoPermissionRequired } from "../../common/decorators/no-permission-required.decorator";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import { BookingsService } from "./bookings.service";
import { SaveDraftDto, RejectShipmentRequestDto } from "./dto/booking.dto";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

@ApiTags("bookings")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @NoPermissionRequired()
  @ApiOperation({ summary: "List user's bookings" })
  async listBookings(@Query("after") after?: string, @Query("limit") limit?: string, @Req() req?: Request) {
    const userId = req.user.userId;
    const organisationId = req.user.organisationId;
    return this.bookingsService.listBookings({
      userId,
      organisationId,
      after,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get("admin/requests")
  @RequirePermission("shipment:create")
  @ApiOperation({ summary: "List shipment requests awaiting staff review" })
  async listRequests(@Query("status") status?: string, @Query("after") after?: string, @Query("limit") limit?: string) {
    return this.bookingsService.listRequests({ status, after, limit: limit ? parseInt(limit, 10) : undefined });
  }

  @Get(":id")
  @NoPermissionRequired()
  @ApiOperation({ summary: "Get booking by ID" })
  async getBooking(@Param("id", ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = req.user.userId;
    return this.bookingsService.getBookingById(id, userId);
  }

  @Post()
  @NoPermissionRequired()
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Create/Save booking draft" })
  async saveDraft(@Body() dto: SaveDraftDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.bookingsService.saveDraft(userId, dto);
  }

  @Patch(":id")
  @NoPermissionRequired()
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Update booking draft" })
  async updateDraft(@Param("id", ParseUUIDPipe) id: string, @Body() dto: SaveDraftDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.bookingsService.updateDraft(id, userId, dto);
  }

  @Post(":id/submit")
  @NoPermissionRequired()
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Submit a shipment request for staff review" })
  async submitRequest(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: Request,
    @CorrelationId() correlationId: string
  ) {
    const userId = req.user.userId;
    return this.bookingsService.submitRequest(id, userId, correlationId);
  }

  @Post(":id/approve")
  @RequirePermission("shipment:create")
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Approve a shipment request and issue its invoice and tracking number" })
  async approveRequest(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) {
    return this.bookingsService.approveRequest(id, user.userId, correlationId);
  }

  @Post(":id/reject")
  @RequirePermission("shipment:edit")
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Reject a shipment request" })
  async rejectRequest(@Param("id", ParseUUIDPipe) id: string, @Body() dto: RejectShipmentRequestDto, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) {
    return this.bookingsService.rejectRequest(id, user.userId, dto.reason, correlationId);
  }
}

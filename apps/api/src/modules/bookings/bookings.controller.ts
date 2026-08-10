import { Controller, Get, Post, Patch, Body, Param, ParseUUIDPipe, Query, UseGuards, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { NoPermissionRequired } from "../../common/decorators/no-permission-required.decorator";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import { BookingsService } from "./bookings.service";
import { SaveDraftDto, ConfirmBookingDto } from "./dto/booking.dto";

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
    const userId = req!.user!.userId;
    const organisationId = req!.user!.organisationId;
    return this.bookingsService.listBookings({
      userId,
      organisationId,
      after,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(":id")
  @NoPermissionRequired()
  @ApiOperation({ summary: "Get booking by ID" })
  async getBooking(@Param("id", ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = req.user!.userId;
    return this.bookingsService.getBookingById(id, userId);
  }

  @Post()
  @NoPermissionRequired()
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Create/Save booking draft" })
  async saveDraft(@Body() dto: SaveDraftDto, @Req() req: Request) {
    const userId = req.user!.userId;
    return this.bookingsService.saveDraft(userId, dto);
  }

  @Patch(":id")
  @NoPermissionRequired()
  @ApiOperation({ summary: "Update booking draft" })
  async updateDraft(@Param("id", ParseUUIDPipe) id: string, @Body() dto: SaveDraftDto, @Req() req: Request) {
    const userId = req.user!.userId;
    return this.bookingsService.updateDraft(id, userId, dto);
  }

  @Post(":id/confirm")
  @NoPermissionRequired()
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Confirm booking and convert to active shipment" })
  async confirmBooking(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: ConfirmBookingDto,
    @Req() req: Request,
    @CorrelationId() correlationId: string
  ) {
    const userId = req.user!.userId;
    return this.bookingsService.confirmBooking(id, userId, dto, correlationId);
  }
}

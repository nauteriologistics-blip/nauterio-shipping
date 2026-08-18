import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { TrackingService } from "./tracking.service";
import { AuthGuard, type AuthenticatedUser } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import { AddAdminTrackingEventDto, CorrectAdminTrackingEventDto } from "./dto/admin-tracking-event.dto";
import { PlaceShipmentHoldDto } from "./dto/shipment-hold.dto";

@ApiTags("tracking")
@Controller("tracking")
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  /** Public, anonymous lookup (spec section 26.1). Tighter per-IP limit than
   * the app default - spec section 31 names "tracking enumeration" as a
   * threat given tracking numbers are opaque but guessable by brute force.
   * A production WAF-layer limit (ADR 0001 section 5.3) is defense in depth
   * on top of this, not a replacement for it. */
  @Get(":trackingNumber")
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async getByTrackingNumber(@Param("trackingNumber") trackingNumber: string) {
    return this.trackingService.getByTrackingNumber(trackingNumber);
  }
}

@ApiTags("admin tracking")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("admin/shipments/:shipmentId/tracking-events")
export class AdminTrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get("statuses")
  @RequirePermission("tracking_event:add")
  getStatuses(@Param("shipmentId", ParseUUIDPipe) shipmentId: string) {
    return this.trackingService.getAdminStatuses(shipmentId);
  }

  @Post()
  @RequirePermission("tracking_event:add")
  @RequireIdempotencyKey()
  addEvent(@Param("shipmentId", ParseUUIDPipe) shipmentId: string, @Body() dto: AddAdminTrackingEventDto, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) {
    return this.trackingService.addAdminEvent(shipmentId, dto, user.userId, correlationId);
  }

  @Post(":eventId/corrections")
  @RequirePermission("tracking_event:correct")
  @RequireIdempotencyKey()
  correctEvent(@Param("shipmentId", ParseUUIDPipe) shipmentId: string, @Param("eventId", ParseUUIDPipe) eventId: string, @Body() dto: CorrectAdminTrackingEventDto, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) {
    return this.trackingService.correctAdminEvent(shipmentId, eventId, dto, user.userId, correlationId);
  }
}

@ApiTags("admin shipments")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("admin/shipments/:shipmentId")
export class AdminShipmentHoldController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post("hold")
  @RequirePermission("shipment:hold")
  @RequireIdempotencyKey()
  hold(@Param("shipmentId", ParseUUIDPipe) shipmentId: string, @Body() dto: PlaceShipmentHoldDto, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) {
    return this.trackingService.setOperationalHold(shipmentId, true, dto.reason, user.userId, correlationId);
  }

  @Post("release-hold")
  @RequirePermission("shipment:hold")
  @RequireIdempotencyKey()
  release(@Param("shipmentId", ParseUUIDPipe) shipmentId: string, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) {
    return this.trackingService.setOperationalHold(shipmentId, false, undefined, user.userId, correlationId);
  }
}

import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { TrackingService } from "./tracking.service";

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

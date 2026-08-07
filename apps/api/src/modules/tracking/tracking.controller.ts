import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TrackingService } from "./tracking.service";

@ApiTags("tracking")
@Controller("tracking")
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  /** Public, anonymous lookup (spec section 26.1). Rate limiting/anti-enumeration
   * belongs at the gateway/WAF layer in production - see ADR 0001 section 5.3. */
  @Get(":trackingNumber")
  async getByTrackingNumber(@Param("trackingNumber") trackingNumber: string) {
    return this.trackingService.getByTrackingNumber(trackingNumber);
  }
}

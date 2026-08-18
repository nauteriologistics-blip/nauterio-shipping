import { Module } from "@nestjs/common";
import { AdminShipmentHoldController, AdminTrackingController, TrackingController } from "./tracking.controller";
import { TrackingService } from "./tracking.service";

@Module({
  controllers: [TrackingController, AdminTrackingController, AdminShipmentHoldController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}

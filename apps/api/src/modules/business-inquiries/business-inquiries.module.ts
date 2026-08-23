import { Module } from "@nestjs/common";
import { BusinessInquiriesController, AdminBusinessInquiriesController } from "./business-inquiries.controller";
import { BusinessInquiriesService } from "./business-inquiries.service";

@Module({
  controllers: [BusinessInquiriesController, AdminBusinessInquiriesController],
  providers: [BusinessInquiriesService],
  exports: [BusinessInquiriesService],
})
export class BusinessInquiriesModule {}

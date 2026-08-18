import { Module } from "@nestjs/common";
import { BillingController, StripeWebhookController } from "./billing.controller";
import { BillingService } from "./billing.service";
import { AuditModule } from "../audit/audit.module";
import { BookingsModule } from "../bookings/bookings.module";

@Module({
  imports: [AuditModule, BookingsModule],
  controllers: [BillingController, StripeWebhookController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}

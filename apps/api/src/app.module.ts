import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { IdempotencyInterceptor } from "./common/interceptors/idempotency.interceptor";
import { AuditModule } from "./modules/audit/audit.module";
import { IdentityModule } from "./modules/identity/identity.module";
import { OrganisationsModule } from "./modules/organisations/organisations.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { ShipmentsModule } from "./modules/shipments/shipments.module";
import { TrackingModule } from "./modules/tracking/tracking.module";
import { PickupDeliveryModule } from "./modules/pickup-delivery/pickup-delivery.module";
import { WarehouseModule } from "./modules/warehouse/warehouse.module";
import { CustomsModule } from "./modules/customs/customs.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { BillingModule } from "./modules/billing/billing.module";
import { ClaimsReturnsModule } from "./modules/claims-returns/claims-returns.module";
import { SupportModule } from "./modules/support/support.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ContentModule } from "./modules/content/content.module";
import { ReportingModule } from "./modules/reporting/reporting.module";
import { IntegrationsModule } from "./modules/integrations/integrations.module";

/**
 * Module registration mirrors the 19 functional modules from spec section
 * 24 / ADR 0001 section 3.2. AuditModule is @Global (see its file) so it
 * does not need re-importing by every other module.
 */
@Module({
  imports: [
    // Global default: generous enough for normal authenticated use; public
    // endpoints override it with a tighter per-route limit (spec section 31:
    // "tracking enumeration" is the named threat this exists for). Tracked
    // by caller IP - see ADR 0001 section 5.3 for the production WAF layer
    // this complements rather than replaces.
    ThrottlerModule.forRoot([{ name: "default", ttl: 60_000, limit: 120 }]),
    AuditModule,
    IdentityModule,
    OrganisationsModule,
    CustomersModule,
    QuotesModule,
    BookingsModule,
    ShipmentsModule,
    TrackingModule,
    PickupDeliveryModule,
    WarehouseModule,
    CustomsModule,
    DocumentsModule,
    BillingModule,
    ClaimsReturnsModule,
    SupportModule,
    NotificationsModule,
    ContentModule,
    ReportingModule,
    IntegrationsModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

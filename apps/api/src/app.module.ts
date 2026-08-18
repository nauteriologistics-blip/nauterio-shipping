import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import { loadApiConfig } from "@nauterio/configuration";
import { createHash } from "node:crypto";
import { IdempotencyInterceptor } from "./common/interceptors/idempotency.interceptor";
import { HealthModule } from "./modules/health/health.module";
import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";
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
import { SupportConversationsModule } from "./modules/support/support-conversations.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ContentModule } from "./modules/content/content.module";
import { ReportingModule } from "./modules/reporting/reporting.module";
import { IntegrationsModule } from "./modules/integrations/integrations.module";
import { PilotModule } from "./modules/pilot/pilot.module";

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
    //
    // SEC-008/REL-004: the default in-memory ThrottlerStorageService is a
    // per-process Map - on N ECS tasks behind the ALB, each task counts
    // independently, so the effective limit is `limit x N` and drifts with
    // autoscaling (the exact opposite of what a rate limit should do as a
    // fleet scales up). REDIS_URL is optional (falls back to the in-memory
    // default, correct for a single local-dev process) but MUST be set in
    // any multi-instance deployment. `forRootAsync` (not a top-level
    // `loadApiConfig()` call) so a missing/invalid env var throws during
    // Nest's own bootstrap phase - which main.ts's `bootstrap().catch(...)`
    // already wraps - rather than as an unhandled exception at module-import
    // time, before that handler exists.
    //
    // SEC-008/REL-004 residual: keys authenticated requests on their bearer
    // token rather than IP, so one noisy anonymous caller (or many distinct
    // authenticated users sharing one NAT/corporate-proxy IP) cannot exhaust
    // each other's budget. `ThrottlerGuard` runs as a global guard *before*
    // route-level `AuthGuard`, so `req.user` is never populated here - this
    // deliberately does NOT replicate AuthGuard's full identity check (no DB
    // lookup, no Cognito signature verification, no added latency or new
    // failure mode on the hot path of every request). It only needs a
    // stable, unforgeable-enough-for-fairness bucketing key: a SHA-256 of
    // the raw bearer token. A forged or expired token still gets its own
    // consistent bucket, separate from the anonymous IP bucket - it is
    // AuthGuard/PermissionGuard, not this tracker, that actually decides
    // whether the request is allowed to proceed at all.
    ThrottlerModule.forRootAsync({
      useFactory: () => {
        const config = loadApiConfig();
        return {
          throttlers: [{ name: "default", ttl: 60_000, limit: 120 }],
          storage: config.REDIS_URL
            ? new ThrottlerStorageRedisService(config.REDIS_URL, {
                // A Redis outage must fail fast, not queue every request
                // behind an unbounded reconnect-and-retry loop (which
                // otherwise hangs each request until ioredis gives up, and
                // logs an "Unhandled error event" per failed attempt -
                // observed directly while testing this against an
                // unreachable Redis). SEC-008's own recommended fix is
                // "fail-closed for public endpoints" when the store is
                // unavailable - a fast, clean failure is what makes that
                // an intentional choice rather than an unbounded hang.
                connectTimeout: 2000,
                maxRetriesPerRequest: 1,
                enableOfflineQueue: false,
              })
            : undefined,
          getTracker: (req: { headers?: Record<string, string | string[] | undefined>; ip?: string }) => {
            const authHeader = req.headers?.authorization;
            const value = Array.isArray(authHeader) ? authHeader[0] : authHeader;
            if (value?.startsWith("Bearer ")) {
              const token = value.slice("Bearer ".length);
              return `token:${createHash("sha256").update(token).digest("hex")}`;
            }
            return req.ip ?? "unknown";
          },
        };
      },
    }),
    HealthModule,
    AuditModule,
    AuthModule,
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
    SupportConversationsModule,
    NotificationsModule,
    ContentModule,
    ReportingModule,
    IntegrationsModule,
    PilotModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

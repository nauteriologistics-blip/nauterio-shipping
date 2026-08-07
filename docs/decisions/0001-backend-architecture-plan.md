# ADR 0001: Backend architecture plan

- **Status:** Proposed — planning only, no implementation yet
- **Date:** 2026-08-06
- **Approver:** Pending (Product Owner / technical lead sign-off required before build starts)
- **Related:** `CLAUDE.md`, `docs/nauterio-complete-specification.md` §20–39, Appendices C–J, `.claude/skills/nauterio-*`

## 1. Context

### 1.1 Where the project actually is today

The repository currently contains a single Next.js 16 App Router application (`src/app`) with:

- 8 marketing/portal-style pages rendering client-side, some with local mock arrays instead of real data
- 2 Next.js Route Handlers acting as API routes (`/api/v1/quote`, `/api/v1/tracking/[id]`) with hardcoded logic and in-memory mock records
- A single `prisma/schema.prisma` with 4 models (`User`, `Shipment`, `ShipmentEvent`, `Quote`) that is not migrated against any real database and not read by any of the app code
- No authentication, no organisations/roles, no queues, no file storage, no external provider integrations, no infrastructure-as-code, no CI/CD, no observability
- Money stored as `Float` (violates the spec's integer-minor-units rule), string IDs instead of UUIDv7, no audit trail, no outbox table

This is a frontend prototype with placeholder data, not a backend. That is expected at this stage — Phase 3 ("Platform foundation") in the delivery roadmap (spec §37) has not started, and Phase 0 ("Company readiness": legal entity, carrier/broker/payment accounts, approved route/service scope) has not completed either, per the spec's own gating.

### 1.2 What the specification already decided

The specification (§20–39) is prescriptive, not exploratory, on the backend. It already fixes:

- **Stack:** TypeScript everywhere; Node.js 24 LTS; NestJS 11 for the API; PostgreSQL 18 on RDS; Prisma ORM 7; pnpm monorepo; AWS CDK v2; Docker on ECS Fargate; SQS; ElastiCache Serverless (Valkey); S3+KMS; Cognito; Stripe primary/PayPal secondary; Google Maps; SES+Twilio; Zendesk; GitHub Actions; OpenTelemetry+CloudWatch/CloudTrail.
- **Architecture style:** modular monolith with event-driven workers, explicitly *not* microservices at launch.
- **Repository shape:** `apps/{web,admin,api,worker}` + `packages/{database,contracts,ui,validation,integrations,configuration,observability,testing}` + `infra/cdk` + `docs/{adr,operations}`.
- **19 functional modules** with an explicit ownership rule (a module owns its state; other modules only see published events, never each other's tables).
- **39-entity core data catalogue**, required shipment/tracking-event field groups, and hard database rules (UUIDv7 IDs, integer-minor-unit money, append-only audit/outbox, optimistic version fields).
- **API conventions:** `/v1` REST, Cognito/OAuth tokens, cursor pagination, mandatory `Idempotency-Key` on mutating financial/booking calls, correlation IDs, structured errors.
- **Security baseline:** OWASP ASVS Level 2, specific threat list, Secrets Manager, WAF, independent pen test before public launch.
- **SLOs:** 99.9% monthly availability, p95 tracking latency < 1.5s, RPO 15 min / RTO 4 hours, launch capacity ~1,000 shipments/month scaling to 20,000+.

This plan does not re-litigate those choices — they are already approved requirements, not options. What follows is *how* to get from today's prototype to that target, filling in the engineering decisions the spec leaves to implementation (exact module boundaries, migration path, connection-pooling strategy, specific queue/worker split, etc.), grounded in current (as of August 2026) documentation for each piece of the stack rather than assumptions.

### 1.3 What changed since the spec was written (verified via web research, not assumed)

A few stack specifics evolved in ways the plan needs to account for explicitly:

- **Prisma ORM 7 removed the bundled Rust query engine's built-in database drivers.** You must now explicitly install and wire a JavaScript driver adapter (`@prisma/adapter-pg` for `node-postgres`) into `PrismaClient`. This is a real code-shape change, not cosmetic: driver adapters inherit the underlying driver's connection-pool defaults, and `node-postgres` has **no connection timeout by default**, unlike Prisma 6's built-in 5-second default. Pooling must be configured explicitly (see §4.3).
- **PostgreSQL 18** shipped a native `uuidv7()` function and a new asynchronous I/O subsystem (up to ~3x faster storage reads on supported workloads), plus multicolumn B-tree "skip scan," temporal (range) `PRIMARY KEY`/`UNIQUE`/`FOREIGN KEY` constraints, and `OLD`/`NEW` references in `RETURNING` clauses. The spec already mandates UUIDv7 IDs — PG18's native function means we generate them in the database rather than needing an application-side UUIDv7 library, which is simpler and removes a class of clock-skew bugs. Temporal constraints are directly useful for rate-card/contract effective-date ranges (§4.2).
- **NestJS modular-monolith guidance in 2026 consistently favours feature-based module folders over layered (`controllers/`, `services/`, `models/` at the root) structure**, with explicit `exports` arrays as the enforced module boundary, and warns specifically against one Nest module per database entity (it produces circular-dependency hell). This directly informs §3.
- **AWS's own 2026 guidance for containerised workloads on RDS Postgres recommends RDS Proxy (or equivalent connection pooling) in front of the database** precisely because container tasks open/close connections more often than traditional long-lived servers — this compounds with the Prisma 7 driver-adapter pooling change above.
- **AWS CDK v2 added "mixins"** as a composition primitive in early 2026, useful for attaching cross-cutting concerns (standard tagging, logging, alarms) to every construct without inheritance gymnastics — worth adopting in `infra/cdk` from day one rather than retrofitting.

## 2. Decision

Adopt the specification's target architecture (§20 of the spec) as the backend build target, and restructure the repository into the pnpm monorepo shape now, *before* any further feature backend work — not incrementally bolted onto the current single Next.js app. Reasons:

1. The current app already has business logic (quote pricing formula, tracking event shapes) living directly in Next.js Route Handlers. Every week that continues makes the eventual extraction into `packages/contracts` and a real NestJS API more expensive, not less.
2. The spec's module-ownership rule (§24.1) and the transactional-outbox requirement (§29.1) are foundational — they change how *every* subsequent feature is written (event publish vs. direct write). Retrofitting them after 20 features exist is materially harder than starting with them.
3. None of Phase 0's business prerequisites (legal entity, carrier contracts, payment accounts) block starting Phase 3 (platform foundation) — AWS accounts, the monorepo, CI/CD, and the identity/database skeleton can be built against sandbox/test provider credentials.

This is a **plan**, not an implementation authorization. Actual migration work should proceed only after this ADR is reviewed and the open questions in §11 are answered.

## 3. Repository and module design

### 3.1 Monorepo layout (adopting spec §23.1 exactly, with rationale added)

```
apps/
  web/            Next.js 16 App Router — public site + customer/business portal
  admin/          Separate Next.js 16 App Router — staff administration only
  api/            NestJS 11 — REST API, webhooks, auth guard, permission evaluation
  worker/         NestJS 11 (standalone application context, no HTTP) — SQS consumers, scheduled jobs
packages/
  database/       Prisma schema, migrations, generated client, repository helpers
  contracts/      Shared DTOs, Zod/class-validator schemas, enums, event payload types
  ui/             Design tokens + component library shared between web and admin
  validation/     Cross-cutting business validation (volumetric weight, money, address shape)
  integrations/   One subpackage per external provider adapter (carrier, payment, maps, messaging, support, accounting)
  configuration/  Typed environment config loader (fails fast on missing/invalid env vars)
  observability/  OpenTelemetry setup, logger factory, correlation-ID middleware
  testing/        Shared fixtures, factories, provider sandbox recordings
infra/
  cdk/            AWS CDK v2 app: one stack per concern (network, data, compute, edge, security, observability)
docs/
  adr/            This file and future decisions
  operations/     Runbooks (already scaffolded under docs/runbooks)
```

**Why separate `admin` from `web` as two Next.js apps** (not one app with route groups): the spec requires "security and deployment separation from public/customer interfaces" (§20). Two apps means two ECS services, two scaling policies, two attack surfaces that can be independently WAF-restricted (admin can be IP-allowlisted or VPN-gated; public web cannot), and a deployment of one never risks the other.

**Why `worker` is a separate NestJS application, not cron inside `api`:** the spec explicitly rules out "an unmanaged cron server" (§22.5) and requires queue consumers to scale independently of API request traffic (§22.5, §29.2). A shared `packages/contracts` and `packages/database` means `api` and `worker` never duplicate the definition of what a `ShipmentStatusChanged` event looks like.

### 3.2 NestJS module boundaries inside `apps/api`

Map the spec's 19 functional modules (§24) to NestJS modules 1:1, feature-based (not layered):

| Domain module | Owns (tables) | Publishes events | Never does |
|---|---|---|---|
| `IdentityModule` | User, session metadata | `UserVerified`, `UserSuspended` | Touch organisation roles directly |
| `OrganisationsModule` | Organisation, OrganisationMember | `OrganisationApproved`, `MemberRoleChanged` | Compute credit limits without FinanceModule input |
| `CustomersModule` | Customer profile, Address, Contact | `AddressConfirmed` | Own shipment records |
| `QuotesModule` | RateCard, RateRule, Quote, QuoteLine | `QuoteAccepted` | Write directly to Shipment |
| `BookingsModule` | Booking/Draft | `BookingConfirmed` | Skip QuotesModule's snapshot |
| `ShipmentsModule` | Shipment, Package, ShipmentItem | `ShipmentCreated`, `ShipmentActivated` | Accept a `PaymentConfirmed` event without checking its own activation rules |
| `TrackingModule` | TrackingEvent, ExternalTrackingEvent | `TrackingEventRecorded` | Invent canonical statuses outside Appendix C's catalogue |
| `PickupDeliveryModule` | Pickup, Delivery, assignment | `DeliveryAttempted` | Assign drivers outside their scope |
| `WarehouseModule` | Warehouse, StorageLocation, PackageMovement, Manifest | `PackageReceived`, `ManifestDispatched` | Change shipment financials |
| `CustomsModule` | CustomsCase | `CustomsActionRequired` | Approve refunds |
| `DocumentsModule` | Document, DocumentVersion | `DocumentApproved`, `DocumentRejected` | Serve public S3 URLs |
| `BillingModule` | Charge, Invoice, InvoiceLine, Payment, PaymentEvent, Allocation, Refund | `PaymentConfirmed`, `InvoiceIssued` | Trust a webhook without signature verification |
| `ClaimsReturnsModule` | Claim, ClaimEvidence, ClaimDecision, Return | `ClaimDecided` | Issue payment directly (asks BillingModule) |
| `SupportModule` | SupportLink | — (consumes Zendesk webhooks) | Store full conversation content |
| `NotificationsModule` | Notification, DeliveryAttempt, template config | — (consumer of most other events) | Decide business eligibility itself |
| `ContentModule` | ContentPage, PolicyVersion | `PolicyPublished` | Bypass approval workflow |
| `ReportingModule` | Read-only projections, export jobs | — | Run inside a request-serving transaction |
| `AuditModule` | AuditEvent | — | Allow UPDATE/DELETE from app roles |
| `IntegrationsModule` | ApiClient, ApiKey, WebhookEndpoint | `WebhookDeliveryFailed` | Hold business logic (adapters only) |

A cross-cutting `PermissionModule` (not a business domain, a shared library) implements the §27.3 evaluation chain (identity → account status → global role → org membership → warehouse/assignment scope → record relationship → requested operation → approval limit → separation-of-duties) as a single injectable guard used by every controller — this is deliberately *not* duplicated per module, because permission logic drifting between modules is exactly how authorization bugs happen.

### 3.3 Inter-module communication rule

In-process calls between modules are allowed only through each module's exported **application service interface** (e.g., `ShipmentsModule` exposes `ShipmentQueryService`, not its Prisma repository). Anything that should be eventually consistent (does not need to block the current request) goes through the transactional outbox instead of a direct in-process call — this is what makes the later extraction path to real microservices (if ever needed) tractable, per spec §20.1's stated rationale for choosing a modular monolith in the first place.

## 4. Database design

### 4.1 Migration path from the current schema

The existing `prisma/schema.prisma` (`User`, `Shipment`, `ShipmentEvent`, `Quote`) is a rough sketch, not a foundation to extend column-by-column. Recommended approach:

1. Move `prisma/` to `packages/database/prisma/` as part of the monorepo restructure.
2. Rewrite the schema from the spec's §25.1 entity catalogue (39 entities) as the source of truth, not from the current 4 models. Where current field names are usable (e.g., `originCity`, `trackingNumber`) keep them for continuity in the frontend contracts; where current fields conflict with mandatory rules (`Float` money, non-UUIDv7 `String @default(uuid())` IDs), fix them at the same time rather than migrating bad patterns forward.
3. Treat the current mock API routes (`/api/v1/quote`, `/api/v1/tracking/[id]`) as **throwaway prototypes once `apps/api` exists** — their job was to prove the frontend interaction pattern, which they did; they should not become the real endpoints with a database bolted on.

### 4.2 Concrete schema decisions the spec leaves open

- **Primary keys:** UUIDv7 via PostgreSQL 18's native `uuidv7()` as the column default, not application-generated. UUIDv7 is time-ordered, which keeps B-tree index locality good for high-insert tables like `TrackingEvent` and `AuditEvent` — this is *why* the spec mandates it, and PG18 makes it a one-line default instead of an application library dependency.
- **Money:** every monetary column is `(amountMinorUnits BIGINT, currency CHAR(3))`, never `NUMERIC`/`FLOAT` directly, per §23.2 and §25.4's check-constraint requirement (`amountMinorUnits >= 0`). A shared `packages/contracts` `Money` type wraps this everywhere so the frontend never does its own arithmetic on raw numbers — `chargeableWeight × rate` calculations happen once, server-side, in `QuotesModule`.
- **Measurements:** `(value DOUBLE PRECISION, unit TEXT)` pairs (kg/cm are the launch units; storing the unit avoids a silent future US/metric bug) plus a normalised comparison column where volumetric-weight math needs to run in SQL for reporting.
- **Effective-dated records** (RateCard/RateRule, contract terms, PolicyVersion): use PostgreSQL 18's temporal `PRIMARY KEY`/range constraints so the database itself rejects overlapping effective-date ranges for the same route/service/customer-class combination, instead of relying only on application-level checks.
- **Append-only tables** (`AuditEvent`, `OutboxEvent`, `InboxEvent`, `TrackingEvent` corrections): enforced with a Postgres `REVOKE UPDATE, DELETE` on the application role plus a `BEFORE UPDATE/DELETE` trigger that raises, not just "we won't call UPDATE from the ORM." Corrections are new rows with `correctionOfId`, never edits.
- **Optimistic concurrency:** an integer `version` column bumped via `WHERE version = $expected` on every mutation to a record with concurrent-edit risk (Shipment, Package, CustomsCase, OrganisationMember approval limits) — Prisma 7 supports this pattern natively via its update-where clauses.

### 4.3 Prisma 7 connection strategy (this is where the "search deep" research changes the plan)

Because Prisma 7 uses the `@prisma/adapter-pg` driver adapter over `node-postgres`, and because `node-postgres` has no default connection timeout, and because ECS Fargate tasks scale horizontally (meaning N containers × M connections each can exhaust RDS's connection limit fast):

- Put **RDS Proxy** in front of the PostgreSQL instance for all `apps/api` and `apps/worker` traffic. This is the AWS-recommended pattern specifically for containerised/serverless workloads that open and close connections more often than a monolithic long-lived server would.
- Configure the `node-postgres` pool explicitly (max connections per task, idle timeout, statement timeout) rather than relying on adapter defaults — the research is explicit that v6-era assumptions about a 5-second default timeout no longer hold.
- Reporting/export queries (large scans, §24 `ReportingModule`) should use a separate, smaller connection pool (or a read replica once volume justifies one) so a slow report never starves transactional API requests.

### 4.4 Migration discipline

Follow the spec's expand-and-contract rule (§36.2) exactly: add new nullable columns/tables → deploy code that writes both old and new shape → backfill → deploy code that reads only new shape → drop old columns in a later release. No manual production schema edits outside a documented emergency procedure. Every migration PR states its rollback.

## 5. API design

### 5.1 Conventions (spec §26.1, made concrete)

- Base path `https://api.<company>.com/v1/`, versioned in the URL path (not header) so old integrations keep working unmodified during a `/v2` transition.
- NestJS's built-in `ValidationPipe` + `class-validator`/`class-transformer` DTOs generate the OpenAPI spec directly from the same DTOs used for runtime validation — one source of truth, not a hand-maintained OpenAPI file that drifts from the code.
- `Idempotency-Key` header required and enforced (stored with a short TTL, request hash compared, same response replayed) on: quote acceptance, booking confirmation, payment intent creation, refund creation, claim submission.
- Cursor pagination (`?after=<opaque-cursor>&limit=`) for every list endpoint that can grow unbounded (shipments, tracking events, invoices, documents) — offset pagination is explicitly wrong here because shipment lists mutate constantly and offset pages skip/duplicate rows under concurrent writes.
- Structured error body: `{ code, message, fieldErrors?, correlationId, retryable }`. `message` is written for the API consumer (developer), never shown raw to end users — the frontend maps `code` to localized copy.

### 5.2 Endpoint groups → NestJS controllers

Directly follows spec §26.1's table: `IdentityController` (`/me`), `RatesController`/`QuotesController`, `ShipmentsController`, `PackagesController`, `TrackingController` (public + authenticated variants, separate rate limits), `PickupsController`/`DeliveriesController`, `DocumentsController`, `PaymentsController`/`InvoicesController`, `ClaimsController`/`ReturnsController`, `BusinessController` (org-scoped: users, bulk import, API clients, webhooks), `AdminController` family (role-guarded), and a `ProvidersController` family that exists *only* for inbound signed webhooks (Stripe, Twilio, carriers) — deliberately isolated from the authenticated-user API surface so a provider webhook bug can never accidentally reuse a user-facing guard incorrectly.

### 5.3 Public tracking specifically

Public tracking (`GET /v1/tracking/{number}`, no auth) needs its own stricter rate limiter and anti-enumeration design (the current mock endpoint has neither): tracking numbers should not be sequential/guessable (UUIDv7 satisfies this if used as the public identifier, or a separate opaque public code if the internal ID must stay hidden), and repeated misses from one IP/session should back off. This directly maps to the spec's listed threat "tracking enumeration" (§31).

### 5.4 Webhook delivery to business customers (outbound)

Implement as a `worker` queue consumer (`webhooks-outbound`, §29.1's table), not synchronously inside the API request that created the event: HMAC-sign with a rotating secret, exponential backoff retry, surface delivery attempts/final failure in the business portal, support authorized replay. Consumers dedupe by event ID — Nauterio's job is to make delivery *at-least-once* and clearly identified, not to guarantee exactly-once on the receiving end.

## 6. Authentication and authorisation

### 6.1 Identity architecture

Amazon Cognito User Pools as the identity provider, PostgreSQL as the authorization system of record (spec §21.2's source-of-truth table is explicit about this split — Cognito never becomes the place roles/permissions live).

- **Customers:** email/password + optional passkey (WebAuthn) sign-in. Current Cognito guidance (verified) supports setting `FactorConfiguration` so passkey sign-in with user verification satisfies MFA on its own — worth using for a smoother customer experience than forcing OTP on top of a passkey.
- **Staff:** mandatory MFA or passkey, no exceptions, short session lifetime, step-up (re-authentication) required for refunds, role changes, exports, identity-document access, and integration-credential changes, per §27.2.
- **Token validation in NestJS:** a Cognito JWT guard validates the token (issuer, audience, signature via Cognito's JWKS endpoint, expiry) and attaches the verified `sub` to the request; a second, separate guard/interceptor then loads the Nauterio-side user/role/organisation/warehouse context from PostgreSQL — these are two distinct steps and must not be conflated (a valid Cognito token proves *who*, not *what they're allowed to do*).
- **M2M/business API clients:** OAuth2 client-credentials tokens or scoped API keys, issued through `IntegrationsModule`, distinct credential lifecycle from human users.

### 6.2 Authorization

Implement the §27.3 evaluation chain as a single reusable NestJS guard + a `PolicyService` that every controller action calls before touching data — never a hidden-button-only check. Each protected route declares required permission(s) via decorator metadata; the guard resolves actual scope (warehouse assignment, organisation membership, record ownership, approval limit) at request time against the database, not against a JWT claim that could go stale.

### 6.3 Audit

Every write from `AdminController`, every login failure, every price override, every payment/refund/claim decision, every sensitive document access, every role change, every export, and every retention action writes an `AuditEvent` row in the *same* transaction as the business change (not fire-and-forget afterward) — actor, action, entity, before/after (or safe diff), correlation ID, IP/device where relevant, reason, approval reference. `AuditModule` exposes only append + authorized read, never update/delete, enforced at the database grant level as noted in §4.2.

## 7. Asynchronous work: outbox, queues, workers

### 7.1 Transactional outbox

Confirmed as the correct, current pattern for this shape of system (AWS's own prescriptive guidance and multiple 2026 implementation writeups agree): the API commits the business row and an `OutboxEvent` row in one PostgreSQL transaction. A separate outbox-relay process (a lightweight scheduled `worker` task, not a Lambda, to keep infrastructure uniform with the rest of the platform) polls unpublished rows and pushes them to SQS, marking them delivered. This is the mechanism that makes "payment confirmed → shipment activated → notification sent" reliable even if any single step's process crashes mid-flight.

### 7.2 Queue-to-responsibility mapping (from spec §29.1, unchanged — it's already correct)

`carrier-events`, `notifications-email`, `notifications-sms`, `notifications-whatsapp`, `documents-scan`, `documents-generate`, `imports`, `reports`, `webhooks-outbound`, `reconciliation`, `retention` — each an SQS queue with its own dead-letter queue, each consumed by a dedicated handler in `apps/worker`, each idempotent (processed message IDs recorded in an `InboxEvent` table keyed by provider/queue + message ID).

### 7.3 Worker deployment

`apps/worker` runs as its own ECS Fargate service, scaled on SQS queue depth (not CPU) as the primary signal, with visibility timeout set above realistic processing time and extended explicitly for long-running jobs (large report generation, bulk import commit). Scheduled jobs (retention sweeps, reconciliation polling) run as EventBridge-triggered ECS tasks, not an unmanaged cron process, per §22.5.

### 7.4 Cache

ElastiCache Serverless for Valkey used strictly for rate-limit counters, short-lived workflow state, and distributed locks — never as a system of record. Payment status, shipment status, and permission decisions are always re-confirmed against PostgreSQL before any high-risk action, exactly as §29.3 requires; the cache exists to reduce load and add resilience, not to become a second source of truth that can drift.

## 8. Files, labels, and documents

Implement the §28.1 flow exactly as specified — it is already a complete, correct secure-upload design:

1. Client requests an upload intent (type, size, related record) from `DocumentsModule`.
2. API checks permission and allowed type/count, issues a short-lived pre-signed S3 PUT into a **private quarantine bucket** (never the same bucket as approved documents).
3. Client uploads directly to S3 (never proxied through the API — keeps large files off the NestJS request path).
4. `documents-scan` worker validates real file signature (not just the claimed content-type), size, and runs malware scanning; safe files are moved/promoted to the protected bucket, unsafe files are quarantined and never made retrievable.
5. `DocumentsModule` tracks state as `Processing` / `Approved` / `Rejected` / `Replacement Required`.
6. Downloads always go through a fresh permission check that mints a short-lived signed URL — there is no such thing as a public document URL in this system.

Generated documents (labels, invoices, receipts, proofs) render server-side in `documents-generate`, are versioned by template, and store the generator/hash/locale/source-data snapshot alongside the file, per §28.3 — this makes "what exactly did we send this customer on this date" answerable years later, which matters given the 10-year retention target on financial and shipment records.

Labels follow the §28.2 spec (4×6in thermal, ZPL + PDF fallback, Code 128 + QR, limited receiver info only in the QR, reprint audit trail) without modification — it is already a complete spec.

## 9. External integrations

### 9.1 Adapter contract (spec §30.1, this is the right pattern — implement as written)

Every external provider (carriers, sea-freight partner, customs broker, Stripe, PayPal, Google Maps, Twilio, SES, Zendesk, accounting/e-invoicing) sits behind a **typed, provider-neutral interface** in `packages/integrations/<provider>`. Core domain modules call the interface, never an SDK directly — this is what lets a carrier be swapped, a payment provider added, or a sandbox/production account toggled without touching `ShipmentsModule` or `BillingModule` business logic. Each adapter owns its own timeout/retry/circuit-breaker policy, maps provider errors into retryable/customer-action/staff-action/permanent categories, and is contract-tested against recorded fixtures (never only live production).

### 9.2 Sequencing recommendation

Not every integration needs to exist for the platform to be useful internally. Build order that unblocks the most work fastest: Cognito (blocks everything auth-gated) → Stripe (blocks any real booking flow) → SES (blocks any customer communication) → Google Maps (blocks address validation in booking) → carrier adapter(s) once a real carrier contract exists → Twilio/WhatsApp → Zendesk → accounting/e-invoicing (last, since it depends on an accountant-selected provider per §30). This mostly mirrors the spec's own phase order (§37) but is worth stating explicitly since integration work is usually where schedules slip.

## 10. Infrastructure, security, observability, testing, CI/CD

These four are specified thoroughly and correctly in §22, §31, §34, §35, §36 — the plan here is *confirmation and sequencing*, not redesign, plus the specific 2026 implementation details the research surfaced:

- **AWS organisation:** separate management/security/shared-services/non-prod/prod accounts from day one (retrofitting account separation later is painful and risky). Root MFA hardware/passkey, no long-lived personal keys, GuardDuty+Security Hub+Config aggregated centrally.
- **Network:** ≥3 AZ VPC in Milan (`eu-south-1`), private subnets for ECS/RDS/ElastiCache, VPC endpoints for S3/SQS/ECR/CloudWatch to minimise public egress, RDS Proxy as covered in §4.3.
- **CDK:** one stack per concern (network, data, compute, edge, security, observability), using CDK v2's 2026 "mixins" feature for shared cross-cutting constructs (tagging, standard alarms) instead of inheritance-based construct hierarchies.
- **Observability:** OpenTelemetry auto-instrumentation in both `api` and `worker`, exported via an OpenTelemetry Collector sidecar per ECS task (the confirmed current pattern for Fargate) into CloudWatch/X-Ray or an OTLP-compatible backend; every log line carries environment, service, correlation ID, and safe identifiers only — never secrets/PII, enforced by a shared `packages/observability` logger, not left to each call site's discipline.
- **Security baseline:** OWASP ASVS Level 2 as the working standard from the first line of `apps/api` code, not a pre-launch audit checklist bolted on afterward. Independent penetration test required before public launch and at least annually after (§31).
- **Testing:** the layered pyramid in §35 (unit → integration → API → component → E2E → contract → security → accessibility → performance → recovery → UAT) maps cleanly onto the monorepo: unit/integration tests live beside each `packages/*` and `apps/*` module; contract tests live in `packages/testing` against recorded provider fixtures; Playwright E2E lives at the repo root driving `apps/web`/`apps/admin` against a seeded test environment.
- **CI/CD:** GitHub Actions per §36.1 — lint/type/test/build/scan on every PR, container build+scan+push to ECR on merge, staging deploy runs migrations + smoke/E2E before any production approval gate, production deploy requires named human approval with automatic alarm-triggered rollback.

## 11. Open questions this plan cannot resolve (require business input, not engineering judgement)

Per `CLAUDE.md`'s standing rule, none of these should be invented — they block real (not sandbox) integration work, not the platform-foundation work described above:

1. Which carrier(s) will actually be contracted first (determines which `packages/integrations/carrier-*` adapter gets built first, and its real API shape).
2. Confirmed AWS account/billing owner and whether the company or the build team initially holds root access.
3. Final retention periods for shipment/invoice/payment/customs records (currently "proposed" pending Italian legal/accountant confirmation, per Appendix G) — this affects the retention worker's configuration, not its existence.
4. Selected accounting/e-invoicing provider (Italian requirement, needs accountant selection per §30).
5. Whether Stripe, PayPal, Twilio, SES sender identity, Zendesk, and Google Maps sandbox/developer accounts already exist or need creating before Phase 3 can start integration work in earnest (production platform work — auth skeleton, database, CI/CD, observability — does not need these; contract-testing against sandboxes does).

## 12. Consequences

**Positive:** clean module boundaries from the start avoid the much more expensive retrofit; the outbox pattern prevents an entire class of "payment succeeded but shipment never activated" production incidents; separating `admin` from `web` limits blast radius of any single app's vulnerability; Prisma 7 + PG18's native `uuidv7()` removes an application dependency while satisfying the spec's ID requirement for free.

**Costs / risks:** the monorepo restructure is real, non-trivial work before any new customer-visible feature ships — this is a deliberate trade against the alternative (bolt more logic onto the current single Next.js app and pay a larger cost later). RDS Proxy and the Prisma 7 driver-adapter pooling reconfiguration are new operational surface area that needs monitoring from week one, not an afterthought once connection exhaustion happens in production.

**Rollback:** this ADR describes a target architecture, not a production change — there is nothing to roll back yet. If adopted, the actual monorepo restructure should land as its own reviewed change with the current working prototype preserved on a branch until the new `apps/web` is confirmed at parity.

## Sources consulted for the August 2026 stack-specific details in this plan

- [Prisma ORM 7 upgrade guide](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7) and [`@prisma/adapter-pg`](https://www.npmjs.com/package/@prisma/adapter-pg)
- [PostgreSQL 18 release announcement](https://www.postgresql.org/about/news/postgresql-18-released-3142/) and [PostgreSQL 18 release notes](https://www.postgresql.org/docs/18/release-18.html)
- [AWS Prescriptive Guidance: transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- [AWS CDK v2 best practices](https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html) and [AWS CDK community update, Jan/Feb 2026](https://dev.to/aws/aws-cdk-community-update-janfeb-2026-51jb)
- [Amazon Cognito authentication flows](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow-methods.html) and [Cognito security best practices, 2026](https://tocconsulting.fr/best-practices/cognito-security)
- [Managed Postgres examined: Amazon RDS for PostgreSQL](https://thebuild.com/blog/2026/04/28/managed-postgres-examined-amazon-rds-for-postgresql) (RDS Proxy / connection-pooling guidance for containerised workloads)
- [Production-ready OpenTelemetry tracing in NestJS, 2026](https://oneuptime.com/blog/post/2026-02-06-production-ready-opentelemetry-tracing-nestjs/view)
- NestJS modular-monolith structure guidance (feature-based modules, explicit exports, avoiding per-entity modules): [Encore, NestJS project structure 2026](https://encore.dev/articles/nestjs-project-structure-best-practices); [Capital Compute, NestJS modular architecture](https://www.capitalcompute.com/building-a-modular-and-maintainable-backend-with-nestjs-a-practical-guide/)

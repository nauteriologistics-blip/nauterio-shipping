# Nauterio Logistics — Master Supervisor Assessment Script

## Purpose

Use this script to conduct a complete, evidence-based assessment of the Nauterio Logistics platform. The assessment must cover every repository component, every launch-critical business rule, every user role, every state transition, every external integration, and every production control. It is not a design opinion exercise. It is a release-gate audit.

The assessor must determine:

1. What the specification requires.
2. What the repository claims to implement.
3. What the code actually implements.
4. What automated tests prove.
5. What a running environment demonstrably does.
6. What remains mocked, incomplete, unsafe, undocumented, or unverified.
7. Whether Nauterio can safely accept a real shipment and real payment.

## Role and operating standard

Act as a principal product engineer, staff backend engineer, security reviewer, QA lead, database reviewer, SRE, payments reviewer, accessibility auditor, and logistics-operations supervisor.

Be adversarial but fair. Never infer completion from filenames, comments, UI text, successful compilation, or an endpoint merely existing. Trace each claim through UI, API, authorization, business logic, database persistence, asynchronous processing, provider integration, customer-visible results, audit history, and failure recovery.

Do not modify production data, deploy, push, rotate credentials, charge a real card, send messages to real customers, or perform destructive operations without explicit permission. Use test accounts, test provider modes, isolated databases, and reversible fixtures.

## Non-negotiable audit rules

- Read repository instructions and the complete product specification before judging implementation.
- Preserve all existing user changes and record the starting Git commit and worktree state.
- Never expose credentials, tokens, customer PII, identity documents, webhook secrets, or database connection strings in logs or the final report.
- Every finding must cite evidence: file and line, command output, API response, database assertion, screenshot, provider event, or test result.
- Distinguish `implemented`, `partially implemented`, `mocked`, `configured but unverified`, `missing`, and `not applicable`.
- A passing happy path cannot compensate for missing authorization, idempotency, validation, failure recovery, or auditability.
- Do not mark a feature complete when only its frontend or backend exists.
- Do not mark a payment complete from a browser redirect. Only a verified provider webhook may confirm payment.
- Do not mark tracking complete if a tracking number can be issued before verified payment.
- Do not mark deployment complete merely because a provider dashboard shows “deployed.” Verify health and behavior externally.
- Treat unexplained test skips, ignored failures, permissive fallbacks, development authentication, and mock adapters in production as release blockers.

## Required deliverables

Produce all of the following:

1. Executive launch recommendation: `GO`, `CONDITIONAL GO`, or `NO-GO`.
2. Scorecard by domain with evidence and confidence.
3. Complete requirements traceability matrix.
4. Complete endpoint and page inventory.
5. Role/permission matrix with positive and negative tests.
6. State-transition matrix for bookings, invoices, payments, shipments, documents, notifications, and support.
7. Data-model and migration assessment.
8. Security threat assessment.
9. End-to-end acceptance evidence.
10. Deployment and operations readiness report.
11. Findings register with severity, reproduction, impact, cause, and remediation.
12. Missing/unverified/external-dependency register.
13. Prioritized remediation plan with owners and acceptance criteria.
14. Final residual-risk statement.

## Severity and disposition

Classify every finding:

- `P0 Critical`: active data exposure, authentication bypass, incorrect real charges, secret exposure, destructive corruption, or complete outage.
- `P1 High`: launch-blocking workflow failure, privilege escalation, payment/tracking integrity failure, unrecoverable operations, or major compliance failure.
- `P2 Medium`: important feature defect, weak recovery, accessibility failure, misleading customer behavior, or significant maintainability risk.
- `P3 Low`: minor defect, inconsistent copy, small usability issue, or documentation gap.
- `Observation`: improvement that is not currently a defect.

For every item record: unique ID, severity, domain, requirement, environment, preconditions, exact steps, expected result, actual result, evidence, affected roles/data, customer/business impact, probable root cause, recommended correction, acceptance test, owner, and status.

## Phase A — Establish scope and ground truth

1. Record repository path, branch, HEAD, remotes, status, untracked files, runtime versions, package manager version, operating system, and assessment timestamp.
2. Read `README.md`, repository guidance, specification index, complete product specification, architectural decisions, implementation phases, runbooks, environment examples, deployment manifests, CI workflows, and the spoken-workflow reconciliation document.
3. Build a requirements catalogue. Assign a stable requirement ID to every explicit `must`, `shall`, required workflow, role ability, state, integration, security control, operational procedure, acceptance criterion, and non-functional target.
4. Identify contradictions between the original specification, later decisions, spoken requirements, code comments, and deployed behavior. Apply the latest expressly approved product decision; document every interpretation.
5. Inventory the monorepo:
   - `apps/web`: public website, authentication, customer portal, booking, invoices, tracking, documents, notifications, support, warehouse/driver surfaces if exposed.
   - `apps/admin`: staff authentication, dashboard, requests, shipments, tracking updates, holds, documents, customers, support, pilot control.
   - `apps/api`: controllers, DTOs, guards, services, interceptors, filters, modules, webhooks, health endpoints.
   - `apps/worker`: outbox relay, email jobs, cleanup, retries, dead-letter behavior.
   - `packages/contracts`: roles, permissions, services, statuses, transitions, public contracts.
   - `packages/database`: Prisma schema, constraints, indexes, migrations, seed data, connection behavior.
   - `packages/integrations`: Stripe, email, storage, malware scanning, provider fallbacks.
   - `packages/configuration`, `validation`, `observability`, `testing`, and `ui`.
   - infrastructure, CI/CD, scripts, docs, runbooks, and provider manifests.
6. Locate dead routes, orphan models, duplicate implementations, TODO/FIXME/HACK markers, hard-coded prices, test credentials, local-only assumptions, empty handlers, broad type casts, swallowed errors, and commented-out controls.

## Phase B — Reproducible installation and static quality

Run from a clean clone or clean isolated copy using the declared Node and pnpm versions:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm db:generate
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm release:check
pnpm security:check
```

Record command, timestamp, duration, exit code, warnings, skipped tests, flaky retries, and full failure evidence. Confirm lockfile integrity and ensure builds do not depend on undeclared global modules or files outside the repository.

Inspect:

- TypeScript strictness, unsafe `any`/`never` casts, disabled compiler checks, ignored lint rules, and unreachable code.
- Dependency vulnerabilities, abandoned packages, incompatible runtime requirements, duplicate versions, and production/dev dependency mistakes.
- Test distribution: unit, integration, contract, migration, API, UI, end-to-end, security, load, and recovery.
- Coverage of business invariants rather than line-count alone.
- Deterministic tests, isolated fixtures, cleanup, clock control, and provider mocks.
- Build artifacts, source maps, secret leakage, bundle size, and server/client boundary violations.

No static-quality section passes if lint, typecheck, test, build, schema validation, or migration validation fails.

## Phase C — Architecture and boundary assessment

Trace at least one representative request through browser → Next.js route/proxy → NestJS guard/controller/service → Prisma transaction → PostgreSQL → outbox → worker → external provider → customer-visible result.

Verify:

- Clear separation between customer web, admin, API, worker, contracts, data, and integrations.
- Business rules live on trusted server boundaries, not only in client components.
- Shared enums/contracts agree with Prisma enums and API behavior.
- Every external side effect uses an adapter and has explicit production configuration.
- No circular dependencies, hidden runtime coupling, or provider-specific behavior leaking into core logic.
- Transactions cover all state that must change atomically.
- Async work uses an outbox or equally durable boundary; no dual-write loss window.
- Correlation IDs propagate through API, audit, outbox, worker, and provider calls.
- Errors use stable, non-sensitive structures and correct HTTP status codes.
- Pagination is bounded and deterministic.
- Idempotency semantics are documented and enforced on mutation endpoints.

## Phase D — Authoritative commercial workflow

Treat this sequence as a launch invariant:

`quote → booking draft → submitted request → staff review → issued invoice → customer payment → verified webhook → paid booking → exactly-one shipment/tracking number → operational tracking updates → delivery`

Test each step independently and as one continuous journey.

### Quote

- Validate Italy-to-US route assumptions and every supported service.
- Test weight, dimensions, volumetric divisor, chargeable weight, declared value, currency, customs, insurance, minimums, rounding, and expiry.
- Confirm insurance is exactly the configured percentage of declared value and appears as a transparent line item.
- Test zero, negative, missing, fractional, extreme, malformed, and boundary values.
- Confirm quote persistence and response return the same quote ID and monetary values.
- Confirm expired, altered, or mismatched quotes cannot be submitted.
- Confirm prices shown in web and booking wizard come from the quote—not hard-coded display values.
- Verify quote immutability after acceptance and historical reproducibility.

### Booking and request review

- Test draft create, resume, update, ownership, step persistence, validation, submission, duplicate submission, expiry, rejection, and resubmission policy.
- Confirm another customer cannot read or mutate the booking.
- Confirm staff can view the complete information needed for a defensible decision.
- Confirm approval creates an issued invoice and moves the request to awaiting payment.
- Confirm approval does **not** create a shipment or tracking number.
- Confirm concurrent/double approval produces one decision and one invoice.
- Confirm rejection requires a useful customer-visible reason and creates no invoice or shipment.

### Invoice

- Verify invoice number uniqueness, customer/organisation scope, quote linkage, booking linkage, lines, totals, currency, issue date, due date, status, and audit record.
- Recalculate invoice totals from lines and compare exact minor units.
- Confirm customer sees only owned invoices and staff access matches permission policy.
- Confirm a paid, void, or refunded invoice cannot start an inappropriate new checkout.
- Verify duplicate payment-click behavior does not create unsafe duplicate charges.

### Stripe payment

- Use Stripe test mode only.
- Verify Checkout Session amount, currency, metadata, success URL, cancel URL, idempotency behavior, and provider session ID persistence.
- Test successful payment, declined card, abandoned checkout, cancelled checkout, delayed webhook, duplicate webhook, out-of-order event, malformed body, missing signature, invalid signature, stale signature, unknown session, wrong amount, wrong currency, and provider timeout.
- Confirm the raw request body is used for signature verification.
- Confirm webhook replay is persisted and handled idempotently.
- Confirm browser redirection alone never marks an invoice paid.
- Confirm exact allocation: payment amount = allocation amount = invoice total, with exact currency agreement.
- Simulate failure after payment commit but before shipment creation; verify a webhook retry resumes fulfilment.

### Post-payment fulfilment

- Confirm only a verified paid invoice can move booking to paid.
- Confirm exactly one shipment is created under concurrency and retry.
- Confirm tracking number uniqueness, adequate entropy, correct format, and database enforcement.
- Confirm shipment total/currency equal the paid invoice rather than zero or recalculation.
- Confirm sender, receiver, package, service, weight, dimensions, declared value, quote, booking, invoice lines, and ownership are copied correctly.
- Confirm initial public event is package received.
- Confirm outbox and audit entries exist.
- Confirm the customer can immediately see the shipment/tracking number after fulfilment.

## Phase E — Tracking and logistics operations

- Test public tracking with valid, invalid, mixed-case, whitespace, malformed, and brute-force patterns.
- Confirm public lookup reveals no customer PII, internal notes, hidden events, documents, or database IDs beyond intended identifiers.
- Verify rate limiting across multiple application instances via Upstash/Redis.
- Confirm events sort deterministically and corrections supersede—not delete—history.
- Test every permitted canonical tracking status and every prohibited transition.
- Verify event time validation, location, English/Italian titles, descriptions, evidence requirements, reasons, actor, source, visibility, and notifications.
- Confirm delivered/cancelled/archived terminal behavior.
- Confirm no GPS/map claim exists if the business offers manual milestone tracking only.
- Verify the customer UI presents a clear chronological progress history on mobile and desktop.

### Operational hold

- Place a hold with a required reason; verify actor, timestamp, explicit hold state, lifecycle state, public event, customer reason, audit, and notification.
- Confirm movement updates are blocked while held.
- Release the hold; verify cleared hold metadata, resumed state, public event, audit, and notification.
- Test concurrent hold/release, repeated requests, stale versions, and attempts against delivered/cancelled/archived shipments.

## Phase F — Authentication, sessions, and authorization

Assess development and production modes separately.

- Registration, email verification, login, logout, expired session, revoked session, disabled user, duplicate email, password policy, enumeration resistance, and rate limiting.
- Production Cognito issuer, audience/client, region, signature, expiry, token type, and key rotation verification.
- Secure cookie flags: HttpOnly, Secure, SameSite, path, lifetime, and rotation.
- CSRF protection on every cookie-authenticated mutation, including support, payments, documents, tracking, and holds.
- No bearer token in browser-readable storage, URL, logs, analytics, or rendered HTML.
- Local authentication must fail closed or be impossible to enable in production.
- Test every role: customer, organisation member/admin, super admin, operations, warehouse, support, finance, customs, driver, auditor.
- For every permission, test allowed action and denied action.
- Test horizontal access: customer A versus customer B, organisation A versus B, shipment owner versus non-owner.
- Test vertical access: customer versus staff; support versus finance; driver versus operations; auditor read-only behavior.
- Confirm guards do not rely on client-supplied organisation IDs or roles.
- Verify sensitive actions are audited and separation-of-duties rules are preserved.

## Phase G — Customer application assessment

Inventory and exercise every route, navigation item, form, empty state, loading state, validation state, error state, retry, success state, and mobile layout.

Assess:

- Marketing accuracy: no unsupported capability, price, transit guarantee, certification, integration, or launch claim.
- Registration/sign-in/session expiry/sign-out.
- Quote calculation and explanation.
- Booking wizard persistence, prepopulation, keyboard behavior, validation, and recovery.
- Request status and rejection reason.
- Invoice details, amount formatting, payment initiation, cancelled checkout, and returned success state.
- Shipment dashboard and tracking link.
- Public tracking progress.
- Document upload/review/replacement workflow.
- Notifications and unread state.
- Direct support creation, conversation list, reply, polling/refresh, status, closed behavior, and accessibility.
- English/Italian coverage with no untranslated keys or mixed-language critical content.
- Responsive behavior at representative mobile, tablet, laptop, and wide-screen viewports.
- Browser compatibility and graceful degradation.

## Phase H — Admin application assessment

- Staff login and session handling.
- Dashboard numbers must be sourced, correctly scoped, and reconcile with database queries.
- Request queue filtering, detail completeness, approve-and-invoice, rejection, concurrency, and copy accuracy.
- Shipment list/detail, customer/route/package/payment information, and permission scoping.
- Manual tracking event creation, evidence, corrections, validation, and audit.
- Hold/release visibility and controls.
- Document review, approved evidence, rejection/replacement, and malware state.
- Customer records and PII masking/access auditing.
- Support inbox, customer identity, shipment context, assignment, reply, status transitions, resolution, reopening policy, and closed behavior.
- Pilot controls, allowlist behavior, operational reports, and kill switches.
- Finance-only and read-only restrictions.
- Every destructive or irreversible action must require appropriate confirmation and permission.

## Phase I — API assessment

Create an endpoint inventory from controllers and compare it with OpenAPI output. For every route record method, path, authentication, permission, ownership constraint, DTO validation, idempotency, rate limit, transaction behavior, response schema, error schema, pagination, audit event, outbox event, and tests.

For every endpoint test:

- Valid request.
- Missing authentication.
- Wrong role.
- Wrong owner/organisation.
- Missing/invalid fields.
- Unknown fields and mass-assignment attempts.
- Malformed UUID, cursor, date, enum, number, and JSON.
- Duplicate/idempotent request.
- Concurrency conflict.
- Not-found behavior without existence leakage.
- Dependency timeout/failure.
- Sensitive data in response or error.

Verify global validation uses safe transformation and whitelisting, security headers, CORS allowlists, body-size limits, structured errors, correlation IDs, graceful shutdown, health/readiness distinction, and production API-doc policy.

## Phase J — Database, migrations, and data integrity

- Validate and regenerate Prisma client from the checked-in schema.
- Apply every migration in order to a fresh empty PostgreSQL database.
- Upgrade a representative pre-change database and confirm existing records survive.
- Test migration rollback/recovery procedure or explicitly document forward-fix policy.
- Compare Prisma schema with actual database columns, enums, foreign keys, unique constraints, checks, indexes, defaults, nullability, and cascading behavior.
- Confirm money uses integer minor units/decimal-safe representation and consistent currency.
- Confirm timestamps are UTC and lifecycle timestamps are coherent.
- Confirm required uniqueness: tracking number, invoice number, provider event, provider payment/session, booking invoice, quote linkage where appropriate.
- Verify indexes support hot filters: tracking lookup, ownership lists, request queue, invoice list, outbox polling, notification unread, support ordering.
- Test deletion/retention behavior for users, shipments, invoices, payments, audit events, documents, and support messages.
- Confirm optimistic locking/version fields are actually enforced on concurrent sensitive updates.
- Verify Neon pooling, TLS, connection limits, migration connection strategy, backups, restore test, and point-in-time recovery expectations.

## Phase K — Worker, queues, notifications, and consistency

- Verify outbox insert is atomic with business mutations.
- Verify relay claims safely under multiple workers and cannot double-process without idempotent consumers.
- Test retry delays, maximum attempts, poison events, dead-letter/failure state, operator visibility, and replay procedure.
- Kill the worker between claim and completion; verify recovery.
- Test Redis unavailable at startup and during processing.
- Verify email rendering, recipient, subject, locale, links, deduplication, provider IDs, delivery failure, and retry.
- Confirm no notification is sent for a rolled-back transaction.
- Confirm notification/email failures do not corrupt the commercial transaction.
- Verify cleanup jobs are bounded, observable, safe under concurrency, and retain required audit evidence.

## Phase L — Documents and storage

- Test allowed extensions, MIME/content mismatch, file size, empty file, executable/polyglot content, duplicate upload, malware-positive result, scanner timeout, and storage failure.
- Verify private object storage, non-guessable keys, short-lived signed URLs, authorization at download time, correct disposition, and no public bucket exposure.
- Verify customer/staff document ownership and role restrictions.
- Verify review states and permitted transitions, evidence linkage, replacement requests, and audit history.
- Ensure identity documents receive stricter permissions and are never logged or exposed to unrelated staff.
- Verify retention/deletion policy and orphan-object cleanup.

## Phase M — Support conversations

- Verify customer can create, list, open, and reply only to owned conversations.
- Verify optional shipment linkage only accepts the customer's shipment.
- Verify staff with `support:manage` can list, assign, reply, resolve, and close; unauthorized staff cannot.
- Confirm author identity/type is server-derived.
- Test message length, whitespace, markup/script injection, rapid sending, closed conversation, concurrent replies, refresh/polling, ordering, and timestamps.
- Verify staff reply changes status to waiting for customer and customer reply to waiting for agent.
- Confirm audit coverage without duplicating message contents into sensitive logs.
- Evaluate spam/rate limiting, retention, escalation/SLA visibility, unread indicators, and notification delivery.

## Phase N — Security and privacy assessment

Threat-model assets, actors, entry points, trust boundaries, abuse cases, and provider compromise. At minimum test:

- OWASP-style injection, broken access control, authentication/session failures, insecure design, misconfiguration, vulnerable dependencies, integrity failures, logging gaps, SSRF, XSS, CSRF, open redirects, path traversal, insecure file upload, clickjacking, CORS errors, host-header abuse, prototype pollution, and denial of service.
- Secret scanning across tracked files, history where authorized, build artifacts, logs, source maps, examples, CI, Render/Vercel settings, and client bundles.
- PII minimization, encryption in transit/at rest, staff access, export, correction, erasure, retention, consent/legal basis documentation, and breach response.
- Webhook signature strength, timing tolerance, constant-time comparison, replay prevention, and payload-size limits.
- Tracking enumeration resistance and response minimization.
- Rate-limit identity/key choice, shared Redis behavior, proxy IP trust, bypass attempts, and fail behavior during Redis outage.
- Audit immutability expectations, actor attribution, correlation, before/after values where appropriate, timestamp, reason, and privileged-access logging.

Do not conduct destructive penetration testing against production. Use an isolated authorized environment.

## Phase O — Accessibility, usability, content, and visual quality

- Keyboard-only completion of every critical journey.
- Logical focus order, visible focus, skip/navigation behavior, modal focus, and focus after errors/navigation.
- Semantic headings, landmarks, labels, descriptions, table structure, button names, and link purpose.
- Screen-reader announcements for validation, loading, payment state, notifications, and tracking changes.
- Contrast, zoom to 200–400%, text reflow, touch target sizes, motion reduction, and color-independent meaning.
- Form autocomplete, input mode, error association, preserved input, prevention of accidental duplicate actions, and plain-language recovery guidance.
- Test common phone widths and slow networks.
- Check typography, spacing, alignment, overflow, truncation, loading shift, broken images, icon consistency, empty states, dates, currencies, time zones, and language switching.
- Verify logistics and payment terminology is accurate and does not promise GPS, guaranteed delivery, paid status, or tracking prematurely.

## Phase P — Performance and resilience

- Establish budgets for customer web, admin, API latency, database queries, worker lag, and provider calls.
- Measure server/client bundle size, Core Web Vitals, image optimization, caching, rendering waterfalls, and slow-network usability.
- Test API response time at baseline and load for quote, tracking, portal dashboard, admin queues, and webhook.
- Inspect N+1 queries, unbounded includes, missing indexes, excessive payloads, and connection-pool exhaustion.
- Run load/smoke scripts with safe limits; report throughput, p50/p95/p99, errors, CPU/memory, database connections, Redis behavior, and worker lag.
- Test provider timeout, Neon interruption, Redis interruption, worker restart, API rolling restart, duplicate delivery, and partial failure.
- Verify timeouts, bounded retries with jitter, circuit-breaking strategy where appropriate, graceful degradation, and operator-visible failures.

## Phase Q — Observability and operations

- Verify structured logs with timestamp, level, service, environment, correlation ID, event, and safe context.
- Confirm secrets, tokens, payment data, passwords, document contents, and unnecessary PII are redacted.
- Verify metrics/alerts for availability, latency, 5xx, auth failures, payment webhook failures, payment/fulfilment mismatch, outbox backlog, worker failures, email failures, database saturation, Redis errors, storage/scanner errors, and elevated tracking misses.
- Verify actionable alert destinations, ownership, severity, deduplication, and runbook links.
- Exercise health, readiness, graceful shutdown, deploy rollback, database recovery, provider incident, stuck payment, stuck booking, stuck outbox, and customer-support escalation runbooks.
- Confirm backups exist and perform a documented restore drill. A configured backup without a restore test is unverified.

## Phase R — Deployment and external services

Verify the actual intended stack rather than assuming AWS-only deployment:

- Vercel: customer and admin projects, correct roots/build commands, environment separation, protected previews, domains, redirects, headers, logs, and rollback.
- Render: API and worker services, Docker contexts, health check, pre-deploy migration, region, scaling, shutdown delay, secrets, internal networking, logs, rollback, and worker singleton/concurrency expectations.
- Neon: production/test separation, TLS, pooling, migration URL, roles/least privilege, connection limits, backups, restore, and monitoring.
- Upstash/Redis: TLS URL, eviction policy, persistence expectations, key prefix/environment isolation, rate-limit and queue behavior, and outage handling.
- Stripe: test/live separation, least-privilege keys, webhook endpoint and secret, event selection, replay behavior, dashboards, refunds/disputes ownership, and reconciliation.
- Email provider: verified sending domain, SPF/DKIM/DMARC, from/reply-to, suppression/bounce handling, test recipients, and delivery monitoring.
- Object storage/malware scanner if enabled: credentials, CORS, private access, lifecycle, scanning, and incident behavior.
- Cognito if production authentication uses it: pool/client configuration, callback/logout URLs, claims, MFA policy, email delivery, and account recovery.
- GitHub: repository access, branch protection, required checks, secret scanning, dependency updates, least-privilege Actions permissions, environments/approvals, and release traceability.

Compare every required environment variable in code with `.env.example`, CI, Render, Vercel, and runbooks. Report missing, unused, duplicated, weakly validated, or client-exposed variables.

## Phase S — CI/CD and supply chain

- Confirm pull requests must pass install, generate, lint, typecheck, tests, build, schema/migration, security, and release checks.
- Confirm production deployment cannot occur from a failing or unreviewed commit.
- Inspect pinned action versions, permissions, untrusted fork behavior, cache poisoning risk, artifact provenance, dependency install integrity, and secret exposure.
- Verify migrations run once and before incompatible application code serves traffic.
- Test failed migration and failed deploy rollback behavior.
- Confirm deployed commit SHA is observable and matches the approved release.

## Phase T — Full end-to-end acceptance scenarios

Execute and preserve evidence for at least these scenarios:

1. New customer registers, verifies, signs in, obtains quote, submits complete request, admin approves, invoice appears, Stripe test payment succeeds, webhook confirms, one shipment/tracking number appears, staff posts movements, customer sees progress, shipment is delivered.
2. Customer cancels Checkout; invoice remains unpaid and no tracking exists.
3. Invalid webhook/redirect cannot mark payment or create shipment.
4. Duplicate successful webhook produces no duplicate invoice, shipment, tracking event, notification, or charge record.
5. Admin rejects request; customer sees reason and no invoice/tracking exists.
6. Quote expires or booking details change; submission/approval fails safely and requires requoting.
7. Operations places shipment on hold, customer sees reason, movement is blocked, operations releases hold, movement resumes.
8. Customer opens support conversation; support replies; customer replies; staff resolves; unauthorized customer/staff cannot access it.
9. Customer uploads document; malware scan and staff review complete; rejected document requests replacement; unauthorized access fails.
10. Sessions expire/revoke correctly without losing server-side integrity.
11. Worker/provider outage creates recoverable backlog with alerting; restart completes without duplication.
12. Database restore or recovery drill proves documented recovery targets.

For each scenario capture actor, environment, fixture IDs, timestamps, browser/device, requests/responses with secrets removed, database state before/after, provider event, audit/outbox records, screenshots, expected result, actual result, and pass/fail.

## Phase U — Requirements traceability matrix

Create one row per requirement:

| Requirement ID | Source | Requirement | Component | Implementation evidence | Test evidence | Runtime evidence | Status | Severity if unmet | Notes |
|---|---|---|---|---|---|---|---|---|---|

Allowed statuses: `PASS`, `PARTIAL`, `FAIL`, `MOCKED`, `UNVERIFIED`, `NOT APPLICABLE`.

Every source requirement must appear exactly once or explicitly cross-reference a parent requirement. Every page, endpoint, model, integration, scheduled job, and runbook must map to at least one requirement or be classified as unnecessary/dead scope.

## Phase V — Scoring

Score each domain from 0–5:

- `0`: absent or dangerously incorrect.
- `1`: placeholder/mock with major gaps.
- `2`: partial implementation; critical paths fail.
- `3`: functional happy path; important negative/recovery evidence missing.
- `4`: complete and tested with minor non-blocking issues.
- `5`: production-proven with positive, negative, security, recovery, and operational evidence.

Weight domains:

| Domain | Weight |
|---|---:|
| Commercial workflow and payments | 15% |
| Authentication and authorization | 12% |
| Shipment/tracking operations | 10% |
| Data integrity and migrations | 10% |
| Security and privacy | 12% |
| Customer application | 8% |
| Admin application | 7% |
| API and worker correctness | 8% |
| Integrations and deployment | 6% |
| Reliability/observability/recovery | 7% |
| Testing/CI/supply chain | 3% |
| Accessibility/localization/usability | 2% |

Automatic `NO-GO` regardless of score:

- Tracking can be created before verified payment.
- Payment can be confirmed from redirect/client input or without valid webhook verification.
- Duplicate payment events can create duplicate shipments/tracking.
- Cross-customer or unauthorized staff data access exists.
- Production uses local authentication or a mock payment provider.
- Secrets or real sensitive data are exposed.
- Migrations cannot be safely applied to the target database.
- Core build/typecheck/test fails.
- No verified backup/rollback path exists for production launch.
- Critical end-to-end scenario fails.
- Any unresolved P0 or launch-impacting P1 remains.

## Phase W — Final report format

Write the report in this exact order:

1. Assessment metadata and scope.
2. Executive summary.
3. Launch recommendation and rationale.
4. Ten most important verified strengths.
5. Ten most serious risks/gaps.
6. Weighted scorecard.
7. Business-flow verdict with an explicit statement on payment-before-tracking.
8. Findings register ordered by severity.
9. Requirements traceability matrix.
10. Page and endpoint inventory.
11. Role/permission test matrix.
12. State-transition matrix.
13. Data/migration report.
14. Security/privacy report.
15. Performance/resilience report.
16. Deployment/integration report.
17. End-to-end evidence summary.
18. Unverified items and why they remain unverified.
19. Remediation roadmap: immediate, pre-launch, post-launch.
20. Residual risks and formal sign-off conditions.

Never say “everything works,” “production-ready,” or “100% complete” unless every launch requirement has runtime evidence, all automatic blockers are cleared, and all external production services have been verified in their correct environment.

## Supervisor opening statement

Begin the assessment with:

> I am conducting a release-gate assessment of Nauterio Logistics. I will compare the approved requirements with the source code, automated checks, database behavior, deployed environments, and real test-mode provider behavior. I will not treat the existence of code or a successful UI demonstration as proof of completeness. Every conclusion will be tied to reproducible evidence, and anything I cannot verify will be reported as unverified rather than assumed to work.

## Supervisor closing questions

Before issuing the verdict, answer all of these plainly:

1. Can a new customer complete the entire journey without developer intervention?
2. Can staff review and operate shipments without database intervention?
3. Is every price derived consistently and preserved historically?
4. Is payment confirmation provider-authoritative, exact, secure, and replay-safe?
5. Is tracking created only after verified payment and exactly once?
6. Can customers see accurate progress, holds, documents, invoices, notifications, and support replies?
7. Can unauthorized users access or alter any other person's records?
8. Can the system recover from duplicate events, worker crashes, provider outages, and deployment failures?
9. Can operators detect and resolve stuck payments, shipments, queues, and notifications?
10. Can the database and customer records be restored after a serious failure?
11. Are all production integrations real, configured, monitored, and tested?
12. Does the deployed version match the reviewed commit?
13. Are there any mocks, placeholders, hard-coded values, or unsupported claims in a production path?
14. Are all P0/P1 findings resolved and retested?
15. What exact evidence justifies the final `GO`, `CONDITIONAL GO`, or `NO-GO` decision?

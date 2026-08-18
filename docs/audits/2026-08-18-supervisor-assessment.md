# Nauterio Supervisor Assessment — 2026-08-18

## Current verdict

**NO-GO for general production today; GO for deployment to a controlled staging/pilot environment.** The repository now installs, validates, builds, migrates, seeds, and runs locally. Customer and staff portal journeys were completed in the browser. The actual Render API was recovered at `https://nauterio-shipping.onrender.com`, its unsafe production auth setting was removed, `/v1/health` is HTTP 200, and all Vercel projects now point to that origin. General launch remains blocked until this pull request is merged, all 27 migrations are applied, the worker and production integrations are configured, and external acceptance tests pass.

## Assessment evidence available

- Clean `pnpm install --frozen-lockfile`: PASS (999 packages).
- Prisma generation and schema push to isolated `nauterio_test_codex`: PASS.
- Seed of services, staff/customer accounts, shipments, and tracking history: PASS.
- `pnpm typecheck`: PASS across 13 workspace projects.
- `pnpm lint`: PASS across web, admin, API, worker, and packages.
- `pnpm test`: PASS (24 validation tests and 21 API tests).
- `pnpm build`: PASS for Next.js web/admin, NestJS API, worker, infrastructure, and packages.
- `scripts/release-check.mjs` (27 migrations) and `scripts/security-check.mjs` (535 tracked files): PASS.
- Local browser: public quote, tracking, customer magic-link sign-in, customer portal, staff magic-link sign-in, role-aware admin dashboard, shipment list, customers, documents, support, and pilot control: PASS.
- GitHub pull-request CI: PASS for lint/typecheck and database-backed tests; Vercel web and both admin previews: PASS.
- Live public/static pages: PASS without console errors.
- Live API health at `https://nauterio-shipping.onrender.com/v1/health`: PASS (HTTP 200).
- Live frontend proxy: PASS connectivity — it reaches Render and returns structured API responses. Quote currently returns HTTP 422 because required service catalogue rows were absent from production; the new idempotent migration repairs this on deployment. An unknown tracking number correctly returns HTTP 404.
- Live admin: FAIL launch-safety check — deployed version still displays the obsolete development-token sign-in UI.
- Stripe test-mode journey: UNVERIFIED; no test credentials or reachable webhook endpoint were available.

## Findings repaired during this assessment

### PAY-001 — Unpaid Checkout completion could create tracking (P1)

The webhook accepted `checkout.session.completed` without inspecting `payment_status`. Delayed-payment sessions can complete before funds are paid. The adapter now extracts payment status, amount and currency; fulfilment occurs only for a paid completed session or `checkout.session.async_payment_succeeded`. Provider amount and currency are checked against the internal payment.

### PAY-002 — Multiple active Checkout Sessions could enable duplicate payment (P1)

Repeated payment initiation could create multiple sessions for one invoice. Pending checkout URL is now persisted and reused, attempts use deterministic attempt keys, concurrent provider results are upserted, and payment allocation has a compound uniqueness constraint. Expired Checkout Sessions mark the attempt failed so a new attempt may begin.

### PAY-003 — Payment mutations did not enforce API idempotency (P1)

Invoice creation and payment initiation now require `Idempotency-Key`.

### PAY-004 — Webhook signature failures surfaced as internal errors (P2)

Invalid signature/payload failures now return a safe bad-request response. Multiple Stripe `v1` signatures are accepted correctly for secret rotation.

### AUTH-001 — Any staff role could list/read invoices (P1)

Invoice list, detail and payment endpoints previously bypassed permission evaluation. They now require `invoice:read`; customer ownership/organisation scoping remains enforced in the service.

### PRICE-001 — Booking could change priced dimensions/value (P1)

Submission checked only service and actual weight. It now compares weight, all dimensions and declared value with the immutable quote input snapshot and requires a new quote after any price-affecting change.

### PRICE-002 — A quote could be reused by multiple bookings/invoices (P1)

`Booking.quoteId` is now unique, the migration creates the unique index, and quote acceptance uses an atomic `DRAFT` claim.

### PRICE-003 — Insurance was not the stated fixed 1.5% (P1 business-rule mismatch)

The hidden €8 minimum was removed. Insurance is now the stated 150 basis points of declared value, rounded in integer minor units.

### FLOW-001 — Request transition contract contradicted implementation (P2)

Approval and invoice issuance are atomic and persist `AWAITING_PAYMENT`; the shared transition contract and workflow test now represent that direct transition. Historical `APPROVED` remains supported for imported/legacy rows.

### OPS-001 — Hold release could erase an unrelated action-required state (P1)

Operational hold can now be placed only from `ACTIVE`. A database check enforces hold reason/timestamp consistency. Movement updates remain blocked while held.

### SUPPORT-001 — Support writes could duplicate on retry (P2)

Conversation creation, replies and staff updates now require idempotency. Customer and admin clients send the key.

### SUPPORT-002 — Invalid status and staff assignment (P2)

Admin status filters are allowlisted, blank-after-trim subjects/messages are rejected, and an assignee must be an active staff user.

### CONTENT-001 — Fabricated customs-duty calculator (P1 customer/legal risk)

The page calculated a made-up flat 5% duty above $800. The calculator was removed and replaced with accurate guidance that classification, origin, value and current US rules determine treatment.

### I18N-001 — English-only insurance line and stale “demo booking” copy (P2)

The insurance line is localized in English/Italian. The quote handoff now says the quote is ready instead of falsely claiming a demo booking was recorded.

### AUTH-002 — Customer sign-in asked for an inaccessible session token (P1)

Email verification stored the session token only in an httpOnly cookie, but the later sign-in page asked customers to paste that raw token. Customers could not sign back in after logout. Customer sign-in is now a rate-limited, enumeration-resistant, single-use 15-minute email magic-link flow delivered through the existing outbox, worker, and Resend adapter.

### AUTH-003 — Staff sign-in depended on unprovisioned Cognito/dev tokens (P1)

The deployed admin exposed a development-token form and source paths. The corrected admin uses the same secure magic-link architecture, generates links only for active staff, and rechecks the staff role before setting the admin cookie.

### AUTH-004 — Legacy seed roles authenticated but had no permissions (P1)

Seeded roles `LOGISTICS_OPERATOR` and `SYSTEM_ADMINISTRATOR` did not exist in the canonical permission matrix. They are normalized to `WAREHOUSE` and `SUPER_ADMIN`; a migration repairs existing rows. Admin navigation is now filtered by the signed-in role and partially authorized dashboard metrics no longer blank the whole dashboard.

### AUTH-005 — Class-level permissions were ignored (P1)

`PermissionGuard` read handler metadata only, so the admin support controller's class-level `support:manage` declaration failed closed on every request. The guard now resolves handler and controller metadata, with handler metadata taking precedence.

### PROD-001 — Frontend API failures surfaced as empty HTTP 500 responses (P1)

Both Next.js API proxies now catch unreachable upstreams and return a structured retryable 503. Quote and tracking distinguish temporary service outages from invalid package data or a genuine missing shipment.

### TRUST-001 — Published legal pages contained fabricated entity and infrastructure facts (P1)

The live terms/privacy pages claimed an unverified Italian entity, VAT/EORI numbers, Milan/Newark addresses, DPO, PEC mailbox, AWS region, transfer framework, rates, liability caps, and jurisdiction while the footer said registration was unfinished. They were replaced with honest pre-launch terms, privacy, and cookie notices that clearly identify which business/legal facts still require approval.

### UX-001 — Broken sample tracking IDs (P2)

Production displayed clickable “sample” IDs while its backend was unavailable, causing every example to report “Shipment not found.” The UI now shows only the tracking-number format and accurately reports backend unavailability.

### CI-001 — Clean CI could not resolve workspace types (P1)

API/worker lint and typecheck depended on generated package `dist` output that did not exist after a clean checkout. CI now builds workspace packages before lint/typecheck. The removed Prisma 7 `db push --skip-generate` option was also corrected.

### PROD-002 — Required service catalogue existed only in development seed data (P1)

The live quote endpoint reached Render but failed with HTTP 422 because `quotes.service_id` references catalogue rows that had never been inserted into production. The three canonical services are now installed and reconciled by an idempotent migration rather than relying on the synthetic development seed.

## Remaining launch blockers

1. Review and merge pull request #1, then verify the production Vercel aliases and Render service are running commit `1c1c7de` or later.
2. Apply all 27 migrations to a fresh staging database, an upgrade copy, and production Neon. The current free Render service does not provide the pre-deploy-command feature, so migration execution needs a controlled one-off job or a paid service using the committed blueprint.
3. Create the Render worker and set Render `WEB_APP_URL=https://nauteriologistics.com`, `ADMIN_APP_URL=https://admin.nauteriologistics.com`, `API_PUBLIC_URL=https://nauterio-shipping.onrender.com`, plus the required Resend, Stripe, object-storage, and malware-scanner secrets. Neon and Upstash are already linked to the API.
4. Configure a business-approved rate card. Current freight rates remain explicitly illustrative.
5. Execute Stripe success, cancellation, invalid-signature, expiry, duplicate, delayed-success, and fulfilment-retry acceptance scenarios.
6. Verify Resend sending-domain authentication and complete registration/customer/staff magic-link delivery tests.
7. Verify object upload, malware callback, quarantine, review, replacement, and download against the production-compatible storage/scanner.
8. Complete customer request → admin approval → invoice → payment → tracking → delivery in staging with real test-mode integrations.
9. Verify backups, restore, monitoring, alerts, rollback, worker retry/dead-letter handling, and pilot stop conditions.
10. Replace the pre-launch legal placeholders with counsel-approved entity, privacy contact, terms, and commercial facts before general launch.

## Launch gate

The platform must remain pre-launch until the reviewed branch is merged, database migrations are applied, the worker is running, and the external-integration acceptance evidence above is complete. The API/frontend network path and source are now release-candidate quality; the remaining NO-GO is production data migration, missing integration credentials/services, approved commercial data, and legal approval.

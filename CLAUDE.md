@AGENTS.md

# Nauterio Logistics project instructions

This repository implements the Nauterio Logistics Italy-to-USA shipping platform.

> **Note (architecture status):** the "Approved architecture" section below is the skill kit's target architecture (pnpm monorepo, NestJS API/worker apps). The repository currently in place is a single Next.js app with API routes under `src/app/api` and Prisma at the project root — no monorepo, no NestJS yet. This has not been reconciled; treat the sections below as the long-term target, not the current state, until an explicit decision is made to restructure.

## Mandatory source of truth

Before planning or changing code:

1. Read `docs/specification-index.md`.
2. Read every split specification section relevant to the task.
3. Use `docs/nauterio-complete-specification.md` when more context is needed.
4. Use the selected logo at `docs/assets/nauterio-logo.png` and the approved design tokens in Section 7.
5. Invoke the relevant project skill under `.claude/skills/`.

Do not invent company registration details, VAT/EORI data, addresses, telephone numbers, rate cards, margins, carrier or customs-broker contracts, insurance limits, legal approval, vendor credentials, production secrets, or real customer data. Mark unresolved items `REQUIRES_BUSINESS_EVIDENCE`.

## Product scope

The complete product includes:

- Public corporate website and anonymous tracking.
- Individual and business customer portals.
- Staff administration dashboard.
- Warehouse and driver PWAs with controlled offline operation.
- REST API and partner webhooks.
- Quotes, bookings, shipments, packages, tracking, pickups, warehouse operations, customs, delivery, payments, invoices, documents, support, claims, returns, notifications, reporting, audit, and integrations.
- English and Italian from launch.

## Approved architecture (target — see note above)

- TypeScript throughout.
- Node.js 24 LTS.
- Next.js 16 App Router for `apps/web` and `apps/admin`.
- NestJS 11 for `apps/api` and `apps/worker`.
- PostgreSQL 18 on RDS and Prisma ORM 7 with PostgreSQL driver adapter.
- pnpm monorepo.
- Modular monolith with event-driven workers, transactional outbox, SQS, idempotent consumers, and provider adapters.
- AWS Milan (`eu-south-1`) primary; Frankfurt (`eu-central-1`) recovery.
- ECS Fargate, RDS, S3/KMS, SQS/DLQ, Cognito, SES, CloudFront, WAF, Route 53, CloudWatch, CloudTrail, GuardDuty, Security Hub, OpenTelemetry, and AWS CDK TypeScript.
- Stripe primary, PayPal secondary, Twilio SMS/WhatsApp, Zendesk, Google Maps/Address Validation, and carrier adapters.

Respect versions pinned in the repository. Before an upgrade, read official version-matched documentation and write an ADR if the change affects architecture or compatibility.

## Brand and interface rules

- Primary navy `#081F3D`; action orange `#F28C18`.
- Professional, restrained, trustworthy logistics design.
- No excessive gradients, glowing effects, glassmorphism, emoji icons, fake reviews, fabricated statistics, or unsupported trust claims.
- One dominant action per section.
- WCAG 2.2 AA, keyboard-complete operation, visible focus, sufficient contrast, error summaries, semantic HTML, and status not communicated by colour alone.
- Implement loading, empty, validation, provider-unavailable, permission-denied, session-expired, success, and archived states where relevant.
- Mobile first. Admin is desktop-first but responsive. Warehouse and driver flows must work on supported mobile devices.

## Engineering rules

- TypeScript strict mode. Do not use unexplained `any`, unsafe casts, or disabled checks.
- Keep controllers and UI components thin; put business invariants in owned modules.
- Validate at every trust boundary and enforce permissions on the server.
- PostgreSQL constraints protect invariants; do not rely only on application checks.
- Tracking, audit, and issued financial history are append-only. Correct with linked adjustment records.
- All externally triggered writes are idempotent.
- No public private-document URLs. Upload to quarantine, verify signature/type, malware scan, then promote.
- Never store full card data or infer payment success only from a browser redirect.
- Never log secrets, tokens, identity documents, full payment data, or unnecessary personal data.
- Use explicit timeouts, bounded retries, jitter, dead-letter queues, replay controls, and circuit-breaking/graceful degradation for providers.
- Use feature flags for incomplete or risky integrations.
- Do not introduce microservices, GraphQL, a second database, or a new cloud provider without measured need and an approved ADR.

## Delivery workflow

For every feature:

1. Find the governing requirements.
2. Produce a traceability entry.
3. Plan the smallest complete vertical slice.
4. Define contracts and validation.
5. Add safe database migration and constraints.
6. Implement domain/API/queues/audit.
7. Implement UI and all states.
8. Add telemetry and documentation.
9. Run unit, integration, E2E, accessibility, and other relevant tests.
10. Report exact evidence and remaining dependencies.

Never claim a test, build, deployment, migration, backup, or integration succeeded unless it was run and the result was observed.

## Safety and production controls

Do not perform any of the following without explicit user approval in the current session:

- Deploy to production or alter DNS.
- Create or destroy production infrastructure.
- Apply a destructive production migration.
- Rotate or reveal production credentials.
- Send real customer messages.
- Charge, refund, or alter real payments.
- Change public legal policies.
- Delete customer or compliance data.

## Required project records

Maintain:

- `docs/implementation/traceability.md`
- `docs/implementation/ledger.md`
- `docs/decisions/` for ADRs
- `docs/runbooks/`
- OpenAPI documentation
- Migration and rollback notes
- Release evidence and known risks

## Skills

Start broad work with `/nauterio-orchestrator`. Use the domain-specific skills automatically or invoke them directly. Use `/nauterio-page-builder <page name>` for a single screen, `/nauterio-feature-builder <feature>` for a vertical slice, `/nauterio-code-review` before merge, and `/nauterio-release-readiness` before a release.

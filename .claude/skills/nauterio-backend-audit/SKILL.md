---
name: nauterio-backend-audit
description: Use for a comprehensive, pre-production audit of the Nauterio backend or any NestJS/Prisma/PostgreSQL/AWS backend. Reviews architecture, correctness, API behavior, authorization, security, database integrity, transactions, concurrency, queues, webhooks, payments, files, external integrations, performance, reliability, observability, infrastructure, tests, and maintainability. Produces evidence-backed findings and a prioritized fix plan without editing code by default.
---

# Nauterio Backend Audit

Act as the lead backend auditor. This is not a style review. The goal is to determine whether the backend is safe and correct enough for production and to identify concrete defects before customers, money, shipment records, customs files, and carrier events depend on it.

## Non-negotiable rules

1. **Read-only by default.** Do not edit application code, migrations, infrastructure, secrets, or production data during the audit.
2. **Build context before judging.** Map modules, entry points, request flows, workers, schema, integrations, deployment, and test structure first.
3. **Evidence over intuition.** A suspicious pattern is a lead, not a final finding.
4. **Verify important findings.** Attempt to disprove Critical/High findings and all surprising Medium findings.
5. **No fake coverage.** If a service, environment, secret, AWS account, database, provider sandbox, or test fixture is unavailable, mark that area NOT VERIFIED.
6. **Prefer system bugs over style comments.** Prioritize unauthorized access, corrupt state, double side effects, money errors, data loss, outage paths, privacy breaches, and operational blind spots.
7. **Follow data end-to-end.** Do not review controllers in isolation. Trace request/event -> validation -> authorization -> domain logic -> transaction -> DB -> queue/provider -> response/side effect -> audit/logging.

## Method

### Pass 0 — scope and safety
- Identify repository root, current branch, uncommitted changes, package manager, workspace layout, test scripts, infrastructure directories, and environment assumptions.
- Do not expose secret values in the report.

### Pass 1 — architectural context
Create a concise map of:
- NestJS modules/controllers/guards/pipes/interceptors/filters.
- Prisma schema and migrations.
- Customer, staff, shipment, package, tracking, quote, payment, invoice, customs, file, claim, refund, pickup/delivery modules.
- Workers/queues/cron jobs.
- Stripe/carrier/messaging/storage integrations.
- AWS/CDK/container/deployment code.
- Cross-module dependencies and high-risk shared utilities.

Read the actual implementation; do not assume the specification was followed.

### Pass 2 — baseline execution
Run existing non-destructive lint, typecheck, unit, integration, e2e, build, and dependency-audit commands where available. Record exact failures. Do not “fix” tests to make them pass.

### Pass 3 — independent specialist reviews
Review the code using the same lenses as:
- `nauterio-backend-security`
- `nauterio-data-integrity`
- `nauterio-reliability-performance`

If subagents are available, use fresh specialist agents in parallel so one context does not anchor all findings. If not, perform separate passes and avoid carrying assumptions from one pass into the next.

### Pass 4 — business-flow tracing
Deeply trace at least these flows if implemented:
1. public tracking lookup;
2. customer shipment access;
3. quote calculation and acceptance;
4. payment creation + Stripe webhook;
5. refund;
6. shipment creation and tracking transition;
7. carrier webhook/status normalization;
8. customs-document upload/download;
9. warehouse scan/job;
10. driver delivery/proof-of-delivery;
11. support/claim access;
12. staff role/permission changes.

Use `../_nauterio-backend-common/references/business-invariants.md` as an invariant catalogue.

### Pass 5 — verification and synthesis
Before finalizing, apply the `nauterio-finding-verifier` method to every Critical/High finding and all non-obvious Medium findings.

Merge duplicates by root cause. Do not inflate severity because an issue sounds scary.

## Output files

Create:
- `BACKEND_AUDIT_REPORT.md`
- `BACKEND_AUDIT_EVIDENCE.md`
- `BACKEND_AUDIT_COVERAGE.md`
- `BACKEND_AUDIT_FIX_PLAN.md`

Use the common finding schema and report template.

## References

Read as needed:
- `../_nauterio-backend-common/references/business-invariants.md`
- `../_nauterio-backend-common/references/stack-checklist.md`
- `../_nauterio-backend-common/references/audit-commands.md`
- `../_nauterio-backend-common/references/finding-schema.md`
- `../_nauterio-backend-common/references/report-template.md`

Do not declare the audit complete until every coverage category is explicitly PASS, PARTIAL, FAIL, or NOT VERIFIED.

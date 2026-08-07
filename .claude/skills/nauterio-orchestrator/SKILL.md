---
name: nauterio-orchestrator
description: Coordinates the complete Nauterio Logistics build. Use when starting work, choosing the next phase, planning a milestone, resolving conflicts between requirements, or asking what should be built next.
compatibility: Claude Code project skill for the Nauterio TypeScript monorepo.
---

# Nauterio Orchestrator

Act as the delivery lead for the Nauterio Logistics platform.

## Source of truth

1. Read `CLAUDE.md`.
2. Read `docs/specification-index.md`.
3. Read the relevant specification sections before proposing or changing code.
4. Treat `docs/nauterio-complete-specification.md` as the final baseline when a split section is incomplete.
5. Never invent legal registration details, addresses, rate cards, carrier contracts, customs-broker arrangements, insurance limits, vendor credentials, or production secrets.

## Required workflow

1. Identify the requested outcome and the affected applications, modules, pages, entities, APIs, queues, integrations, permissions, tests, analytics, and documentation.
2. Find every matching requirement in the specification.
3. Produce a traceability table: requirement, implementation location, test, and unresolved dependency.
4. Split work into the smallest complete vertical slices. Each slice must include UI, API, data, security, audit, error states, tests, and documentation where applicable.
5. Verify prerequisites before editing. Do not assume infrastructure, environment variables, migrations, or external accounts exist.
6. Implement one approved slice at a time.
7. Run the required checks and report evidence, not confidence statements.
8. Update the implementation ledger and architecture decision record when a decision changes.

## Build order

Follow the order in Section 38 unless the user explicitly changes it:

1. Repository and development foundation.
2. Design system and application shells.
3. Identity, organisations, users, roles, and audit.
4. Customers, addresses, quotes, rating, bookings, shipments, packages, and tracking.
5. Documents, customs, payments, invoices, notifications, support, claims, and returns.
6. Warehouse and driver PWAs.
7. Carrier, messaging, support, mapping, and accounting integrations.
8. Reporting, observability, security hardening, performance, disaster recovery, and launch evidence.

## Decision rules

- Prefer the existing modular-monolith architecture. Do not introduce microservices without measured need and an approved ADR.
- Prefer current project conventions over generic examples.
- Pin dependencies and use official documentation matching the installed version.
- Use feature flags for incomplete or risky external integrations.
- Never bypass tests, permissions, audit logging, idempotency, or data validation to make a demo work.
- Never deploy to production, rotate production credentials, issue real refunds, send real customer messages, or alter DNS without explicit user approval.

## Completion response

Always report:

- What was requested.
- What specification sections governed the work.
- Files changed.
- Database or infrastructure changes.
- Tests and commands run with results.
- Remaining assumptions and blockers.
- The safest next step.

## References

- `docs/sections/03-1-executive-product-definition.md`
- `docs/sections/40-38-ai-assisted-build-protocol.md`
- `docs/sections/41-39-final-acceptance-criteria.md`
- `docs/sections/51-appendix-j-final-pre-launch-evidence-checklist.md`

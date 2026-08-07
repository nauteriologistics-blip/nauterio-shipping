---
name: nauterio-testing-quality
description: Plans, writes, and runs Nauterio tests and quality gates. Use for unit, integration, end-to-end, contract, accessibility, performance, security, migration, recovery, and user-acceptance testing.
compatibility: Jest, React Testing Library, Playwright, k6, accessibility tooling, Docker test dependencies.
---

# Nauterio Testing and Quality

## Test pyramid

- Unit tests: domain invariants, calculations, state transitions, permission policy, mapping, validation, and pure components.
- Integration tests: PostgreSQL constraints/transactions, Prisma repositories, queues, file workflows, authentication adapters, and API modules.
- Contract tests: carrier, payment, messaging, support, maps, customs-broker, and accounting adapters.
- End-to-end tests: complete user and staff journeys through real application boundaries.

## Mandatory journeys

Cover at least:

- Public tracking valid, invalid, protected detail, and provider delay.
- Quote, booking, payment, shipment creation, and confirmation.
- Package receipt, measurement correction, dispatch, tracking update, and delivery proof.
- Customs document request and response.
- Failed payment, duplicate webhook, refund approval, and bank-transfer confirmation.
- Delay/missing investigation, claim, return, and support escalation.
- Business bulk import.
- Warehouse and driver offline synchronisation and conflict handling.
- Permission-denied and cross-tenant data isolation.

## Quality gates

Before merge: format, lint, typecheck, unit/integration tests, changed-flow E2E, migration validation, dependency/secret scans, and build.

Before release: full E2E, accessibility, performance/load, security checks, backup restore evidence, operational runbooks, and user acceptance.

## Test data

Use factories and deterministic fixtures. Never use real customer data in development or normal tests. Create representative addresses, package dimensions, currencies, time zones, status histories, and error scenarios.

## Evidence

Produce machine-readable test results plus concise human evidence: commands, pass/fail, screenshots or traces for browser tests, performance thresholds, and known limitations. Never claim tests passed without running them.

## References

- `docs/sections/37-35-testing-and-quality-assurance.md`
- `docs/sections/41-39-final-acceptance-criteria.md`
- `docs/sections/51-appendix-j-final-pre-launch-evidence-checklist.md`

---
name: nauterio-backend-nestjs
description: Implements and reviews Nauterio NestJS API and worker modules. Use for controllers, services, modules, validation, transactions, REST contracts, webhooks, queues, scheduled jobs, and domain orchestration.
compatibility: NestJS 11, Node.js 24 LTS, TypeScript, modular monolith.
---

# Nauterio Backend Engineering

## Module boundaries

Use modules matching the specification: identity, organisations, customers, addresses, quotes, rating, bookings, shipments, packages, tracking, pickups, warehouse, customs, deliveries, billing, payments, documents, claims, returns, notifications, support, carrier adapters, reporting, content, and audit.

- A module owns its invariants and write operations.
- Cross-module work uses explicit application services or domain events.
- Do not access another module's tables directly from random services.
- Keep controllers thin; validate input and delegate use cases.
- Keep provider-specific code behind adapters.

## API conventions

- REST under `/v1`.
- Stable resource names and correct HTTP methods/status codes.
- DTO validation and normalisation at the boundary.
- Consistent error envelope with machine code, safe message, field errors, correlation ID, and documentation link where useful.
- Pagination, filtering, sorting, idempotency, concurrency, and versioning where required.
- OpenAPI generated from code and reviewed as a contract.
- Never expose internal stack traces or raw provider payloads to customers.

## Reliability

- Use database transactions for atomic business changes.
- Use a transactional outbox for events tied to database state.
- Consumers and webhooks must be idempotent.
- Retry only transient errors with bounded exponential backoff and jitter.
- Send exhausted work to dead-letter queues with replay tooling.
- Store source, timestamps, raw external event, normalised status, and processing outcome for carrier updates.

## Security and audit

- Authenticate and authorise on the server.
- Apply least privilege and organisation/warehouse/assignment scope.
- Record high-risk reads and all significant writes.
- Redact secrets and sensitive values from logs.
- Validate file references and signed URLs.

## Testing

Use unit tests for invariants, integration tests with PostgreSQL for persistence and transactions, contract tests for adapters, and end-to-end tests for complete flows.

## References

- `docs/sections/26-24-functional-modules.md`
- `docs/sections/28-26-api-and-webhook-specification.md`
- `docs/sections/31-29-events-queues-caching-and-scheduled-work.md`
- `docs/sections/32-30-external-integrations.md`

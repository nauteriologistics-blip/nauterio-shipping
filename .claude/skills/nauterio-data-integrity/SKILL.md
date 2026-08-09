---
name: nauterio-data-integrity
description: Use to audit Nauterio's backend for database, financial, state-machine, transaction, concurrency, idempotency, queue, webhook, migration, and consistency defects. Deeply reviews Prisma/PostgreSQL schema and queries, shipment/tracking transitions, quote/payment/refund correctness, SQS at-least-once behavior, duplicate/out-of-order events, race conditions, data constraints, and zero-downtime migrations.
---

# Nauterio Data Integrity and Concurrency Audit

Assume concurrency, retries, duplicate messages, provider reordering, partial failures, process crashes, and stale reads will occur in production. Look for bugs that pass happy-path tests but corrupt business state under those conditions.

## Method

1. Read the full Prisma schema and every migration before evaluating service logic.
2. Write down the database-level invariants for each high-value entity.
3. Trace every multi-write business operation and every externally retriable operation.
4. Identify check-then-act/read-modify-write races.
5. Identify all idempotency boundaries and whether the DB enforces them.
6. Model duplicate and out-of-order Stripe/carrier/SQS events.
7. Review migration compatibility with rolling ECS deployments.
8. Use the detailed checklist in `references/integrity-checklist.md`.

## Priority flows
- unique tracking number/package number creation;
- quote acceptance and immutable pricing snapshot;
- payment/invoice/shipment activation;
- refund and claim settlement;
- shipment status event append/correction;
- carrier event normalization;
- pickup/delivery scans;
- customs document state;
- queue-produced notifications and provider calls.

## Finding standard

A race-condition finding must describe two or more concrete interleavings and the resulting invalid state. A missing-constraint finding must identify the invariant the database currently cannot guarantee. An idempotency finding must name the repeated input and duplicated side effect.

Do not recommend SERIALIZABLE or distributed locks reflexively. Choose the smallest mechanism that enforces the actual invariant: unique constraint, conditional update, optimistic version, row lock, idempotency table, transactional outbox, transaction isolation, or state-machine condition.

## References
- `references/integrity-checklist.md`
- `../_nauterio-backend-common/references/business-invariants.md`
- `../_nauterio-backend-common/references/finding-schema.md`

---
name: nauterio-database-prisma
description: Designs and changes the Nauterio PostgreSQL and Prisma data model. Use for schemas, migrations, constraints, indexes, transactions, retention, audit records, query plans, and data imports.
compatibility: PostgreSQL 18 and Prisma ORM 7 with the PostgreSQL driver adapter.
---

# Nauterio Data Engineering

## Principles

- PostgreSQL is the transactional source of truth.
- Use UUIDv7-style internal identifiers where supported by the project; public tracking numbers are separate non-sequential identifiers.
- Model organisations, users, roles, addresses, quotes, shipments, packages, tracking events, payments, invoices, documents, claims, returns, notifications, support references, and audit events explicitly.
- Use database constraints for uniqueness, required relationships, allowed values, and impossible states.
- Do not rely only on application validation.

## Migrations

1. Read the current schema and migration history.
2. Explain forward and backward compatibility.
3. Separate destructive changes into expand/migrate/contract steps.
4. Backfill in controlled batches.
5. Never reset a shared or production database to resolve migration problems.
6. Test migrations against production-like data volume.
7. Provide rollback or restoration instructions.

## Queries and indexes

- Add indexes based on named access patterns: public tracking lookup, shipment lists, status/date filters, customer and organisation searches, carrier event deduplication, queue polling, audit retrieval, and retention jobs.
- Prefer composite and partial indexes where they match real predicates.
- Inspect query plans for high-volume or user-facing queries.
- Prevent N+1 patterns and unbounded list queries.

## History and retention

- Tracking and audit records are append-only; corrections create new records.
- Financial records are immutable after issuance except through approved adjustment records.
- Support legal holds and retention state.
- Deletion jobs must be auditable and idempotent.
- Sensitive identity documents have shorter retention than shipment and accounting records.

## Prisma rules

- Use Prisma 7 with the PostgreSQL driver adapter.
- Generate the client in a shared package.
- Use transactions intentionally; do not hide long network calls inside database transactions.
- Use reviewed parameterised SQL for queries that Prisma cannot express efficiently.

## References

- `docs/sections/27-25-database-and-data-model.md`
- `docs/sections/34-32-privacy-and-retention-engineering.md`
- `docs/sections/48-appendix-g-retention-schedule.md`

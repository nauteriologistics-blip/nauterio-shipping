# 35. Testing and quality assurance

| **Test layer**  | **Coverage**                                                                                                                |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------|
| Unit            | Domain rules, calculations, status transitions, permission predicates and formatters.                                       |
| Integration     | PostgreSQL repositories/transactions, S3 upload flow, SQS consumer, Cognito token validation and provider adapter contract. |
| API             | Validation, authentication, authorisation, idempotency, pagination, errors and concurrency.                                 |
| Component       | Forms, tables, timeline, status cards, upload, scanner and offline indicators.                                              |
| End-to-end      | Quote-to-booking, payment, warehouse receipt, tracking, customs action, delivery, claim and business import.                |
| Contract        | Carrier/payment/messaging/support/accounting sandbox and recorded fixtures.                                                 |
| Security        | ASVS controls, dependency/container scans, SAST/DAST, permission tests, upload abuse and independent penetration test.      |
| Accessibility   | Automated axe plus keyboard, screen reader, zoom, contrast, errors and mobile manual tests.                                 |
| Performance     | Public tracking, quote, list/search, imports, reports, queues and provider outage/load scenarios.                           |
| Recovery        | Backup restoration, failed deployment rollback, queue replay and regional recovery rehearsal.                               |
| User acceptance | Operations, warehouse, driver, finance, customs, support, business user and customer pilot scripts.                         |

## 35.1 Release quality gates

- Formatting/lint/type checks pass; required unit/integration/end-to-end tests pass.

- No unresolved critical/high security vulnerability without written risk acceptance by authorised management.

- Database migration rehearsed on staging backup and backward-compatible with deployment sequence.

- Accessibility regression checks pass and known manual issues are documented/approved.

- Performance baseline not materially degraded.

- Product Owner and relevant business owner approve user acceptance evidence.

- Rollback and monitoring plan exist for production change.

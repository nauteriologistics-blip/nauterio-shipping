# 29. Events, queues, caching and scheduled work

## 29.1 Transactional outbox pattern

When a business transaction and an asynchronous event must occur together, the API writes the domain change and an outbox record in the same PostgreSQL transaction. A publisher sends the outbox event to SQS and marks delivery. This prevents payment, tracking or notification work from being lost between database commit and queue publication.

| **Queue/job**          | **Responsibility**                                                      |
|------------------------|-------------------------------------------------------------------------|
| carrier-events         | Normalise and map carrier/provider shipment events.                     |
| notifications-email    | Render and send transactional email.                                    |
| notifications-sms      | Send SMS and process delivery callbacks.                                |
| notifications-whatsapp | Send approved WhatsApp templates/messages.                              |
| documents-scan         | Validate and malware-scan new uploads.                                  |
| documents-generate     | Generate labels, invoices, receipts and proofs.                         |
| imports                | Validate and commit business bulk imports.                              |
| reports                | Generate large exports and scheduled reports.                           |
| webhooks-outbound      | Deliver signed events to business/partner endpoints.                    |
| reconciliation         | Poll/reconcile transitional provider states when callbacks are missing. |
| retention              | Archive/anonymise/delete according to policy and legal holds.           |

## 29.2 Queue rules

- Every message has event/job ID, type/version, correlation ID, created time and safe object references.

- Consumers are idempotent and record processed inbox keys.

- Retry only transient failures; validation/business failures go to controlled review rather than endless retry.

- Dead-letter queues alarm immediately when important jobs arrive.

- Large payloads/files remain in S3/database; queue carries references, not sensitive large objects.

- Visibility timeout exceeds normal processing and is extended for controlled long jobs.

## 29.3 Cache rules

- Cache public content, service configuration and safe tracking query fragments only when invalidation is understood.

- Use Valkey for rate-limit counters, one-time workflow state, short locks and selected short-lived results.

- Payments, shipment status and permissions are always confirmed against authoritative storage before high-risk action.

- Cache keys include environment and tenant/scope; personal data has short TTL and is minimised.

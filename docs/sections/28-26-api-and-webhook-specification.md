# 26. API and webhook specification

## 26.1 API conventions

- Base URL https://api.\<company\>.com/v1/. JSON over HTTPS only.

- OpenAPI-generated reference; examples in English; error messages localised in UI rather than exposing internal stack details.

- OAuth 2.0/Cognito tokens for user APIs; scoped API keys or OAuth client credentials for approved business/partner integrations.

- Cursor pagination for high-volume lists; explicit sort/filter parameters.

- Idempotency-Key required for create/financial/booking operations that may be retried.

- Correlation ID accepted/generated and returned in response headers.

- Structured error shape: code, user-safe message, field errors, correlation ID and retry guidance.

- Rate limits vary by identity and endpoint; public tracking has anti-enumeration and abuse protections.

- Deprecations have documentation, response warning/header and published removal date.

| **Endpoint group** | **Scope**                                                                                         |
|--------------------|---------------------------------------------------------------------------------------------------|
| Identity/profile   | GET/PATCH /me; sessions, preferences and organisation context.                                    |
| Rates/quotes       | POST /rates; POST/GET /quotes; accept, reject and revise actions.                                 |
| Shipments          | POST/GET/PATCH permitted drafts; shipment retrieval and approved actions.                         |
| Packages/labels    | Package retrieval; label generation/retrieval; no arbitrary public object access.                 |
| Tracking           | Public controlled lookup; authenticated detail; business batch tracking.                          |
| Pickups/deliveries | Create/reschedule/cancel under rules; assignment endpoints for operational apps.                  |
| Documents          | Create upload intent; confirm upload; metadata; review/action; signed download.                   |
| Payments/invoices  | Create hosted payment; retrieve status; invoices/receipts; refund requests.                       |
| Claims/returns     | Eligibility, create, evidence, progress and authorised decisions.                                 |
| Business           | Organisation users, bulk imports, templates, reports, API clients and webhooks.                   |
| Admin              | Role-protected operational resources; every high-risk action audited.                             |
| Providers          | Dedicated signed webhook endpoints for Stripe, Twilio, carriers, support/accounting where needed. |

## 26.2 Webhook delivery to business customers

- Supported initial events: shipment.created, shipment.status_changed, shipment.action_required, shipment.delivered, document.requested, invoice.issued, payment.confirmed and claim.updated.

- Payload contains event ID, type, version, occurred time, object reference and minimal approved data.

- Sign using rotating secret and timestamped HMAC; document verification algorithm.

- Retry with exponential backoff; show attempts and final failure in business portal.

- Consumers deduplicate by event ID; Nauterio supports replay by authorised user.

- Endpoint validation and test event occur before activation.

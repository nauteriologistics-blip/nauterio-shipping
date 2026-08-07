# 30. External integrations

| **Integration**        | **Functions**                                                         | **Technical rules**                                                                                                     |
|------------------------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| DHL/FedEx/UPS/EasyPost | Rates where contracted, shipment/label creation, pickup and tracking. | Adapter per provider; sandbox and production accounts; map events; preserve raw payload; idempotency; fallback polling. |
| Sea freight partner    | Schedules, quote/booking, amendments, milestones and documents.       | API/webhook preferred; otherwise SFTP/controlled CSV with reconciliation and provenance.                                |
| Customs broker         | Case, document, query, charge and release exchange.                   | API/webhook or secure portal/import; deadlines and responsible person recorded.                                         |
| Stripe                 | Hosted payments, refunds, disputes and payment events.                | Signature verification, idempotent event processing and separate test/live secrets \[T8\].                              |
| PayPal                 | Optional payment method for approved markets.                         | Separate provider adapter and reconciliation.                                                                           |
| Google Maps            | Address validation, places, geocoding and navigation launch.          | Store provider result and customer-confirmed exception; control cost and key restrictions \[T9\].                       |
| Twilio                 | SMS and WhatsApp send/receive/status.                                 | Approved sender, templates, opt-outs, HTTPS and signature validation \[T10\].                                           |
| Amazon SES             | Transactional email.                                                  | SPF, DKIM, DMARC, bounce/complaint handling and suppression.                                                            |
| Zendesk                | Messaging and support tickets.                                        | Customer/shipment context and ticket ID; least-data transfer \[T11\].                                                   |
| Accounting/e-invoicing | Invoice/credit note transmission and accounting result.               | Provider selected with Italian accountant; reconciliation and immutable references.                                     |

## 30.1 Adapter contract

- Typed provider-neutral request/response interfaces.

- Provider account/configuration identified without exposing secrets to logs or UI.

- Timeout, retry, circuit-breaker and rate-limit behaviour.

- Raw request/response storage only when legally and operationally justified; redact secrets/PII.

- Error mapping into retryable, customer-action, staff-action and permanent categories.

- Health status and last successful operation visible to administrators.

- Contract tests and recorded/synthetic fixtures; never rely only on live production testing.

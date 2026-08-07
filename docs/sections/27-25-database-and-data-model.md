# 25. Database and data model

## 25.1 Core entity catalogue

| **Entity**                        | **Purpose**                                                                         |
|-----------------------------------|-------------------------------------------------------------------------------------|
| User                              | Application user linked to Cognito identity; status, profile and security metadata. |
| Organisation                      | Verified business account; legal, billing, credit and contract data.                |
| OrganisationMember                | User membership, role, status and approval limits.                                  |
| Address                           | Versioned validated address with provider result and customer confirmation.         |
| Contact                           | Sender/receiver contact linked to user/organisation where appropriate.              |
| Service                           | Air/parcel/freight operational service and eligibility.                             |
| Route                             | Origin/destination countries/zones, active dates, service and coverage.             |
| RateCard/RateRule                 | Versioned calculation rules, breaks, minimums and effective dates.                  |
| Quote/QuoteLine                   | Input snapshot, calculated line items, approvals, currency and expiry.              |
| Booking/Draft                     | Step progress, saved inputs and conversion state.                                   |
| Shipment                          | Master business movement, parties, route, service, timing and lifecycle.            |
| Package                           | Physical handling unit, dimensions, weight, condition, label and current location.  |
| ShipmentItem                      | Declared customs commodity and value details.                                       |
| TrackingEvent                     | Canonical event, source, public/internal text, location, time and evidence.         |
| ExternalTrackingEvent             | Raw provider event and deduplication key.                                           |
| Pickup/Delivery                   | Assignment, time window, attempts, evidence and status.                             |
| Warehouse/StorageLocation         | Facility and hierarchical zone/shelf/bin.                                           |
| PackageMovement                   | Scan-confirmed custody/storage movement.                                            |
| Manifest/ManifestItem             | Dispatch batch, carrier/service and included packages.                              |
| CustomsCase                       | Import/export case, action, deadline, broker and outcome.                           |
| Document/DocumentVersion          | Metadata, object key, scan/review status, retention and access.                     |
| Charge/Invoice/InvoiceLine        | Financial obligation and issued billing record.                                     |
| Payment/PaymentEvent/Allocation   | Provider/bank event and allocation to obligations.                                  |
| Refund                            | Approved return of funds and provider result.                                       |
| Claim/ClaimEvidence/ClaimDecision | Claim lifecycle, supporting evidence and outcome.                                   |
| Return                            | Return request and linked return shipment.                                          |
| SupportLink                       | Zendesk ticket linkage and operational escalation state.                            |
| Notification/DeliveryAttempt      | Rendered communication and provider delivery result.                                |
| ContentPage/PolicyVersion         | Versioned public content and approval/effective state.                              |
| AuditEvent                        | Append-only sensitive/business activity.                                            |
| OutboxEvent/InboxEvent            | Reliable internal event publication and provider event deduplication.               |
| ApiClient/ApiKey/WebhookEndpoint  | Business/partner integration identity, scopes and delivery state.                   |

## 25.2 Shipment fields

| **Group**     | **Required fields**                                                                                     |
|---------------|---------------------------------------------------------------------------------------------------------|
| Identity      | UUIDv7 ID; public tracking number; customer reference; carrier references; organisation/customer owner. |
| Parties       | Sender and receiver snapshot; importer/consignee roles; billing party; contact verification.            |
| Service/route | Service, route, origin/destination zones, pickup/drop-off, delivery mode, carrier/partner.              |
| Physical      | Package count, total actual/volumetric/chargeable weight, volume, handling indicators.                  |
| Customs       | Purpose, declared value/currency, duty payer model, item list, document readiness, customs case.        |
| Timing        | Created, pickup target, dispatch target, estimated delivery range, delivered time and timezone context. |
| Lifecycle     | Internal status, public status, action-required reason, cancellation/archive state.                     |
| Financial     | Quote snapshot, charges, invoice/payment state, outstanding amount.                                     |
| Control       | Created/updated by, source, version, risk flags and legal hold.                                         |

## 25.3 Tracking event fields

| **Field**                     | **Rule**                                                                          |
|-------------------------------|-----------------------------------------------------------------------------------|
| id                            | UUIDv7; immutable.                                                                |
| shipmentId/packageId          | At least shipment; package when event is package-specific.                        |
| canonicalCode                 | One of the approved status catalogue values.                                      |
| publicTitle/publicDescription | Approved English and Italian customer wording.                                    |
| internalDescription           | Operational detail; never exposed automatically.                                  |
| sourceType/sourceId           | Staff, warehouse scan, driver, carrier API, partner webhook or system automation. |
| sourceEventId/dedupKey        | Prevents duplicate provider or offline events.                                    |
| eventTime/sourceTimezone      | When the event actually occurred and its original timezone context.               |
| receivedTime                  | When Nauterio received/synchronised it.                                           |
| location                      | Structured country/region/city/facility; public precision controlled separately.  |
| visibility                    | Internal, authenticated customer, public or restricted proof.                     |
| evidenceDocumentId            | Optional photo/signature/document reference.                                      |
| correctionOfId                | Links correction/reversal without deleting original.                              |
| actor/reason                  | Required for manual/correction events.                                            |
| notificationState             | Whether customer notification is eligible, queued, sent or suppressed.            |

## 25.4 Database constraints and indexes

- Unique normalised public tracking number and package number.

- Unique provider event key by provider/account/event identifier.

- Foreign keys with explicit delete policy; operational records normally restrict deletion.

- Check constraints for non-negative money, measurement and count values.

- Currency uses three-letter ISO code and integer minor units.

- Partial/indexed searches on active shipment status, tracking number, carrier reference, customer/organisation, pickup date, customs action deadline and unpaid invoice.

- Tracking events indexed by shipment and event time; public timeline uses stable deterministic order.

- Audit/outbox tables are append-only from normal application permissions.

- Optimistic version field for records likely to be concurrently edited.

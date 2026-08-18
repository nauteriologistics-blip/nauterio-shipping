# Spoken workflow reconciliation

## Authoritative launch sequence

1. Nauterio receives/measures the package and the customer enters the confirmed weight, dimensions, route, and declared value.
2. The system calculates an invoice-like quote with transparent freight and insurance lines. Insurance is a configured percentage of declared value.
3. Operations reviews the request and issues the invoice. No shipment or public tracking number exists yet.
4. The customer pays through the configured payment provider.
5. Only a verified provider webhook may mark the invoice paid.
6. The paid booking is converted exactly once into a shipment and receives its tracking number.
7. The first public event is package received. Operations then records processing, departed facility, transit, hold/release, and delivery events.
8. Customers see a vertical progress history, not map/GPS movement.
9. Customers and staff communicate in first-party support conversations. Automation may respond first, but staff can take over and reply from admin.

## Mismatches found in the existing implementation

- Approval immediately created an ACTIVE shipment and tracking number before any invoice or payment.
- The created shipment total was hard-coded to zero.
- Invoices required an already-created shipment, making payment-before-tracking structurally impossible.
- Invoice payment used a local mock adapter and had no verified provider webhook.
- Public quote responses omitted the persisted quote ID, so booking could not preserve the priced snapshot.
- The quote page calculated insurance only when an omitted flag happened to be true and used an illustrative 1% value rather than explicit business configuration.
- The booking wizard displayed hard-coded service prices unrelated to the API quote.
- Support contained only Zendesk-link metadata and no customer/staff messages.
- Shipment hold had no explicit hold/release state, reason, actor, or timestamp.

## Restructuring rules

- Booking is the pre-payment commercial record.
- Quote is the immutable calculation snapshot.
- Invoice belongs to the booking before shipment creation.
- Payment confirmation is webhook-authoritative and replay-safe.
- Shipment creation is an idempotent fulfillment side effect of confirmed payment.
- Tracking numbers are nullable nowhere on Shipment because Shipment itself does not exist until payment.
- Hold/release is explicit, audited, and represented in public tracking history.
- Support chat is first-party, access-scoped, timestamped, and auditable; bot handoff is optional, not required for direct agent operation.

## Remaining phases

- Phase 11: quote/invoice commercial flow.
- Phase 12: verified payment and post-payment shipment fulfillment.
- Phase 13: progress tracking and explicit hold/release.
- Phase 14: customer/admin live support conversations.
- Phase 15: integrated acceptance, migration, deployment, and pilot verification.

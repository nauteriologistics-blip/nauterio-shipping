# Spoken workflow reconciliation

## Authoritative launch sequence

1. Nauterio receives/measures the package and the customer enters the confirmed weight, dimensions, route, and declared value.
2. The system calculates a quote with transparent line items. Approved rate cards are used when loaded; otherwise the estimate is clearly marked indicative.
3. Operations reviews the request.
4. Approval issues an invoice for customer review and converts the request into a shipment with a tracking number.
5. The first public event is package received. Operations then records processing, departed facility, transit, hold/release, and delivery events.
6. Customers see invoice details in the portal, but payment is not collected through Stripe or any website checkout.
7. Any commercial settlement, partner delivery terms, or protection terms are handled by Nauterio operations outside the website.
8. Customers see a vertical progress history, not map/GPS movement.
9. Customers and staff communicate in first-party support conversations. Automation may respond first, but staff can take over and reply from admin.

## Mismatches found in the existing implementation

- The previous payment-first rewrite incorrectly removed customer-visible invoices.
- The created shipment total was hard-coded to zero.
- Online invoice payment used a local mock/Stripe-style adapter path that does not match the current offline settlement model.
- Public quote responses omitted the persisted quote ID, so booking could not preserve the priced snapshot.
- The quote page calculated insurance only when an omitted flag happened to be true and used an illustrative 1% value rather than explicit business configuration.
- The booking wizard displayed hard-coded service prices unrelated to the API quote.
- Support contained only Zendesk-link metadata and no customer/staff messages.
- Shipment hold had no explicit hold/release state, reason, actor, or timestamp.

## Restructuring rules

- Booking is the pre-approval commercial record.
- Quote is the immutable calculation snapshot.
- Invoice belongs to the approved booking and is linked to the created shipment for customer review.
- Online payment/checkout is not part of the current operating model.
- Shipment creation is an idempotent approval side effect controlled by operations.
- Tracking numbers are nullable nowhere on Shipment because Shipment itself represents an accepted operational movement.
- Hold/release is explicit, audited, and represented in public tracking history.
- Support chat is first-party, access-scoped, timestamped, and auditable; bot handoff is optional, not required for direct agent operation.

## Remaining phases

- Phase 11: quote/invoice commercial review flow.
- Phase 12: offline settlement/admin reconciliation evidence.
- Phase 13: progress tracking and explicit hold/release.
- Phase 14: customer/admin live support conversations.
- Phase 15: integrated acceptance, migration, deployment, and pilot verification.

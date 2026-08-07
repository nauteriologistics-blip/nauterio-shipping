# 15. Pricing, payments and invoicing

## 15.1 Calculation model

- For air/parcel services, volumetric weight defaults to length x width x height in centimetres divided by 5,000. The divisor is configurable by carrier/service.

- Chargeable weight is the greater of actual and volumetric weight, rounded according to the rate card.

- Sea LCL considers cubic volume, gross weight, minimum charge, origin/destination handling and schedule.

- Rules have version, currency, route, service, zone, effective dates, customer class, minimum/maximum and approval history.

- Accepted quotes snapshot every calculation input and rule so historical totals never change when rate cards change.

## 15.2 Payment rules

- Stripe is the primary provider using hosted/controlled components. PayPal may be offered separately. Full card data and security codes are never stored by Nauterio.

- Retail customers pay before processing unless a manager-approved exception exists.

- Business credit requires verified organisation, limit, terms, approval and overdue controls.

- Provider webhooks are signature-verified and idempotent; duplicate events cannot create duplicate shipment fulfilment \[T8\].

- Manual bank transfer confirmation requires reference, amount, currency, bank date, evidence and authorised finance user.

- Refunds link to original payment and approval; partial refunds record line/reason allocation.

## 15.3 Invoice contents

- Unique invoice number, issue/due date, supplier legal/VAT information, customer billing details and currency.

- Shipment/quote references, service and route.

- Clear line items, quantities, net, tax treatment, gross and paid/outstanding amount.

- Payment instructions, credit notes and required Italian e-invoicing references after accountant/provider confirmation.

- Immutable issued version; corrections use a credit note or approved replacement process.

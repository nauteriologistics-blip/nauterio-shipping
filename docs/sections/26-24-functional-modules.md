# 24. Functional modules

| **Module**         | **Owned responsibility**                                                                         |
|--------------------|--------------------------------------------------------------------------------------------------|
| Identity           | Cognito linkage, users, sessions, verification and account recovery.                             |
| Organisations      | Business accounts, members, roles, approvals, contracts and credit.                              |
| Customers/contacts | Customer profile, address book, contacts, consent and preferences.                               |
| Quotes/rating      | Quote inputs, service eligibility, rate rules, costs, margin, approval and expiry.               |
| Bookings           | Draft flow, declarations, confirmation and conversion to shipment.                               |
| Shipments/packages | Master shipment, packages, references, custody and lifecycle.                                    |
| Tracking           | Canonical statuses, events, mapping, public timeline and corrections.                            |
| Pickup/delivery    | Time windows, assignments, attempts, proof and partner workflow.                                 |
| Warehouse          | Facilities, inventory location, inspection, measurements, consolidation, repacking and dispatch. |
| Customs/compliance | Customs cases, item declarations, restricted-goods review, broker and deadlines.                 |
| Documents          | Upload, malware result, version, review, generation, access and retention.                       |
| Billing/payments   | Charges, invoices, payment allocation, bank transfer, refund and dispute.                        |
| Claims/returns     | Eligibility, evidence, decisions, compensation and return shipment.                              |
| Support            | Zendesk linkage, operational context and escalation.                                             |
| Notifications      | Templates, preferences, channel routing, delivery and retries.                                   |
| Content            | Public pages, guides, FAQ, service alerts and policy versions.                                   |
| Reporting          | Operational/financial datasets, exports and scheduled reports.                                   |
| Audit              | Immutable high-risk activity and search/export controls.                                         |
| Integrations       | Carrier, customs broker, payment, maps, messaging, support and accounting adapters.              |

## 24.1 Module boundary rule

A module owns its state and exposes explicit application services/events. For example, the payment module may confirm a payment and publish PaymentConfirmed; the shipment module decides whether that event allows shipment activation. The payment webhook must not directly update arbitrary shipment tables.

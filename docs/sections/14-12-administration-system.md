# 12. Administration system

The administration system is an operational control centre, not a public content website. It must make exceptions visible, separate duties and preserve history.

| **Module**                      | **Required operational result**                                                                              |
|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| Operations dashboard            | Today’s receipts, departures, deliveries, delayed/customs/missing queues, queue failures and service alerts. |
| Shipment and package management | Full shipment, packages, custody, measurements, labels, events, documents, charges and related cases.        |
| Quote and pricing               | Cost, margin, approval, rate cards, surcharges, discounts and effective dates.                               |
| Customers and organisations     | Verified identity/company details, users, credit, rates, activity and consent.                               |
| Pickup, delivery and warehouse  | Assignments, facilities, inventory, consolidation, repacking, dispatch and evidence.                         |
| Customs and document review     | Case queues, deadlines, declarations, broker exchanges, approvals and release references.                    |
| Finance                         | Payments, invoices, credit notes, bank reconciliation, refunds and disputes.                                 |
| Claims and returns              | Evidence, eligibility, liability, approvals, settlement, return charges and tracking.                        |
| Support and notifications       | Ticket context, approved internal notes, communication logs, failures and retries.                           |
| Staff and control               | Users, roles, permission reviews, audit log, content, settings and integrations.                             |

## 12.1 Dashboard rules

- Exceptions and actions come before decorative charts.

- Each queue card shows count, oldest item, service-level target and direct link.

- Financial values are hidden from roles without finance permission.

- Counts link to the exact filtered records that created them.

- Data freshness and integration health are displayed.

- No record may be permanently deleted from ordinary screens; use cancel, archive or privacy workflows.

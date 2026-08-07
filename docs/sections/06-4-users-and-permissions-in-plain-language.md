# 4. Users and permissions in plain language

| **Role**                 | **Plain-language responsibility**                                                        |
|--------------------------|------------------------------------------------------------------------------------------|
| Super Administrator      | All configuration, access, reports and emergency actions; restricted to very few people. |
| Operations Manager       | Shipment, pickup, delivery, warehouse, tracking and exception authority.                 |
| Warehouse Staff          | Physical package receipt, inspection, measurements, storage, movement and dispatch.      |
| Customer Support         | Customer-visible shipment context, tickets, approved notes and escalation.               |
| Finance Staff            | Payments, invoices, bank reconciliation, approved refunds and finance reports.           |
| Customs/Compliance Staff | Customs cases, declarations, restricted-goods review and broker coordination.            |
| Driver                   | Only assigned pickup/delivery jobs and required evidence.                                |
| Delivery Partner         | Only partner-assigned deliveries and event submission.                                   |
| Content Manager          | Public content and service alerts, excluding final legal/pricing approval.               |
| Auditor                  | Read-only operational, financial and audit access according to assignment.               |

## 4.1 Permission rules that apply to everyone

9.  Every person uses an individual account. Shared staff logins are prohibited.

10. Staff receive the smallest access needed for their job and selected warehouse/organisation.

11. Sensitive actions such as refund approval, role changes, exports and tracking corrections require a reason and may require reauthentication.

12. A support agent may explain status and request documents but cannot secretly change financial or physical shipment history.

13. A driver sees only assigned jobs and the minimum contact information needed to complete them.

14. An auditor is read-only and cannot alter evidence.

15. Former staff and organisation users must be disabled immediately; sessions and API keys must be revoked.

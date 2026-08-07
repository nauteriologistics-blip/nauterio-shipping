# Appendix E. Staff permission matrix

| **Action**               | **Super Admin** | **Operations**       | **Warehouse**    | **Support**      | **Finance**        | **Customs**      | **Driver**        | **Auditor**        |
|--------------------------|-----------------|----------------------|------------------|------------------|--------------------|------------------|-------------------|--------------------|
| Create/edit shipment     | Yes             | Yes                  | Limited          | No               | No                 | No               | No                | Read               |
| Add tracking event       | Yes             | Yes                  | Warehouse events | No               | No                 | Customs events   | Assigned events   | Read               |
| Correct tracking history | Yes             | Manager with reason  | No               | No               | No                 | Limited          | No                | Read               |
| View customer PII        | Yes             | Yes                  | Minimum required | Minimum required | Billing fields     | Customs fields   | Assigned job only | Read if authorised |
| View identity documents  | Yes             | Restricted           | No               | No               | No                 | Yes              | No                | Restricted read    |
| Confirm bank transfer    | Yes             | No                   | No               | No               | Yes                | No               | No                | Read               |
| Approve refund           | Yes             | According to limit   | No               | No               | Prepare only       | No               | No                | Read               |
| Approve claim            | Yes             | According to limit   | No               | No               | Payment only       | Advisory         | No                | Read               |
| Manage staff/roles       | Yes             | No                   | No               | No               | No                 | No               | No                | Read               |
| Export data              | Restricted yes  | Approved operational | No               | No               | Approved financial | Approved customs | No                | Approved read      |

This matrix is a baseline. The server permission model must also apply warehouse, assignment, organisation, customer relationship, approval limit, record state and separation-of-duties constraints.

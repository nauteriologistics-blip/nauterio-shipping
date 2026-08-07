# 32. Privacy and retention engineering

| **Record**                      | **Default proposed period**                            | **Engineering rule**                                                               |
|---------------------------------|--------------------------------------------------------|------------------------------------------------------------------------------------|
| Customer profile                | While active; review inactive profiles after 24 months | Retain only fields still required; deletion may be limited by transaction records. |
| Shipment and tracking records   | 10 years proposed                                      | Final period requires Italian legal/accounting confirmation.                       |
| Invoices and accounting records | 10 years proposed                                      | Align with Italian statutory and accountant requirements.                          |
| Payment transaction records     | 10 years proposed                                      | Do not store full card data.                                                       |
| Customs records                 | At least 5 years proposed                              | Confirm with customs broker and applicable procedure.                              |
| Identity documents              | 90 days after clearance unless legally required        | Highly restricted access.                                                          |
| Proof of delivery and photos    | 24 months proposed                                     | Longer only for open dispute or legal hold.                                        |
| Support tickets                 | 3 years proposed                                       | Redact excessive sensitive data.                                                   |
| Claims and settlement files     | 10 years proposed                                      | Retain through legal/contractual limitation period.                                |
| Audit logs                      | 7 years proposed                                       | Append-only and tightly restricted.                                                |
| Security logs                   | 12 months online; 24 months archive                    | Shorter/longer according to incident needs and counsel.                            |
| Public tracking result          | 180 days after delivery                                | Sensitive proof remains authenticated.                                             |
| Database point-in-time backups  | 35 days                                                | Automated managed retention.                                                       |
| Monthly backup archives         | 12 months                                              | Encrypted and restore-tested.                                                      |

## 32.1 Data-subject request workflow

89. Receive request through authenticated portal or verified privacy channel.

90. Verify identity without collecting excessive new information.

91. Create restricted case and legal deadline.

92. Search user, organisation, shipment, support, document, payment and processor references.

93. Apply exemptions/legal holds and redact third-party data.

94. Produce secure export, correction or deletion/anonymisation actions.

95. Record decision, response and evidence without retaining the exported package indefinitely.

## 32.2 Privacy by design rules

- Do not ask for full account registration before an anonymous quote when it is not needed.

- Snapshot addresses/parties for completed shipment history while allowing address-book updates separately.

- Use masked views and explicit reveal controls for sensitive data.

- Send providers only fields needed for the contracted operation.

- Use synthetic data in tests; production data must not be copied into development.

- Analytics uses event/category and opaque internal IDs, not raw shipment/customer content.

- Deletion jobs support legal holds and produce auditable completion records.

# Appendix F. Notification catalogue

| **Event**               | **Default channel**           | **Timing**                                | **Minimum content**                         |
|-------------------------|-------------------------------|-------------------------------------------|---------------------------------------------|
| Account created         | Email                         | Immediately                               | Verification and security guidance          |
| Quote ready             | Email + portal                | Immediately                               | Price, validity and acceptance link         |
| Payment received        | Email + portal                | Immediately after verified provider event | Receipt and balance                         |
| Pickup scheduled        | Email/SMS/WhatsApp + portal   | After confirmation                        | Date, window and preparation                |
| Package received        | Email/portal                  | After origin scan                         | Receipt and next step                       |
| Documents required      | Email + SMS/WhatsApp + portal | Immediately                               | Exact missing item and deadline             |
| Departed Italy          | Email/portal                  | After verified event                      | Milestone and estimate                      |
| Arrived USA             | Email/portal                  | After verified event                      | Milestone and customs next step             |
| Customs action required | Email + SMS/WhatsApp + portal | Immediately                               | Action, amount/document and deadline        |
| Delayed                 | Email/SMS/WhatsApp + portal   | After public delay approval               | Reason category and revised estimate        |
| Out for delivery        | SMS/WhatsApp/email + portal   | Morning or at dispatch                    | Delivery window and instructions            |
| Delivery attempted      | SMS/WhatsApp/email + portal   | Immediately                               | Reason and next action                      |
| Delivered               | Email/SMS/WhatsApp + portal   | Immediately after evidence sync           | Time and proof link                         |
| Claim update            | Email + portal                | At each decision/action stage             | Status and required action                  |
| Refund processed        | Email + portal                | After provider confirmation               | Amount, method and expected timing          |
| Security event          | Email and in-app              | Immediately                               | Login/session details and protective action |

## Message template rules

- English and Italian approved versions; no free-form provider template for high-risk requests.

- Include company identity, reference, exact action, deadline where applicable and safe support route.

- Do not include full addresses, item lists, identification or payment credentials in SMS/WhatsApp/email subject.

- Every send records template version and provider result; failures retry according to category.

- Marketing consent is separate from operational messages and supports opt-out.

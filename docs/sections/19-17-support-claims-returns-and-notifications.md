# 17. Support, claims, returns and notifications

## 17.1 Support channels

- Zendesk website messaging and ticketing is the primary support workspace \[T11\].

- WhatsApp and SMS use Twilio and verified webhook signatures \[T10\].

- Phone, business email and contact form are published with real hours and response expectations.

- The Nauterio platform passes customer, shipment and status context to support; Zendesk retains the conversation record.

- Internal notes remain hidden from customers and do not alter shipment history.

## 17.2 Ticket priority

| **Priority** | **Examples**                                                                              | **Initial response target**                                                     |
|--------------|-------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| Critical     | Security incident, suspected fraud, urgent customs deadline, active high-value loss event | Immediate escalation; technical/management response according to incident plan. |
| High         | Material delay, damage, failed delivery problem, customs payment/document block           | Within four business hours.                                                     |
| Normal       | Quote, booking, tracking explanation, account or billing question                         | Within one business day.                                                        |
| Low          | Suggestion, content correction or non-urgent feedback                                     | Within two business days or planned review.                                     |

## 17.3 Claims and returns

- Claim types: loss, damage, missing contents, incorrect delivery, service failure and incorrect charge.

- Evidence is tailored by type: proof of value, photos, packaging, serial/model, repair estimate, delivery evidence and claimant relationship.

- Customer can see Draft, Submitted, Documents Required, Under Review, Carrier Investigation, Approved, Partially Approved, Rejected, Appealed, Payment Pending, Paid and Closed.

- Cancellation before pickup is simplest; after pickup charges may be deducted; after departure the request normally becomes return-to-sender subject to transport, customs and storage costs.

- Policy deadlines in the interface must come from approved carrier/insurance/legal terms, not invented universal limits.

## 17.4 Notification matrix

| **Event**               | **Channel**                   | **Timing**                                | **Content**                                 |
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

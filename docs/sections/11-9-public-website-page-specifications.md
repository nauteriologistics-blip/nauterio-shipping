# 9. Public website page specifications

<img src="/mnt/data/Nauterio_Claude_Code_Skills_Kit/docs/spec-media/media/image4.png" style="width:5.6in;height:7.09333in" alt="Image: image4.png" />

*Figure 4. Exact homepage section order. Final visual design may refine spacing but not omit required information.*

## 9.1 Homepage detailed content

| **Homepage block** | **Exact requirement**                                                                                                                                                                                        |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Service alert bar  | Only current disruption or policy changes. Include severity, affected services, effective time and link. No permanent promotional clutter.                                                                   |
| Header             | Selected logo, navigation, language, sign in and Get a Quote.                                                                                                                                                |
| Hero               | Headline: “Shipping from Italy to the United States, made clear.” Supporting text: one sentence covering parcels, cargo, customs assistance and tracking. Tracking field plus Get a Quote and Book Shipment. |
| Trust strip        | Show only verified facts: registered company, secure payment, support hours, insured/partner statement when documentary proof exists.                                                                        |
| Service selector   | Five main service cards with use case, indicative speed and quote action.                                                                                                                                    |
| How it works       | Five visual steps: quote; prepare; pickup/drop-off; customs/transit; delivery.                                                                                                                               |
| Route feature      | Map-style Italy-to-USA visual, coverage statement, estimated transit explanation and customs disclaimer.                                                                                                     |
| Business feature   | Bulk upload, team accounts, negotiated rates, statements, reports and API.                                                                                                                                   |
| Customs guidance   | Three cards: accurate invoice; restricted-item check; duties/taxes responsibility.                                                                                                                           |
| Tracking example   | Example timeline clearly marked as an example, not a real shipment.                                                                                                                                          |
| Support strip      | Live chat, WhatsApp, phone, ticket and hours. Emergency language reserved for active serious shipment problems.                                                                                              |
| Reviews            | Only verified review records with consent; no stock names or fake shipment counts.                                                                                                                           |
| FAQ                | Launch questions on timing, tracking, duties, prohibited items, measurements, damage, accounts and support.                                                                                                  |
| Final CTA          | Track shipment, get quote and create account.                                                                                                                                                                |
| Footer             | Complete service, customs, support, company, legal and contact links; language and copyright.                                                                                                                |

## 9.2 Tracking page and result

- The tracking form accepts the Nauterio tracking number, package number or supported carrier number, removes harmless spaces/hyphens and gives a specific invalid-format message.

- The result header shows status, tracking number, general origin/destination, service and current estimated delivery. It never exposes full addresses publicly.

- The timeline lists public events newest-first on mobile or as a clear vertical milestone sequence; each event includes date, local time, location level and explanation.

- Action-required events show one primary action such as Upload Document, Pay Charge, Correct Address or Contact Support.

- Proof of delivery requires authenticated access or tracking number plus receiver ZIP/one-time code.

- A “Report a problem” control carries the shipment context into support rather than asking the customer to retype it.

- An invalid or unknown number page provides format examples, a retry field and support guidance without confirming private records.

## 9.3 Quote and booking flow

- Use a visible stepper: Service; Sender; Receiver; Packages; Customs; Pickup; Review; Payment; Confirmation.

- Save a local anonymous draft before sign-in and offer account creation when the customer wants to continue, save or pay.

- Validate addresses through Google Address Validation while allowing authorised confirmation of legitimate exceptions \[T9\].

- Ask restricted-goods screening questions before presenting a final automatic price.

- Use plain-language customs descriptions and show examples of unacceptable vague descriptions, following CBP’s emphasis on specific cargo descriptions \[L5\].

- Review page displays all information, declarations, charge breakdown, duties responsibility, timing range and policy links before payment.

- Confirmation page shows tracking, label/receipt links, pickup/drop-off instructions and next expected milestone.

## 9.4 Service, customs, help and legal page template

| **Template**     | **Mandatory blocks**                                                                                                                                                 |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Service detail   | Purpose; suitable customers; included service; excluded/review items; process; timing; pricing factors; package limits; related customs guidance; FAQ; quote action. |
| Customs guide    | Clear warning; affected shipments; required information/documents; examples; responsibilities; approval limits; authoritative source date; related action.           |
| Help article     | Question/title; direct answer; step-by-step action; expected result; common errors; escalation; last reviewed date.                                                  |
| Policy/legal     | Policy owner; effective date; version; scope; definitions; rights/obligations; procedure; fees/limits where approved; contact; prior version access where required.  |
| Resource article | Useful title; summary; practical sections; official sources; related service; no unsupported statistics; review date.                                                |

<img src="/mnt/data/Nauterio_Claude_Code_Skills_Kit/docs/spec-media/media/image1.png" style="width:6.5in;height:1.87778in" alt="Image: image1.png" />

**COMPLETE PRODUCT AND  
TECHNICAL SPECIFICATION**

Italy-to-United States Shipping Platform

Business model \| Website and portal screens \| Operations \| Data \| Security \| Infrastructure \| Delivery plan

Version 1.0 \| 6 August 2026 \| Baseline for design, development, testing and AI-assisted implementation

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>Important status<br />
</strong>This document defines the recommended product and technical baseline. The company name and logo direction are selected. Registration data, final domain purchase, carrier contracts, customs-broker arrangements, rate cards, insurance terms and legally approved policies must be supplied before public launch.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# Document control

| **Item**                 | **Decision**                                                                                                         |
|--------------------------|----------------------------------------------------------------------------------------------------------------------|
| Document owner           | Nauterio Logistics Product Owner                                                                                     |
| Version                  | 1.0                                                                                                                  |
| Status                   | Baseline specification for approval and implementation                                                               |
| Primary market           | Shipping from Italy to the United States                                                                             |
| Primary domain           | A company-owned .com domain; preferred form: nauteriologistics.com, subject to registration and legal clearance      |
| Launch languages         | English and Italian                                                                                                  |
| Launch currencies        | EUR and USD                                                                                                          |
| Specified screens/routes | 201 unique screen templates across public, customer, business, administration, warehouse, driver and developer areas |
| Primary hosting region   | AWS Europe (Milan), eu-south-1                                                                                       |
| Recovery region          | AWS Europe (Frankfurt), eu-central-1                                                                                 |
| Approval rule            | The Product Owner resolves requirements conflicts and signs each release acceptance report                           |

## How to use this document

- A non-technical owner can use Part I to understand the business, pages, user journeys and operating rules.

- A designer can use the brand system, page blueprints and interaction rules to produce high-fidelity interfaces.

- A developer or AI coding system can use Part II, the route inventory, entity catalogue, API rules and acceptance criteria to build the platform in controlled phases.

- Operations, customs, finance, warehouse and support staff must approve the sections that govern their work before development is treated as final.

- Words such as “must” and “shall” are mandatory requirements. “Should” is the recommended default. “May” is optional and requires approval.

## Decisions still requiring real company evidence

- Italian legal name, registration number, VAT number, EORI details and registered address.

- Real office, warehouse, support and telephone details.

- Carrier, customs broker, insurer, last-mile and sea-freight contracts.

- Actual service coverage, rate cards, surcharges, margins and transit commitments.

- Legally reviewed terms, privacy, cookies, claims, prohibited-goods and carriage policies.

- Final .com availability, trademark clearance and ownership registration.

- Final warehouse devices, scales, thermal printers and scanner models.

# Contents

- Part I - Business, product, operations and design

<!-- -->

- 1\. Executive product definition

- 2\. Research benchmark and design principles

- 3\. Business model and services

- 4\. Users and permissions in plain language

- 5\. End-to-end operating journeys

- 6\. Information architecture and screen count

- 7\. Brand and visual design system

- 8\. Global navigation and reusable components

- 9\. Public website page specifications

- 10\. Customer portal

- 11\. Business portal

- 12\. Administration system

- 13\. Warehouse PWA

- 14\. Driver PWA

- 15\. Pricing, payments and invoicing

- 16\. Customs, restricted goods and documents

- 17\. Support, claims, returns and notifications

- 18\. Content, legal, privacy and accessibility

- 19\. Analytics, reporting and success measures

<!-- -->

- Part II - Technical architecture and implementation

<!-- -->

- 20\. Approved technology stack

- 21\. System architecture

- 22\. Domains, environments and AWS infrastructure

- 23\. Application and repository organisation

- 24\. Functional modules

- 25\. Database and data model

- 26\. API and webhook specification

- 27\. Authentication, authorisation and audit

- 28\. Files, labels, barcodes and generated documents

- 29\. Events, queues, caching and scheduled work

- 30\. External integrations

- 31\. Security engineering

- 32\. Privacy and retention engineering

- 33\. Performance, scale and reliability

- 34\. Observability and supportability

- 35\. Testing and quality assurance

- 36\. CI/CD, releases and maintenance

- 37\. Delivery roadmap, budget and staffing

- 38\. AI-assisted build protocol

- 39\. Final acceptance criteria

<!-- -->

- Appendices - 201-screen inventory, statuses, fields, permissions, notifications, retention, glossary and official sources

**PART I**

**Business, Product, Operations and Design**

> This part explains the company, services, pages and workflows in language that business owners, designers, operations staff and customers can understand.

**Nauterio Logistics**

# 1. Executive product definition

Nauterio Logistics will be a digital-first international shipping and logistics company focused initially on movements from Italy to the United States. The website is not merely a marketing site. It is the public entrance to a complete shipment operating platform covering quotations, booking, payment, pickup, warehouse handling, customs documentation, tracking, delivery evidence, support, claims, returns and business accounts.

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>Core promise<br />
</strong>Customers should always understand what they are buying, what information is required, where their shipment is, what action they must take and how to reach a real support channel. The platform must never create false confidence by showing invented locations, fabricated reviews, unverified delivery promises or misleading customs estimates.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 1.1 Launch proposition

| **Question**               | **Approved answer**                                                                                                                                                           |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Who is it for?             | Individuals, online sellers, small businesses and larger commercial customers shipping from Italy to the United States.                                                       |
| What is sold?              | Air express, air economy, parcels, documents, commercial cargo, sea freight, pickup, drop-off, customs assistance, consolidation, repacking, optional protection and returns. |
| What makes it useful?      | One clear interface for quotation, booking, documents, payment, tracking, customer support and business reporting.                                                            |
| What makes it trustworthy? | Verified business details, accurate shipment events, controlled audit history, secure payments, protected documents, clear responsibility for customs and visible support.    |
| What is not promised?      | Guaranteed customs release, guaranteed transit during force majeure, unrestricted acceptance of controlled goods, or exact live vehicle location.                             |
| What can expand later?     | Reverse USA-to-Italy service, other international corridors, native mobile apps and additional carrier/business integrations.                                                 |

## 1.2 Product principles

1.  Tracking first: a visitor must be able to track from the homepage without creating an account.

2.  Clarity before conversion: duties, limitations, documents and restricted-item questions must be visible before payment.

3.  One source of truth: shipment, package, payment and status records must come from the platform database and approved integrations.

4.  Privacy by role: people see only the personal and operational data needed for their task.

5.  Human control for exceptions: unusual cargo, customs holds, price overrides, refunds and claims require authorised review.

6.  Mobile operational readiness: warehouse and driver tasks must work on practical mobile devices and tolerate temporary connectivity loss.

7.  No unnecessary complexity: use a modular monolith and managed services before considering microservices or custom versions of mature support/payment products.

8.  Evidence over marketing: testimonials, certificates, counters, delivery claims and partner logos require documentary approval.

## 1.3 Launch success measures

| **Area**              | **Target or control**                                                                                                    |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------|
| Customer conversion   | Measure quote completion, booking completion, payment completion and repeat shipment rate.                               |
| Tracking self-service | Most routine “where is my package?” requests should be answered without contacting support.                              |
| Data quality          | Mandatory address, package, commodity and declaration validation before dispatch.                                        |
| Operational speed     | Warehouse staff can receive and locate a normal package through scanning rather than manual spreadsheets.                |
| Financial control     | Every charge, payment, refund and credit note is connected to a quote, shipment or invoice and appears in audit history. |
| Security              | No customer can access another customer’s private data; staff MFA and role permissions are mandatory.                    |
| Reliability           | Critical service availability target 99.9%; tracking p95 target below 1.5 seconds at planned launch volume.              |
| Accessibility         | WCAG 2.2 Level AA is the design and testing target \[Q1\].                                                               |

# 2. Research benchmark and design principles

The specification learns from active major-carrier interfaces rather than inventing an unfamiliar shipping experience.

## 2.1 What established shipping platforms consistently provide

| **Benchmark**     | **Observed pattern**                                                                            | **Nauterio decision**                                                                              |
|-------------------|-------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| DHL MyDHL+ \[B1\] | Quote, create shipment, schedule pickup, find locations and track from one digital environment. | Provide quote, booking, pickup, locations and tracking as top-level actions.                       |
| FedEx \[B2\]      | Rate-and-ship, public tracking, proof of delivery, pickup and customs-document support.         | Keep public tracking prominent; protect detailed proof; include customs document guidance.         |
| UPS \[B3\]        | Tracking support, delivery changes, hold/reroute options, claims and international guidance.    | Create dedicated tracking help, delivery exception and claims journeys.                            |
| USPS \[B4\]       | Tracking, online labels, pickup, incoming-package notices, missing-mail search and claims.      | Use structured support escalation and evidence collection rather than generic contact forms.       |
| Maersk \[B5\]     | Cargo tracking, instant prices, route availability, booking, amendments and documents.          | Support freight quotes, multi-stage booking and shipment/document management for commercial cargo. |

## 2.2 Features intentionally copied as patterns, not designs

- A tracking input near the top of the homepage and a dedicated tracking page.

- A quote journey that starts with route and package information before requesting unnecessary account details.

- A logged-in shipment list and detailed milestone timeline.

- Pickup scheduling, delivery options, claims, customs guidance and support as separate understandable journeys.

- Business features for team users, bulk creation, negotiated rates, statements, reports, API keys and webhooks.

- A help centre organised by the customer’s task rather than by internal departments.

## 2.3 Features deliberately not copied

- Complex mega-menus containing products Nauterio does not actually sell.

- Country-wide claims that cannot be supported by partner contracts.

- Large “ship now” processes that conceal customs questions until the end.

- Exact live driver positions, which create privacy and security risks.

- Anonymous reviews, fake package counters and unverified “licensed/insured” badges.

- Carrier-specific status names in the core data model; external events are mapped into Nauterio’s standard status catalogue.

# 3. Business model and services

The service catalogue below is the complete planned catalogue. Services may be visible as “request review” until Nauterio has the operational contract, rate card and legal approval needed to sell them.

| **Service**         | **Best for**                                        | **Indicative timing**                                                                            | **Included digital capabilities**                                     |
|---------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| Air Express         | Urgent documents and parcels                        | 2-5 business days target after export acceptance; exact transit comes from the selected carrier. | Door-to-door, full tracking, priority handling, optional signature.   |
| Air Economy         | Non-urgent parcels                                  | 5-10 business days target after export acceptance.                                               | Lower-cost air service, full tracking, standard handling.             |
| Parcel Shipping     | Personal and retail parcels                         | Depends on service level and destination zone.                                                   | Multiple package types, pickup or warehouse drop-off.                 |
| Document Shipping   | Contracts, certificates and business documents      | Express or economy.                                                                              | Document envelope, tracking, optional signature.                      |
| Commercial Cargo    | Cartons, pallets, equipment and inventory           | Quoted after dimensions, weight, commodity and route review.                                     | Business workflow, customs documentation, pallet handling.            |
| Sea Freight LCL     | Cargo sharing container space                       | Schedule-based; quote shows estimated sailing and transit.                                       | Volume-based pricing, consolidation, origin and destination handling. |
| Sea Freight FCL     | Dedicated container movements                       | Schedule-based.                                                                                  | Container booking, documentation, milestones and amendments.          |
| Pickup Service      | Collection from an Italian address                  | Scheduled time window.                                                                           | Address validation, instructions, driver assignment and scan.         |
| Warehouse Drop-off  | Customer delivers to an approved location           | Appointment or opening hours.                                                                    | Drop-off receipt, package scan and inspection.                        |
| Customs Assistance  | Document checking and broker coordination           | Runs alongside export/import processing.                                                         | Does not guarantee customs release.                                   |
| Consolidation       | Combine several packages into one outbound movement | After package receipt.                                                                           | Customer approval, package relationship and new measurements.         |
| Repacking           | Replace inadequate packaging                        | Before dispatch.                                                                                 | Photographs, customer approval, materials and labour charge.          |
| Shipment Protection | Optional declared-value protection                  | Purchased during quotation or before departure.                                                  | Subject to insurer terms and exclusions.                              |
| Returns             | Return to sender or customer-requested return       | Depends on shipment stage and customs position.                                                  | New return record, charges and tracking.                              |

## 3.1 Launch route and coverage

- Active corridor: Italy to the United States.

- Origin coverage is configured by Italian postcode zones, warehouse proximity, islands and remote areas.

- Destination coverage is configured by US ZIP-code zones, including separate pricing for Alaska, Hawaii and remote addresses.

- US territories remain disabled until a contracted carrier and customs process are approved.

- Every route has effective dates, eligible services, transit target ranges, package limits, restricted categories and responsible carrier/partner.

## 3.2 Customer types and commercial treatment

| **Customer type** | **Account requirement**                 | **Pricing**                       | **Payment**                     | **Capabilities**                                                        |
|-------------------|-----------------------------------------|-----------------------------------|---------------------------------|-------------------------------------------------------------------------|
| Guest             | No account for quote or basic tracking  | Public retail estimate            | Payment during booking          | Quote, public tracking, help and contact.                               |
| Individual        | Verified email account for full booking | Retail rate or approved promotion | Prepaid                         | Saved addresses, shipments, documents, claims and returns.              |
| Small business    | Verified organisation account           | Retail or negotiated              | Prepaid or approved short terms | Team, templates, bulk import, statements and reports.                   |
| Corporate         | Approved organisation and contract      | Negotiated rate card              | Credit limit and approved terms | Approvals, cost centres, API, webhooks and account management.          |
| Partner/agent     | Contract and scoped access              | Contract-specific                 | Contract-specific               | Assigned shipments, events, documents and settlement according to role. |

## 3.3 What the price must explain

- Base transport, pickup, origin handling, destination handling, customs processing, fuel, remote area, residential delivery, oversize, fragile handling, repacking, storage, protection, redelivery, return and tax as separate line items when applicable.

- Whether customs duties and import taxes are included, estimated or payable separately by the importer/recipient.

- Quote validity, assumptions, package measurements, exchange rate, exclusions and what can cause recalculation.

- No hidden charge should be added without a documented trigger and customer communication.

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

# 5. End-to-end operating journeys

<img src="/mnt/data/Nauterio_Claude_Code_Skills_Kit/docs/spec-media/media/image2.png" style="width:7in;height:2.53333in" alt="Image: image2.png" />

*Figure 1. The shared customer and operations journey. Every milestone is backed by a real event.*

## 5.1 Standard parcel journey

16. Customer gets a quote using origin, destination, package measurements, weight and content summary.

17. Customer selects a service, enters sender/receiver and customs items, chooses pickup/drop-off, reviews declarations and pays.

18. The platform creates master and package numbers, invoice/receipt and a label.

19. Warehouse or driver scan records physical custody; warehouse confirms condition and measurements.

20. If measurements change the price, the system creates a review and does not silently charge.

21. Customs documents are reviewed; verified carrier/broker events update export, transit and import milestones.

22. Delivery agent records required proof; customer receives the delivered event and controlled proof link.

23. Shipment closes after finance, document and exception checks; records move to retention rather than deletion.

## 5.2 Manual commercial cargo quote

24. Business customer provides cartons/pallets, commodity, values, service mode, pickup/delivery and target date.

25. Operations requests carrier/freight costs; pricing records cost, margin, validity and approvals.

26. Customer receives a PDF and portal quote, accepts it and supplies any required commercial documents.

27. Accepted quote creates the booking; deposit or full payment is collected according to terms.

28. Cargo milestones, documents and amendments remain visible in the same shipment record.

## 5.3 Customs action journey

29. Customs/broker event creates a case with action type, owner, deadline and public wording.

30. Customer receives the exact document, clarification or payment request, not a generic “customs issue” message.

31. Uploaded evidence enters a review queue and remains private.

32. Broker response and release reference are stored; public status changes only after authorised confirmation.

33. If goods are refused, seized, abandoned or returned, the applicable policy and cost process is recorded.

## 5.4 Delay or missing shipment journey

34. A carrier gap, missed milestone or staff report creates an exception; it does not automatically label the shipment lost.

35. Operations investigates scans, custody, partner data and warehouse movements.

36. Customer sees controlled “delayed” or “under investigation” wording and receives meaningful updates.

37. Loss is confirmed only by an authorised decision, after which claim/compensation rules apply.

## 5.5 Claim journey

38. Customer starts from an authenticated shipment where possible.

39. The form asks only evidence relevant to loss, damage, missing contents, incorrect delivery or charge dispute.

40. Claims staff check eligibility, evidence, liability, carrier case and protection terms.

41. Decision, appeal, payment and closure remain visible with a complete audit trail.

# 6. Information architecture and screen count

The platform contains 201 unique route or screen templates. Dynamic detail routes such as a shipment page can represent many records, but they count as one reusable screen design. This count prevents the project from being described vaguely as “a website” and makes design, development and testing measurable.

| **Area**                  | **Templates** | **Examples**                                                                                                |
|---------------------------|---------------|-------------------------------------------------------------------------------------------------------------|
| Public and authentication | 77            | Home, Track shipment, Tracking result, Track multiple shipments, Get a quote ...                            |
| Customer portal           | 27            | Customer dashboard, My shipments, Shipment detail, Detailed tracking, Create shipment ...                   |
| Business portal           | 13            | Business dashboard, Organisation profile, Team users, Roles and approvals, Bulk shipment import ...         |
| Administration            | 52            | Operations dashboard, Shipment management, Shipment administration, Create shipment, Package management ... |
| Warehouse PWA             | 14            | Warehouse sign in, Warehouse dashboard, Receive shipment, Package scanner, Package inspection ...           |
| Driver PWA                | 13            | Driver sign in, Driver dashboard, Assignment list, Assignment detail, Route and map ...                     |
| Status and developer      | 5             | Public status page, Developer portal, API reference, API changelog, Sandbox access                          |

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>Total screen commitment<br />
</strong>77 public/authentication + 27 customer + 13 business + 52 administration + 14 warehouse + 13 driver + 5 status/developer = 201 screen templates. Appendix A lists every route, purpose and primary action.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 6.1 Main public navigation

| **Navigation item** | **Contents**                                                                | **Primary reason**                          |
|---------------------|-----------------------------------------------------------------------------|---------------------------------------------|
| Ship                | Get quote, book shipment, pickup/drop-off, packaging                        | Begin or prepare a shipment.                |
| Track               | Single tracking, batch tracking, tracking help                              | Find shipment status immediately.           |
| Services            | Air, parcel, documents, cargo, sea, pickup, customs, consolidation, returns | Understand the service catalogue.           |
| Customs             | Documents, duties, HS codes, prohibited and restricted categories           | Prevent border delays and undeclared goods. |
| Business            | Business benefits, registration, bulk shipping, rates, API                  | Convert organisations.                      |
| Support             | Help centre, contact, claims, returns, alerts                               | Resolve questions and exceptions.           |
| Utility actions     | English/Italian, sign in, Get a Quote                                       | Global access and conversion.               |

# 7. Brand and visual design system

The selected logo direction is a minimal navy sail with an orange wave and a horizontal Nauterio Logistics wordmark. It should be redrawn as a professional vector master before trademark registration and production printing. The visual system should feel trustworthy, direct and operational rather than decorative.

<img src="/mnt/data/Nauterio_Claude_Code_Skills_Kit/docs/spec-media/media/image1.png" style="width:6.5in;height:1.87778in" alt="Image: image1.png" />

*Figure 2. Clean specification rendering of the selected sail-and-wave logo direction.*

<img src="/mnt/data/Nauterio_Claude_Code_Skills_Kit/docs/spec-media/media/image3.png" style="width:7in;height:2.02222in" alt="Image: image3.png" />

*Figure 3. Approved colour system and usage roles.*

## 7.1 Colour rules

| **Token**     | **Hex**  | **Usage**                                                                                           |
|---------------|----------|-----------------------------------------------------------------------------------------------------|
| Primary navy  | \#081F3D | Logo, headers, navigation, primary text on light backgrounds and high-trust surfaces.               |
| Navy 800      | \#0B2E5E | Hover states, secondary dark surfaces and table headers.                                            |
| Brand blue    | \#123F7A | Links, information and secondary interactive emphasis.                                              |
| Action orange | \#F28C18 | Primary call-to-action highlight, active step and movement accent. Do not use for large text areas. |
| Orange dark   | \#D97706 | Accessible hover/pressed state for orange actions.                                                  |
| Ink           | \#0B1220 | Main body text.                                                                                     |
| Slate         | \#334155 | Secondary text and labels.                                                                          |
| Muted         | \#64748B | Metadata and low-emphasis text that still passes contrast requirements.                             |
| Mist          | \#F3F6FA | Section backgrounds, cards and empty states.                                                        |
| Success       | \#15803D | Completed/approved states with icon and text.                                                       |
| Warning       | \#B45309 | Action-required or delay states with icon and text.                                                 |
| Error         | \#B91C1C | Validation, failed or rejected states with explanation.                                             |
| Info          | \#1D4ED8 | Neutral information states.                                                                         |

## 7.2 Typography

| **Element**      | **Typeface**             | **Size guidance**                        | **Rule**                                                     |
|------------------|--------------------------|------------------------------------------|--------------------------------------------------------------|
| Display/hero     | Inter Display Bold       | 48-64 px desktop; 36-44 px mobile        | One clear message; avoid all caps.                           |
| H1               | Inter Display Bold       | 40-48 px desktop; 32-36 px mobile        | One H1 per page.                                             |
| H2               | Inter SemiBold           | 28-34 px                                 | Introduce major page sections.                               |
| H3               | Inter SemiBold           | 20-24 px                                 | Cards and subsections.                                       |
| Body             | Inter Regular            | 16-18 px public; 14-16 px dense staff UI | Minimum comfortable line height 1.5 public, 1.4 operational. |
| Labels           | Inter Medium             | 14-16 px                                 | Labels remain visible; do not rely on placeholder text.      |
| Metadata         | Inter Regular            | 12-14 px                                 | Use only where still readable and accessible.                |
| Tracking numbers | Inter/monospace fallback | 16-20 px                                 | Letter spacing and copy button; never break ambiguously.     |

## 7.3 Spacing, grid and breakpoints

- Use a 4-pixel base spacing scale: 4, 8, 12, 16, 24, 32, 48, 64 and 96 pixels.

- Public desktop content maximum width: 1,200 pixels; reading text maximum width: about 720 pixels.

- Desktop grid: 12 columns. Tablet: 8 columns. Mobile: 4 columns.

- Breakpoints: 360 px minimum supported width; 640 px small; 768 px tablet; 1024 px laptop; 1280 px desktop; 1536 px wide.

- Cards use 12-16 px radius; inputs/buttons 8-10 px; avoid excessive pill shapes.

- Primary buttons are navy or orange according to contrast and page hierarchy; one dominant action per section.

- Icons use one consistent outline family and always have text labels when meaning is not universally obvious.

## 7.4 Logo usage

- Primary horizontal logo for website header, documents, vehicles and signage.

- Icon-only sail/wave mark for favicon and app icon after legibility testing.

- Minimum clear space equals the height of the orange wave around all sides.

- Do not add glow, shadow, bevel, gradients, extra outlines, containers or unapproved taglines.

- Prepare full-colour, navy-only, white reverse and black-only vector variants.

- Do not place the full logo on visually busy photographs without a solid approved background.

# 8. Global navigation and reusable components

## 8.1 Header behaviour

- Desktop: logo left; six primary navigation items; language, sign in and Get a Quote right.

- Mobile: logo, tracking shortcut, account icon and menu. Get a Quote remains visible in the menu header or sticky action area.

- Header is sticky only when it does not cover form errors or reduce mobile usable height excessively.

- Logged-in portal navigation replaces marketing navigation with Dashboard, Shipments, Quotes, Pickups, Payments, Documents, Claims and Support.

- Admin, warehouse and driver applications have separate headers and must never reveal inaccessible public/customer controls.

## 8.2 Required component library

| **Component family** | **Required variants and behaviour**                                                                                             |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Buttons              | Primary, secondary, tertiary/link, destructive, loading, disabled and icon variants.                                            |
| Inputs               | Text, email, telephone, address, currency, measurement, date, time, select, autocomplete, checkbox, radio, file upload and OTP. |
| Tracking             | Tracking input, copyable ID, milestone timeline, status badge, exception card, ETA, location and proof block.                   |
| Cards                | Service, shipment, quote, invoice, support, action-required, empty-state and KPI cards.                                         |
| Tables               | Responsive data table, filters, sorting, pagination, bulk select, export and column controls.                                   |
| Feedback             | Inline validation, error summary, toast, banner, modal, confirmation and progress stepper.                                      |
| Documents            | Upload drop zone, scan state, version list, approval badge and secure download.                                                 |
| Navigation           | Breadcrumb, tabs, side navigation, pagination and back link.                                                                    |
| Operational          | Scanner input, offline badge, sync queue, assignment card, signature pad and photo capture.                                     |
| Privacy              | Cookie banner, preference centre, consent checkbox and sensitive-data reveal control.                                           |

## 8.3 Universal states

- Loading state shows what is loading and avoids layout jumps.

- Empty state explains why there is no data and provides the next meaningful action.

- Error state names the problem in plain language and preserves valid user input.

- Permission-denied state does not reveal whether inaccessible records exist.

- Provider-unavailable state separates Nauterio status from carrier/payment/messaging availability.

- Offline state shows queued actions and prevents high-risk offline changes.

- Success state states exactly what happened and gives a reference number or next step.

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

# 10. Customer portal

The customer portal is the authenticated workspace for individuals. It does not replace public tracking; it adds private details, history, payments, documents, claims, returns and support.

| **Portal area**   | **Key content**                                                                                  | **Main controls**                                   |
|-------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| Dashboard         | Active shipments, action-required items, next pickups, unpaid balances and recent notifications. | Track, upload, pay, create shipment.                |
| Shipments         | Search/filter by tracking, status, date, route and receiver.                                     | Open, repeat shipment, download permitted document. |
| Quotes            | Draft, pending review, issued, accepted and expired quotes.                                      | Accept, reject, ask question, create booking.       |
| Pickups           | Address, time window, package count and status.                                                  | Book, reschedule or cancel before cut-off.          |
| Payments/invoices | Charges, payment events, invoices, credit notes and receipts.                                    | Pay, download, contact billing.                     |
| Documents         | Customs/customer/generated files with status and version.                                        | Upload, replace when requested, secure download.    |
| Claims/returns    | Eligibility, evidence, progress, decisions and return tracking.                                  | Start, add evidence, appeal where allowed.          |
| Support           | Ticket list and conversation linked to shipment.                                                 | Create or reply; upload safe attachments.           |
| Profile/security  | Identity, language, time zone, passkeys/MFA, sessions and consent.                               | Update, revoke session, manage preferences.         |

## 10.1 Customer dashboard exact order

42. Action-required banner, if any.

43. Greeting and New Shipment/Get Quote actions.

44. Active shipments with status, ETA and next action.

45. Upcoming pickup or delivery cards.

46. Unpaid or customs charges.

47. Recent documents and invoices.

48. Recent support/claim updates.

49. Helpful route/customs guidance based on active shipments.

# 11. Business portal

The business portal extends the customer experience with organisation ownership, multiple users, bulk processing, negotiated rates, credit, reporting and integrations.

- Every business user has an individual login and organisation role; no shared corporate password.

- Organisation administrators can invite and suspend users but cannot grant permissions beyond the organisation’s contract.

- Bulk imports use a downloadable template, validation preview, row-level errors, duplicate detection and an approval step.

- Contract rate pages show effective dates, eligible routes/services, surcharge treatment and exclusions.

- Statements show opening balance, invoices, payments, credit notes, closing balance, credit limit and overdue amount.

- API keys are scoped, named, shown once, rotatable and revocable. Webhook endpoints are signed and display delivery attempts.

- Reports include shipment volume, cost, service, destination, delivery performance, customs exceptions and claims.

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

# 13. Warehouse PWA

The warehouse application must favour scanning, large touch controls and explicit confirmation. It operates as a PWA so an approved Android device can install it without waiting for native app-store releases.

50. Sign in with MFA and choose/confirm the facility.

51. Scan shipment or package. Manual entry is the fallback, not the default.

52. Confirm expected package count and physical custody.

53. Inspect exterior condition and answer controlled-goods questions.

54. Capture actual weight and dimensions; record equipment/manual source.

55. Take required photos: all sides where needed, label, packaging concern and damage.

56. Assign storage location or exception queue.

57. Move, consolidate, repack or dispatch only through scan-confirmed workflows.

58. Offline actions show as unsynchronised until the server accepts them.

59. Every correction records employee, before/after value, time and reason.

## 13.1 Warehouse hardware baseline

| **Equipment**   | **Minimum requirement**                                                                                                                   |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Handheld        | Android 12+, integrated 2D barcode scanner, camera, Wi-Fi, optional mobile data, long-life battery, IP65 or better and device management. |
| Thermal printer | 4 x 6 inch labels, ZPL, network and USB, 203 or 300 dpi.                                                                                  |
| Scale           | Commercially suitable and calibrated for the accepted package weight range.                                                               |
| Workstation     | 8 GB RAM minimum, modern browser, stable network and controlled user account.                                                             |
| Connectivity    | Reliable warehouse Wi-Fi, backup mobile connection and UPS power for critical network/printer equipment.                                  |

# 14. Driver PWA

- Driver sees only assigned jobs and an operationally ordered list.

- Contact details are limited and may be masked; the system logs contact actions where available.

- Pickup requires package scan/count, condition confirmation and custody evidence.

- Delivery enforces the service’s proof rule: recipient name, signature, photo, one-time code or approved combination.

- Failed attempt uses controlled reasons such as recipient unavailable, inaccessible address, refused, incorrect address or unsafe condition.

- The driver cannot mark a package delivered without required proof unless an authorised exception is recorded.

- Offline captures preserve original time and location, display pending sync and resolve conflicts safely.

- Exact live route location is not exposed publicly.

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

# 16. Customs, restricted goods and documents

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>Legal boundary<br />
</strong>The platform can guide, validate and coordinate documents, but it is not a substitute for a licensed customs broker or legal advice. Final import/export responsibilities, importer-of-record model and DDP/DAP use require professional approval.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 16.1 Required customs data

- Detailed plain-language item description, quantity, unit and total value, currency, country of origin, intended use and HS code where known.

- Sender, receiver and importer details; commercial invoice and packing list for commercial shipments.

- Supporting licences/certificates for controlled categories.

- Battery, liquid, food, medicine, chemical, perishable and high-value screening answers.

- Customer declaration that contents and value are complete and accurate.

## 16.2 Prohibited and restricted handling

| **Category**                                                                                     | **Platform treatment**                                                                                                     |
|--------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Illegal drugs, illegal weapons, explosives, stolen/counterfeit goods and items prohibited by law | Block booking and refer to policy; preserve required incident information and escalate according to law.                   |
| Batteries and battery-powered equipment                                                          | Require battery type/configuration questions and compliance review; IATA guidance applies to air transport \[L6\].         |
| Food, plants, seeds, meat, dairy and animal products                                             | Require pre-approval and relevant US agency/customs guidance; CBP lists many agricultural categories as restricted \[L4\]. |
| Medicines and medical devices                                                                    | Require regulatory and prescription/commercial review; do not offer automatic acceptance.                                  |
| Alcohol, tobacco, chemicals, aerosols, perfume and paint                                         | Require service/carrier and legal approval; block automatic booking.                                                       |
| High-value jewellery, precious metal, artwork and antiques                                       | Require value, provenance, insurer/carrier approval and enhanced proof.                                                    |
| Dangerous, perishable, temperature-controlled or live goods                                      | Not available at launch unless a specialist approved service is configured.                                                |

## 16.3 Document lifecycle

60. Customer uploads through a private controlled channel.

61. System validates extension, content signature, size and malware scan \[Q3\].

62. Document receives type, owner, shipment, version and review status.

63. Customs/operations reviewer approves, rejects or requests replacement with a reason.

64. Approved file is provided to the authorised carrier/broker through the integration or controlled download.

65. Views/downloads of sensitive documents are logged where required.

66. Retention/lifecycle rules archive or delete the object after the approved period.

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

# 18. Content, legal, privacy and accessibility

## 18.1 Required content ownership

| **Content**                             | **Owner**                  | **Approval**                                            |
|-----------------------------------------|----------------------------|---------------------------------------------------------|
| Services, transit guidance and coverage | Operations                 | Operations manager and Product Owner                    |
| Prices, surcharges and promotions       | Finance/Pricing            | Finance approver and Product Owner                      |
| Customs and restricted goods            | Compliance/Customs         | Customs adviser or broker and legal review where needed |
| Privacy, cookies and terms              | Legal/Privacy              | Qualified Italian legal adviser                         |
| Claims, refunds and carriage limits     | Legal/Operations/Insurance | Legal adviser and insurer/carrier contract owner        |
| Service alerts                          | Operations                 | Named incident/operations approver                      |
| Blog/resources                          | Content                    | Subject owner verifies facts and sources                |
| Testimonials                            | Marketing                  | Proof of genuine source and consent                     |

## 18.2 Legal page set

- Terms and Conditions; Privacy Policy; Cookie Policy; Claims Policy; Refund and Cancellation Policy; Prohibited and Restricted Items Policy; Customs and Duties Disclaimer; Delivery Policy; Storage and Abandoned Goods Policy; Acceptable Use Policy; Business Account Terms; API Terms and Data Processing information.

- The public legal hub may use one reusable policy template, but each policy remains separately addressable, versioned and printable.

- Policy changes store effective date and consent/reacceptance requirement.

## 18.3 Privacy requirements

- Process only data needed for quote, shipment, customs, payment, delivery, support, legal and security purposes \[L2\].

- Provide rights/request functions for access, correction, deletion where allowed, restriction and portability.

- Non-essential analytics/marketing technologies do not load until valid consent; necessary cookies remain limited to operation, preferences and security \[L3\].

- Use data processing agreements and transfer safeguards for external processors.

- Do not expose full addresses, phones, documents or declared values on public tracking.

## 18.4 Accessibility requirements

- Target WCAG 2.2 Level AA \[Q1\].

- All functions work by keyboard and have visible focus.

- Inputs have persistent labels, instructions and programmatic error relationships.

- Error summary links to invalid fields and preserves valid data.

- Status uses text and icon, never colour alone.

- Images have useful alternative text; decorative images are ignored by assistive technology.

- Tables have headings and responsive alternatives; operational data remains understandable on mobile.

- Signature and upload workflows provide alternatives where disability prevents the standard method.

- Motion is limited and respects reduced-motion preferences.

# 19. Analytics, reporting and success measures

## 19.1 Customer funnel events

- Homepage primary action; tracking search/success/error; quote start/complete/manual review; account registration/verification; booking step completion; payment success/failure; pickup booked; shipment created; support escalation.

- Analytics must not record raw address, item description, tracking number, payment detail or uploaded-file contents.

## 19.2 Operational KPIs

| **KPI**                      | **Definition**                                                        |
|------------------------------|-----------------------------------------------------------------------|
| Quote conversion             | Accepted quotes divided by issued eligible quotes.                    |
| Booking completion           | Completed bookings divided by started bookings.                       |
| First-pass document approval | Documents approved without replacement divided by reviewed documents. |
| Warehouse dwell time         | Time from receipt to dispatch, separated by service and exception.    |
| On-time milestone rate       | Milestones achieved within the configured service target.             |
| Delivery success             | Delivered without failed attempt divided by attempted deliveries.     |
| Claim rate                   | Claims per delivered shipment by type, service and partner.           |
| Support self-service         | Tracking/help sessions that do not create a ticket.                   |
| Payment reconciliation age   | Time between payment provider/bank event and full allocation.         |
| Data quality                 | Address, measurement, commodity and customs error rates.              |

**PART II**

**Technical Architecture and Implementation**

> This part converts the business and screen requirements into an exact technology, data, security, integration, testing and delivery specification.

**Nauterio Logistics**

# 20. Approved technology stack

| **Layer**              | **Approved choice**                              | **Reason and implementation rule**                                                                                            |
|------------------------|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| Language               | TypeScript                                       | One language across web, API, workers, shared contracts and infrastructure; strong type checking and AI-friendly consistency. |
| Runtime                | Node.js 24 LTS                                   | Use the active LTS line at specification date \[T1\]. Pin exact patch in containers and update through controlled releases.   |
| Public/customer web    | Next.js 16.3                                     | Server rendering, App Router, internationalisation, responsive UI and PWA assets \[T2\].                                      |
| Administration web     | Separate Next.js 16.3 application                | Security and deployment separation from public/customer interfaces.                                                           |
| API                    | NestJS 11                                        | Modular TypeScript REST service, validation, dependency injection, OpenAPI and webhook endpoints \[T3\].                      |
| Database               | PostgreSQL 18 on Amazon RDS                      | Relational transactions, constraints, JSON where justified, robust indexing and managed recovery \[T4\].                      |
| ORM/data access        | Prisma ORM 7 plus reviewed SQL                   | Type-safe access and migrations; parameterised SQL for complex reporting when necessary \[T5\].                               |
| Architecture           | Modular monolith with event-driven workers       | Avoid premature microservices while keeping clear module boundaries.                                                          |
| Containers             | Docker on Amazon ECS Fargate                     | Separate web, admin, API and worker services without managing servers \[T7\].                                                 |
| Queues                 | Amazon SQS                                       | Asynchronous jobs, retries, dead-letter queues and workload isolation.                                                        |
| Cache/locks            | Amazon ElastiCache Serverless for Valkey         | Rate-limit counters, short-lived cache and distributed locks; never source-of-truth records.                                  |
| Files                  | Amazon S3 with KMS                               | Private objects, lifecycle, versioning, signed access and replication.                                                        |
| Identity               | Amazon Cognito User Pools                        | Email verification, password/passkey, MFA, token/session management; application roles remain in PostgreSQL.                  |
| Payments               | Stripe primary; PayPal secondary                 | Hosted/controlled payment surfaces, verified webhooks and idempotency \[T8\].                                                 |
| Maps/address           | Google Maps Platform                             | Address Validation, Places, geocoding and route launch \[T9\].                                                                |
| Messaging              | Amazon SES + Twilio                              | Transactional email, SMS and WhatsApp; verify provider webhooks \[T10\].                                                      |
| Support                | Zendesk Support and Messaging                    | Mature ticket/chat workspace rather than building custom chat \[T11\].                                                        |
| Infrastructure as code | AWS CDK v2 in TypeScript                         | Versioned, reproducible AWS environments.                                                                                     |
| CI/CD                  | GitHub Actions                                   | Build, test, scan, container publish and controlled environment deployments.                                                  |
| Observability          | OpenTelemetry + CloudWatch/CloudTrail            | Structured logs, metrics, traces, audit and alarms.                                                                           |
| Testing                | Jest, React Testing Library, Playwright, k6, axe | Unit, integration, component, end-to-end, load and accessibility coverage.                                                    |
| Package/repository     | pnpm monorepo in company GitHub organisation     | Shared packages without duplicate definitions and company ownership.                                                          |

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>Version policy<br />
</strong>The major stack choices are fixed for the first build. Exact patch versions must be pinned in the lockfile and container images. Before development begins, the technical lead must verify current security releases and compatibility; version upgrades require staging tests, migration notes and rollback instructions.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 20.1 Why a modular monolith

- Shipment, package, quote, payment, customs and claim transactions require strong consistency and are easier to reason about inside one deployable API boundary.

- A small team can develop, test and operate it without the network, deployment and tracing burden of many microservices.

- Clear modules, events, queues and database ownership rules preserve a future extraction path if volume or organisation boundaries justify it.

- Carrier, payment, notification and document work still runs asynchronously so external outages do not block normal requests.

# 21. System architecture

<img src="/mnt/data/Nauterio_Claude_Code_Skills_Kit/docs/spec-media/media/image5.png" style="width:7in;height:4.83333in" alt="Image: image5.png" />

*Figure 5. Production architecture. External providers connect through adapters and signed webhook endpoints.*

## 21.1 Request path

67. The customer resolves the company .com domain through Route 53.

68. CloudFront terminates public delivery, caches safe static content and forwards dynamic traffic through AWS WAF.

69. Application Load Balancer sends requests to healthy ECS Fargate services in private subnets.

70. Cognito authenticates users; the API validates tokens and retrieves Nauterio roles/organisation/warehouse context.

71. NestJS applies validation, permission checks and database transactions.

72. Long-running work is written through the transactional outbox and delivered to SQS workers.

73. Files use pre-signed upload/download flows into private S3 after policy checks.

74. Logs, metrics and traces carry a correlation ID across web, API, worker and provider callback.

## 21.2 Source-of-truth boundaries

| **Information**                                   | **System of record**                                                                                           |
|---------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| Customer/organisation and application permissions | Nauterio PostgreSQL; Cognito stores identity authentication attributes.                                        |
| Shipments, packages and Nauterio tracking events  | Nauterio PostgreSQL.                                                                                           |
| External carrier event                            | Raw provider payload retained securely; mapped public/operational event stored in PostgreSQL.                  |
| Payment transaction                               | Payment provider is authoritative for provider status; Nauterio stores verified event and business allocation. |
| Support conversation                              | Zendesk is conversation record; Nauterio stores ticket ID and operational linkage.                             |
| Uploaded/generated document                       | S3 object; PostgreSQL stores metadata, access and review state.                                                |
| Financial invoice                                 | Nauterio billing record plus approved Italian accounting/e-invoicing provider result.                          |
| Audit/security activity                           | Append-only application audit plus CloudTrail/security logs.                                                   |

# 22. Domains, environments and AWS infrastructure

## 22.1 Domain and subdomains

| **Address**            | **Purpose**                                                | **Indexing**                                   |
|------------------------|------------------------------------------------------------|------------------------------------------------|
| www.\<company\>.com    | Public marketing, quote, booking, tracking, help and legal | Public pages indexed; tracking results noindex |
| app.\<company\>.com    | Customer and business portal                               | Noindex; authenticated                         |
| admin.\<company\>.com  | Administration dashboard                                   | Noindex; staff only                            |
| api.\<company\>.com    | REST API and provider callbacks                            | Noindex; API controls                          |
| docs.\<company\>.com   | Approved API reference and integration guides              | Public or partner-restricted according to page |
| status.\<company\>.com | Independently hosted status page                           | Public                                         |
| assets.\<company\>.com | Approved public assets only                                | Controlled caching; never private files        |

## 22.2 AWS organisation and accounts

- Company-owned AWS Organisation with separate management, security/log archive, shared services, non-production and production accounts.

- AWS root users protected by hardware/passkey MFA, recovery controls and no daily use.

- Least-privilege IAM roles with identity federation for developers and operators; no long-lived personal access keys where avoidable.

- AWS CloudTrail organisation trail, AWS Config, GuardDuty and Security Hub aggregated into the security account.

- Budgets and anomaly alerts by account, environment and major service.

## 22.3 Network design

- Production VPC spans at least three Availability Zones in Milan where supported.

- Public subnets contain only load-balancing/NAT components; ECS tasks, database, cache and internal services use private subnets.

- RDS and ElastiCache are not publicly reachable.

- Security groups allow only required service-to-service flows.

- VPC endpoints for S3, SQS, ECR, CloudWatch and other justified AWS services reduce public network exposure.

- Outbound internet from workers/API is controlled for approved provider endpoints and monitored.

## 22.4 Environments

| **Environment** | **Purpose**                                            | **Data**                               | **Deployment**                                                   |
|-----------------|--------------------------------------------------------|----------------------------------------|------------------------------------------------------------------|
| Local           | Developer feature work and tests                       | Synthetic fixtures only                | Developer-controlled containers/tools                            |
| Development     | Shared integration and early QA                        | Generated data; provider sandboxes     | Automatic from approved development branch or ephemeral workflow |
| Preview         | Optional pull-request interface review                 | Generated minimal data                 | Temporary, no production secrets                                 |
| Test            | Automated end-to-end and integration                   | Repeatable fixtures                    | CI-managed                                                       |
| Staging         | Production-like acceptance, load and release rehearsal | Synthetic/anonymised; provider sandbox | Same infrastructure pattern as production                        |
| Production      | Live company operations                                | Real controlled data                   | Protected approval and release process                           |

## 22.5 Compute and scaling

- ECS Fargate services: web, admin, API and worker. Each has independent CPU, memory, scaling and deployment.

- Minimum two running tasks for critical web/API services across Availability Zones after pilot.

- Auto-scale on CPU/memory, request count/latency and SQS queue depth as appropriate.

- Use blue/green or rolling deployment with health checks and automatic rollback on failed alarms.

- Scheduled jobs run as controlled ECS tasks or event-triggered workers; avoid an unmanaged cron server.

# 23. Application and repository organisation

## 23.1 Monorepo structure

apps/  
web/ \# public + customer/business portal  
admin/ \# staff administration  
api/ \# NestJS REST API and webhooks  
worker/ \# SQS consumers and scheduled tasks  
packages/  
database/ \# Prisma schema, migrations, query helpers  
contracts/ \# shared API DTOs, events and enums  
ui/ \# approved component library and design tokens  
validation/ \# shared schemas and business validation  
integrations/ \# carrier/payment/messaging adapters  
configuration/ \# typed environment configuration  
observability/ \# logging, metrics, tracing helpers  
testing/ \# fixtures, factories and test utilities  
infra/  
cdk/ \# AWS infrastructure stacks  
docs/  
adr/ \# architecture decision records  
operations/ \# runbooks and support procedures

## 23.2 Code rules

- Strict TypeScript; no implicit any; runtime validation at all external and API boundaries.

- Shared enums/contracts come from one package; do not duplicate tracking statuses or money fields in multiple applications.

- Business logic belongs in domain/application services, not React components or controller methods.

- Database transactions protect multi-record business changes; external network calls do not occur inside long database transactions.

- All provider integrations are behind typed adapters and can be disabled or replaced without changing core shipment logic.

- Money uses integer minor units plus ISO currency; never floating-point totals.

- Measurements store value and unit; normalised comparison values may be stored separately.

- Dates/times are stored in UTC with source timezone/offset metadata when an external/local event is involved.

- Every log includes environment, service, correlation ID and safe identifiers; secrets/PII are redacted.

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

# 25. Database and data model

## 25.1 Core entity catalogue

| **Entity**                        | **Purpose**                                                                         |
|-----------------------------------|-------------------------------------------------------------------------------------|
| User                              | Application user linked to Cognito identity; status, profile and security metadata. |
| Organisation                      | Verified business account; legal, billing, credit and contract data.                |
| OrganisationMember                | User membership, role, status and approval limits.                                  |
| Address                           | Versioned validated address with provider result and customer confirmation.         |
| Contact                           | Sender/receiver contact linked to user/organisation where appropriate.              |
| Service                           | Air/parcel/freight operational service and eligibility.                             |
| Route                             | Origin/destination countries/zones, active dates, service and coverage.             |
| RateCard/RateRule                 | Versioned calculation rules, breaks, minimums and effective dates.                  |
| Quote/QuoteLine                   | Input snapshot, calculated line items, approvals, currency and expiry.              |
| Booking/Draft                     | Step progress, saved inputs and conversion state.                                   |
| Shipment                          | Master business movement, parties, route, service, timing and lifecycle.            |
| Package                           | Physical handling unit, dimensions, weight, condition, label and current location.  |
| ShipmentItem                      | Declared customs commodity and value details.                                       |
| TrackingEvent                     | Canonical event, source, public/internal text, location, time and evidence.         |
| ExternalTrackingEvent             | Raw provider event and deduplication key.                                           |
| Pickup/Delivery                   | Assignment, time window, attempts, evidence and status.                             |
| Warehouse/StorageLocation         | Facility and hierarchical zone/shelf/bin.                                           |
| PackageMovement                   | Scan-confirmed custody/storage movement.                                            |
| Manifest/ManifestItem             | Dispatch batch, carrier/service and included packages.                              |
| CustomsCase                       | Import/export case, action, deadline, broker and outcome.                           |
| Document/DocumentVersion          | Metadata, object key, scan/review status, retention and access.                     |
| Charge/Invoice/InvoiceLine        | Financial obligation and issued billing record.                                     |
| Payment/PaymentEvent/Allocation   | Provider/bank event and allocation to obligations.                                  |
| Refund                            | Approved return of funds and provider result.                                       |
| Claim/ClaimEvidence/ClaimDecision | Claim lifecycle, supporting evidence and outcome.                                   |
| Return                            | Return request and linked return shipment.                                          |
| SupportLink                       | Zendesk ticket linkage and operational escalation state.                            |
| Notification/DeliveryAttempt      | Rendered communication and provider delivery result.                                |
| ContentPage/PolicyVersion         | Versioned public content and approval/effective state.                              |
| AuditEvent                        | Append-only sensitive/business activity.                                            |
| OutboxEvent/InboxEvent            | Reliable internal event publication and provider event deduplication.               |
| ApiClient/ApiKey/WebhookEndpoint  | Business/partner integration identity, scopes and delivery state.                   |

## 25.2 Shipment fields

| **Group**     | **Required fields**                                                                                     |
|---------------|---------------------------------------------------------------------------------------------------------|
| Identity      | UUIDv7 ID; public tracking number; customer reference; carrier references; organisation/customer owner. |
| Parties       | Sender and receiver snapshot; importer/consignee roles; billing party; contact verification.            |
| Service/route | Service, route, origin/destination zones, pickup/drop-off, delivery mode, carrier/partner.              |
| Physical      | Package count, total actual/volumetric/chargeable weight, volume, handling indicators.                  |
| Customs       | Purpose, declared value/currency, duty payer model, item list, document readiness, customs case.        |
| Timing        | Created, pickup target, dispatch target, estimated delivery range, delivered time and timezone context. |
| Lifecycle     | Internal status, public status, action-required reason, cancellation/archive state.                     |
| Financial     | Quote snapshot, charges, invoice/payment state, outstanding amount.                                     |
| Control       | Created/updated by, source, version, risk flags and legal hold.                                         |

## 25.3 Tracking event fields

| **Field**                     | **Rule**                                                                          |
|-------------------------------|-----------------------------------------------------------------------------------|
| id                            | UUIDv7; immutable.                                                                |
| shipmentId/packageId          | At least shipment; package when event is package-specific.                        |
| canonicalCode                 | One of the approved status catalogue values.                                      |
| publicTitle/publicDescription | Approved English and Italian customer wording.                                    |
| internalDescription           | Operational detail; never exposed automatically.                                  |
| sourceType/sourceId           | Staff, warehouse scan, driver, carrier API, partner webhook or system automation. |
| sourceEventId/dedupKey        | Prevents duplicate provider or offline events.                                    |
| eventTime/sourceTimezone      | When the event actually occurred and its original timezone context.               |
| receivedTime                  | When Nauterio received/synchronised it.                                           |
| location                      | Structured country/region/city/facility; public precision controlled separately.  |
| visibility                    | Internal, authenticated customer, public or restricted proof.                     |
| evidenceDocumentId            | Optional photo/signature/document reference.                                      |
| correctionOfId                | Links correction/reversal without deleting original.                              |
| actor/reason                  | Required for manual/correction events.                                            |
| notificationState             | Whether customer notification is eligible, queued, sent or suppressed.            |

## 25.4 Database constraints and indexes

- Unique normalised public tracking number and package number.

- Unique provider event key by provider/account/event identifier.

- Foreign keys with explicit delete policy; operational records normally restrict deletion.

- Check constraints for non-negative money, measurement and count values.

- Currency uses three-letter ISO code and integer minor units.

- Partial/indexed searches on active shipment status, tracking number, carrier reference, customer/organisation, pickup date, customs action deadline and unpaid invoice.

- Tracking events indexed by shipment and event time; public timeline uses stable deterministic order.

- Audit/outbox tables are append-only from normal application permissions.

- Optimistic version field for records likely to be concurrently edited.

# 26. API and webhook specification

## 26.1 API conventions

- Base URL https://api.\<company\>.com/v1/. JSON over HTTPS only.

- OpenAPI-generated reference; examples in English; error messages localised in UI rather than exposing internal stack details.

- OAuth 2.0/Cognito tokens for user APIs; scoped API keys or OAuth client credentials for approved business/partner integrations.

- Cursor pagination for high-volume lists; explicit sort/filter parameters.

- Idempotency-Key required for create/financial/booking operations that may be retried.

- Correlation ID accepted/generated and returned in response headers.

- Structured error shape: code, user-safe message, field errors, correlation ID and retry guidance.

- Rate limits vary by identity and endpoint; public tracking has anti-enumeration and abuse protections.

- Deprecations have documentation, response warning/header and published removal date.

| **Endpoint group** | **Scope**                                                                                         |
|--------------------|---------------------------------------------------------------------------------------------------|
| Identity/profile   | GET/PATCH /me; sessions, preferences and organisation context.                                    |
| Rates/quotes       | POST /rates; POST/GET /quotes; accept, reject and revise actions.                                 |
| Shipments          | POST/GET/PATCH permitted drafts; shipment retrieval and approved actions.                         |
| Packages/labels    | Package retrieval; label generation/retrieval; no arbitrary public object access.                 |
| Tracking           | Public controlled lookup; authenticated detail; business batch tracking.                          |
| Pickups/deliveries | Create/reschedule/cancel under rules; assignment endpoints for operational apps.                  |
| Documents          | Create upload intent; confirm upload; metadata; review/action; signed download.                   |
| Payments/invoices  | Create hosted payment; retrieve status; invoices/receipts; refund requests.                       |
| Claims/returns     | Eligibility, create, evidence, progress and authorised decisions.                                 |
| Business           | Organisation users, bulk imports, templates, reports, API clients and webhooks.                   |
| Admin              | Role-protected operational resources; every high-risk action audited.                             |
| Providers          | Dedicated signed webhook endpoints for Stripe, Twilio, carriers, support/accounting where needed. |

## 26.2 Webhook delivery to business customers

- Supported initial events: shipment.created, shipment.status_changed, shipment.action_required, shipment.delivered, document.requested, invoice.issued, payment.confirmed and claim.updated.

- Payload contains event ID, type, version, occurred time, object reference and minimal approved data.

- Sign using rotating secret and timestamped HMAC; document verification algorithm.

- Retry with exponential backoff; show attempts and final failure in business portal.

- Consumers deduplicate by event ID; Nauterio supports replay by authorised user.

- Endpoint validation and test event occur before activation.

# 27. Authentication, authorisation and audit

## 27.1 Customer authentication

- Email/password and passkey support; email verification required before sensitive actions.

- Optional authenticator MFA for individuals; mandatory for organisation administrators handling API/credit where configured.

- Password reset uses short-lived single-use tokens and does not reveal account existence unnecessarily.

- Session list and revocation in profile; sensitive changes require recent authentication.

- Public tracking remains available with masked information; sensitive proof requires login or approved secondary verification.

## 27.2 Staff authentication

- Mandatory MFA or passkey; short session; reauthentication for refunds, role changes, exports, identity documents and integration settings.

- Staff user status, role, warehouses, approval limit and effective dates stored in Nauterio database.

- IP/device risk may trigger step-up or block; no permanent broad allow-list that prevents legitimate field work without a fallback process.

- Joiner/mover/leaver workflow requires manager and security/administrator action; access reviewed quarterly.

## 27.3 Permission evaluation

Every server action evaluates identity, account status, global role, organisation membership, warehouse/assignment scope, record relationship, requested operation, approval limit and any separation-of-duties rule. Hiding a button in the interface is not permission enforcement.

## 27.4 Audit event requirements

- Record actor, action, entity, before/after values or safe diff, time, correlation ID, IP/device where appropriate, reason and approval reference.

- Audit login failures, shipment/tracking/address/measurement changes, price overrides, quote approvals, payment/refund/claim decisions, sensitive file access, role changes, exports, retention actions and integration settings.

- Audit data is append-only to application users and separated from ordinary operational editing.

- Sensitive values may be hashed/redacted in the log while preserving evidence of change.

# 28. Files, labels, barcodes and generated documents

## 28.1 Secure upload flow

75. Client asks API for an upload intent with document type, expected size and related shipment/case.

76. API checks permission, allowed type/count and creates a short-lived pre-signed S3 upload.

77. Client uploads directly to private quarantine storage.

78. Worker validates actual file signature, type, size, image/PDF safety and malware result.

79. Safe file moves/logically promotes to protected storage; unsafe file is quarantined and never delivered.

80. Metadata/version and review task are created; user sees Processing, Approved, Rejected or Replacement Required.

81. Downloads use short-lived signed URLs after a fresh permission check; public URLs are prohibited.

## 28.2 Label specification

| **Item**         | **Requirement**                                                                                     |
|------------------|-----------------------------------------------------------------------------------------------------|
| Size             | 4 x 6 inches / approximately 102 x 152 mm; direct thermal.                                          |
| Printer language | ZPL-compatible; PDF fallback for office printing.                                                   |
| Resolution       | 203 dpi baseline; 300 dpi supported.                                                                |
| Identifiers      | Human-readable master/package number, Code 128 barcode and QR tracking link.                        |
| Routing          | Origin/destination/warehouse route codes and service level.                                         |
| Package context  | Sequence such as 2 of 4, weight and handling marks.                                                 |
| Privacy          | Only limited receiver information; no declared value or item detail in QR.                          |
| Reprint          | Reprint reason, staff, time and printer recorded; original identity remains unchanged.              |
| Carrier label    | Stored separately and printed according to carrier API contract; never overwrite Nauterio identity. |

## 28.3 Generated documents

- Quote, booking confirmation, Nauterio label, pickup receipt, invoice, receipt, customs request, proof of delivery, claim acknowledgement, credit note, refund confirmation and return label where applicable.

- Templates are versioned; generated file records template version, locale, source data snapshot, generator and hash.

- Documents use server-side rendering in a worker and are stored privately; emails send secure links or approved attachments.

# 29. Events, queues, caching and scheduled work

## 29.1 Transactional outbox pattern

When a business transaction and an asynchronous event must occur together, the API writes the domain change and an outbox record in the same PostgreSQL transaction. A publisher sends the outbox event to SQS and marks delivery. This prevents payment, tracking or notification work from being lost between database commit and queue publication.

| **Queue/job**          | **Responsibility**                                                      |
|------------------------|-------------------------------------------------------------------------|
| carrier-events         | Normalise and map carrier/provider shipment events.                     |
| notifications-email    | Render and send transactional email.                                    |
| notifications-sms      | Send SMS and process delivery callbacks.                                |
| notifications-whatsapp | Send approved WhatsApp templates/messages.                              |
| documents-scan         | Validate and malware-scan new uploads.                                  |
| documents-generate     | Generate labels, invoices, receipts and proofs.                         |
| imports                | Validate and commit business bulk imports.                              |
| reports                | Generate large exports and scheduled reports.                           |
| webhooks-outbound      | Deliver signed events to business/partner endpoints.                    |
| reconciliation         | Poll/reconcile transitional provider states when callbacks are missing. |
| retention              | Archive/anonymise/delete according to policy and legal holds.           |

## 29.2 Queue rules

- Every message has event/job ID, type/version, correlation ID, created time and safe object references.

- Consumers are idempotent and record processed inbox keys.

- Retry only transient failures; validation/business failures go to controlled review rather than endless retry.

- Dead-letter queues alarm immediately when important jobs arrive.

- Large payloads/files remain in S3/database; queue carries references, not sensitive large objects.

- Visibility timeout exceeds normal processing and is extended for controlled long jobs.

## 29.3 Cache rules

- Cache public content, service configuration and safe tracking query fragments only when invalidation is understood.

- Use Valkey for rate-limit counters, one-time workflow state, short locks and selected short-lived results.

- Payments, shipment status and permissions are always confirmed against authoritative storage before high-risk action.

- Cache keys include environment and tenant/scope; personal data has short TTL and is minimised.

# 30. External integrations

| **Integration**        | **Functions**                                                         | **Technical rules**                                                                                                     |
|------------------------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| DHL/FedEx/UPS/EasyPost | Rates where contracted, shipment/label creation, pickup and tracking. | Adapter per provider; sandbox and production accounts; map events; preserve raw payload; idempotency; fallback polling. |
| Sea freight partner    | Schedules, quote/booking, amendments, milestones and documents.       | API/webhook preferred; otherwise SFTP/controlled CSV with reconciliation and provenance.                                |
| Customs broker         | Case, document, query, charge and release exchange.                   | API/webhook or secure portal/import; deadlines and responsible person recorded.                                         |
| Stripe                 | Hosted payments, refunds, disputes and payment events.                | Signature verification, idempotent event processing and separate test/live secrets \[T8\].                              |
| PayPal                 | Optional payment method for approved markets.                         | Separate provider adapter and reconciliation.                                                                           |
| Google Maps            | Address validation, places, geocoding and navigation launch.          | Store provider result and customer-confirmed exception; control cost and key restrictions \[T9\].                       |
| Twilio                 | SMS and WhatsApp send/receive/status.                                 | Approved sender, templates, opt-outs, HTTPS and signature validation \[T10\].                                           |
| Amazon SES             | Transactional email.                                                  | SPF, DKIM, DMARC, bounce/complaint handling and suppression.                                                            |
| Zendesk                | Messaging and support tickets.                                        | Customer/shipment context and ticket ID; least-data transfer \[T11\].                                                   |
| Accounting/e-invoicing | Invoice/credit note transmission and accounting result.               | Provider selected with Italian accountant; reconciliation and immutable references.                                     |

## 30.1 Adapter contract

- Typed provider-neutral request/response interfaces.

- Provider account/configuration identified without exposing secrets to logs or UI.

- Timeout, retry, circuit-breaker and rate-limit behaviour.

- Raw request/response storage only when legally and operationally justified; redact secrets/PII.

- Error mapping into retryable, customer-action, staff-action and permanent categories.

- Health status and last successful operation visible to administrators.

- Contract tests and recorded/synthetic fixtures; never rely only on live production testing.

# 31. Security engineering

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>Security baseline<br />
</strong>Use OWASP ASVS Level 2 as the development and acceptance baseline [Q2]. A qualified independent penetration test is required before public launch and at least annually or after major security-sensitive changes.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

| **Control area** | **Mandatory approach**                                                                                                                                                                                 |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Threat modelling | Model account takeover, tracking enumeration, address/document exposure, payment fraud, malicious upload, staff misuse, webhook forgery, API abuse, offline device loss and carrier data manipulation. |
| Input/output     | Runtime validation, allow-lists, contextual encoding, safe database parameters and no raw error traces.                                                                                                |
| Authentication   | Cognito, verified email, strong recovery, MFA/passkeys, session revocation and step-up for high-risk actions.                                                                                          |
| Authorisation    | Server-side RBAC/relationship/scope checks on every request and object; deny by default.                                                                                                               |
| Secrets          | AWS Secrets Manager/SSM; rotation; no secrets in repository, client bundles, images or logs.                                                                                                           |
| Encryption       | TLS in transit; KMS-managed encryption for database snapshots, S3, queues where applicable and secrets.                                                                                                |
| File upload      | Private quarantine, signature/type/size validation, malware scan, no executable delivery and short-lived access \[Q3\].                                                                                |
| Payments         | Hosted provider surface; verified webhooks; no full card storage; controlled refund permissions.                                                                                                       |
| Webhooks         | HTTPS, signature/timestamp verification, replay protection, idempotency and endpoint isolation.                                                                                                        |
| Abuse            | WAF, rate limits, bot controls, tracking anti-enumeration, CAPTCHA only where risk justifies it and fraud monitoring.                                                                                  |
| Dependencies     | Lockfile, automated vulnerability/license scanning, SBOM and patch policy.                                                                                                                             |
| Containers       | Minimal non-root images, read-only where practical, image scanning and signed/provenance-aware releases.                                                                                               |
| Audit/monitoring | Append-only business audit, CloudTrail, alerts and incident runbooks.                                                                                                                                  |
| Backups          | Encrypted, separate-region copies, restricted restore and tested recovery.                                                                                                                             |

## 31.1 Data classification

| **Class**         | **Examples**                                                                                    | **Handling**                                                                      |
|-------------------|-------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| Public            | Published service pages, approved alerts and public assets                                      | May be cached and indexed according to page rules.                                |
| Internal          | Operational process notes without sensitive personal data                                       | Authenticated staff; no public sharing.                                           |
| Confidential      | Customer contacts, addresses, shipment details, invoices and support                            | Role/relationship controlled; encrypted; logged where appropriate.                |
| Highly restricted | Identity documents, payment/security information, sensitive customs evidence and access secrets | Small named roles, reauthentication, detailed access logging and short retention. |
| Security secret   | API keys, webhook secrets, private keys and recovery credentials                                | Secrets manager only; never displayed again where avoidable; rotation/revocation. |

## 31.2 Incident response

82. Detect and assign severity.

83. Contain compromised accounts, keys, devices or integration routes.

84. Preserve logs and evidence without altering the source records.

85. Assess affected data, shipments and jurisdictions.

86. Notify management, privacy/legal, providers and authorities/customers where required.

87. Recover from known-good configuration/backups and monitor recurrence.

88. Complete root-cause analysis, actions, owner and deadline; verify remediation.

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

# 33. Performance, scale and reliability

## 33.1 Launch and growth assumptions

| **Measure**          | **Launch design**                      | **Growth without redesign**                                |
|----------------------|----------------------------------------|------------------------------------------------------------|
| Shipments/month      | 1,000                                  | 20,000+                                                    |
| Registered customers | 10,000                                 | 250,000                                                    |
| Staff/partner users  | 130 total                              | 300+                                                       |
| Facilities           | Up to 5                                | Multiple countries/facilities                              |
| Stored documents     | 100,000                                | Millions                                                   |
| Peak public tracking | 50 concurrent normal; load-test higher | About 1,000 concurrent burst with scaling/caching controls |
| Tracking events      | ~30 per shipment average               | Millions overall                                           |

## 33.2 Service-level objectives

| **Measure**                      | **Target**                                                                                                 |
|----------------------------------|------------------------------------------------------------------------------------------------------------|
| Critical monthly availability    | 99.9% excluding approved maintenance.                                                                      |
| Public tracking latency          | p95 below 1.5 seconds at planned traffic.                                                                  |
| Normal authenticated list/search | p95 below 2 seconds for ordinary filters.                                                                  |
| Quote calculation                | Below 2 seconds for configured automatic parcel quote; manual freight returns acknowledgement immediately. |
| Normal UI interaction            | Client response under 300 ms when no network operation is required.                                        |
| Label generation                 | Below 5 seconds for normal label.                                                                          |
| Standard PDF                     | Below 10 seconds; otherwise asynchronous.                                                                  |
| RPO                              | 15 minutes for critical transactional data.                                                                |
| RTO                              | 4 hours for critical tracking and operations.                                                              |

## 33.3 Reliability controls

- Multi-AZ RDS, automated backups and point-in-time recovery; quarterly restore test.

- Critical S3 versioning/lifecycle and cross-region recovery copy according to classification.

- At least two critical service tasks after pilot, health checks and automatic replacement.

- SQS decoupling, dead-letter queues, alarms and replay tools.

- Provider timeouts, retries, circuit breakers and scheduled reconciliation for stuck transitional states.

- Graceful degradation: public content/tracking explanation remains available when quote/payment/carrier systems are impaired where technically possible.

- Independent status page and incident communication.

## 33.4 Disaster recovery

- Pilot-light recovery in Frankfurt rather than costly active-active launch architecture.

- Infrastructure recreated from CDK; database restored from approved recovery point; critical objects replicated/restored; DNS switched under runbook.

- Quarterly technical exercise and annual business continuity exercise.

- Recovery credentials and runbooks available to named company-controlled personnel, not only an external developer.

# 34. Observability and supportability

## 34.1 Telemetry

- Structured JSON application logs with service, environment, level, timestamp, correlation ID, user/organisation safe ID and event category.

- OpenTelemetry traces across edge request, web/API, database, queue and worker/provider calls.

- Metrics for request rate/error/latency, ECS capacity, RDS, cache, queue age/depth, document scans, provider success, payment state, notification state and business workflows.

- CloudTrail and AWS security service findings into central security monitoring.

- Client real-user performance and JavaScript errors with privacy-safe context.

## 34.2 Required alarms

| **Alarm**                                       | **Response**                                                                         |
|-------------------------------------------------|--------------------------------------------------------------------------------------|
| Public/API high error or latency                | Page on-call; inspect recent release/dependency and capacity; rollback if necessary. |
| Database/storage capacity or health             | Escalate immediately; protect writes and scale/repair.                               |
| Queue oldest-message age/dead-letter growth     | Identify consumer/provider; pause unsafe flow; replay after fix.                     |
| Payment webhook verification/processing failure | Finance/technical alert; reconcile provider state before fulfilment.                 |
| Carrier event backlog                           | Operations/technical alert; activate polling/manual communication.                   |
| Notification bounce/complaint spike             | Messaging/support review; protect sender reputation.                                 |
| Large export/unusual sensitive download         | Security review and possible account/session suspension.                             |
| Backup/replication failure                      | Critical operational alert; restore protection immediately.                          |
| Certificate/domain expiry risk                  | Alert at least 60/30/14/7 days with ownership.                                       |
| Cost anomaly                                    | Technical/product review for abuse, configuration error or unexpected growth.        |

## 34.3 Runbooks

- Public site/API outage; database saturation; queue backlog; S3 upload failure; carrier outage; payment outage; messaging outage; address provider outage; Zendesk outage; compromised staff account; lost warehouse/driver device; malicious upload; backup restore; regional recovery and data-rights request.

- Each runbook has trigger, severity, owner, diagnosis, containment, workaround, recovery, customer communication and closure checklist.

# 35. Testing and quality assurance

| **Test layer**  | **Coverage**                                                                                                                |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------|
| Unit            | Domain rules, calculations, status transitions, permission predicates and formatters.                                       |
| Integration     | PostgreSQL repositories/transactions, S3 upload flow, SQS consumer, Cognito token validation and provider adapter contract. |
| API             | Validation, authentication, authorisation, idempotency, pagination, errors and concurrency.                                 |
| Component       | Forms, tables, timeline, status cards, upload, scanner and offline indicators.                                              |
| End-to-end      | Quote-to-booking, payment, warehouse receipt, tracking, customs action, delivery, claim and business import.                |
| Contract        | Carrier/payment/messaging/support/accounting sandbox and recorded fixtures.                                                 |
| Security        | ASVS controls, dependency/container scans, SAST/DAST, permission tests, upload abuse and independent penetration test.      |
| Accessibility   | Automated axe plus keyboard, screen reader, zoom, contrast, errors and mobile manual tests.                                 |
| Performance     | Public tracking, quote, list/search, imports, reports, queues and provider outage/load scenarios.                           |
| Recovery        | Backup restoration, failed deployment rollback, queue replay and regional recovery rehearsal.                               |
| User acceptance | Operations, warehouse, driver, finance, customs, support, business user and customer pilot scripts.                         |

## 35.1 Release quality gates

- Formatting/lint/type checks pass; required unit/integration/end-to-end tests pass.

- No unresolved critical/high security vulnerability without written risk acceptance by authorised management.

- Database migration rehearsed on staging backup and backward-compatible with deployment sequence.

- Accessibility regression checks pass and known manual issues are documented/approved.

- Performance baseline not materially degraded.

- Product Owner and relevant business owner approve user acceptance evidence.

- Rollback and monitoring plan exist for production change.

# 36. CI/CD, releases and maintenance

## 36.1 GitHub workflow

96. Developer creates issue/requirement reference and short-lived branch.

97. Pull request includes change description, screenshots/API changes, tests, data/privacy/security impact and migration notes.

98. CI installs from locked dependencies; checks formatting, lint, type, unit/integration tests, build, dependency/license and secret scan.

99. Docker images are built, scanned, tagged by commit and pushed to company ECR.

100. Staging deploy runs migrations in approved sequence, smoke/end-to-end tests and release review.

101. Production environment requires named approval; deployment health alarms can automatically stop/rollback.

102. Release notes record features, fixes, migrations, configuration, provider changes and rollback.

## 36.2 Database deployment rules

- Expand-and-contract migrations: add compatible columns/tables first, deploy code, backfill, then remove old structure in a later release.

- No manual production schema editing except controlled emergency procedure followed by migration reconciliation.

- Large backfills run as resumable jobs with progress/impact monitoring.

- Migration backup/recovery point and execution owner recorded.

## 36.3 Maintenance cadence

| **Cadence** | **Work**                                                                                                                                  |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Continuous  | Availability, security, queues, provider and backup monitoring.                                                                           |
| Weekly      | Triage incidents/defects, provider failures, dead-letter queues and product metrics.                                                      |
| Monthly     | Dependency patches, cost review, database/index/slow-query review, backup verification and access exceptions.                             |
| Quarterly   | Restore test, access review, carrier/API review, capacity test and disaster-recovery procedure check.                                     |
| Annually    | Independent penetration test, privacy/retention review, business continuity exercise, legal/content review and hardware lifecycle review. |
| Immediate   | Critical security patch, staff departure access removal, compromised key/device revocation and major legal/service alert.                 |

# 37. Delivery roadmap, budget and staffing

| **Phase**                                      | **Indicative duration** | **Exit result**                                                                                                                 |
|------------------------------------------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Phase 0 - Company readiness                    | 4 weeks                 | Legal entity/details, Product Owner, carrier/broker/payment/vendor accounts, approved route/service scope and initial policies. |
| Phase 1 - Discovery and service design         | 4 weeks                 | Validate workflows with operations, customs, finance, warehouse, support and pilot customers; prioritised backlog.              |
| Phase 2 - UX and design system                 | 6 weeks                 | Sitemap, wireframes, component library, responsive prototypes and usability/accessibility tests.                                |
| Phase 3 - Platform foundation                  | 4 weeks                 | AWS accounts/network, repository, CI/CD, identity, database skeleton, observability and environments.                           |
| Phase 4 - Quote, booking and tracking          | 8 weeks                 | Public site, quote/rating, booking, shipment/package, labels and public/customer tracking.                                      |
| Phase 5 - Payments, documents and customs      | 6 weeks                 | Stripe, invoices, uploads/scanning, customs cases and restricted-item review.                                                   |
| Phase 6 - Operations/admin                     | 6 weeks                 | Admin queues, pricing, customers, pickup/delivery, finance, claims/support linkage and reporting basics.                        |
| Phase 7 - Warehouse and driver PWA             | 8 weeks                 | Scanning, inspection, storage, dispatch, assignments, offline sync and proof.                                                   |
| Phase 8 - Business and integrations            | 6 weeks                 | Organisation portal, bulk import, rates, reports, API/webhooks and carrier/customs/accounting adapters.                         |
| Phase 9 - Security, performance and acceptance | 6 weeks                 | ASVS review, penetration test, load/recovery tests, user acceptance, documentation and training.                                |
| Phase 10 - Controlled pilot                    | 4 weeks                 | Limited real shipments, daily review, issue correction, operational sign-off and phased public release.                         |

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>Schedule expectation<br />
</strong>With overlapping workstreams and a competent team, plan approximately eight to ten months to controlled launch. The schedule starts only after real company decisions and vendor accounts are available.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 37.1 Team

- Product Owner; technical lead/architect; product/UI designer; two to three full-stack engineers; QA engineer; cloud/DevOps engineer; security consultant; part-time operations, customs, finance, warehouse, support and legal representatives.

- The company must retain technical maintenance capability after launch; the platform cannot be safely handed over without monitoring, incident and provider maintenance.

## 37.2 Planning budget

- Professional full build planning range: approximately EUR 200,000-350,000, depending on carrier/customs/accounting integrations, design depth, staff rates and legal/security work.

- Initial monthly software/cloud/support planning range: approximately EUR 1,500-5,000 before transaction, carrier, broker, warehouse, salary and high-volume messaging costs.

- These are planning estimates, not quotations. Obtain vendor pricing and implementation bids after requirements approval.

# 38. AI-assisted build protocol

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>AI use rule<br />
</strong>AI may accelerate implementation, but it must not invent business rules, provider fields, credentials, legal text, prices, status transitions or database changes. Every output is reviewed, tested and merged through the same engineering process as human-written code.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 38.1 Work-package method

103. Select one approved route/module and cite the exact specification sections, entities, API contract and acceptance criteria.

104. Ask the AI to restate assumptions, affected files, data/security impact and tests before writing code.

105. Create or update shared contract/schema first; do not duplicate types locally.

106. Implement the smallest vertical slice across UI, API, database and test fixtures.

107. Generate unit/integration/end-to-end tests and accessibility states with the feature.

108. Run all checks, inspect migration diff and review for secrets/PII/log leakage.

109. Have a qualified developer review; deploy to preview/staging; obtain business acceptance; then merge/release.

## 38.2 Required prompt header for coding AI

PROJECT: Nauterio Logistics  
SPECIFICATION: Complete Product and Technical Specification v1.0  
FEATURE: \<exact screen/module/use case\>  
SOURCE SECTIONS: \<section numbers and appendix rows\>  
STACK: TypeScript, Node.js 24 LTS, Next.js 16.3, NestJS 11, PostgreSQL 18, Prisma 7, AWS  
RULES:  
- Do not invent business rules, fields, statuses, prices or provider responses.  
- Use existing shared contracts, design tokens, permissions and error format.  
- Enforce authorisation on the server.  
- Use integer minor units for money and UTC timestamps.  
- Preserve audit and idempotency requirements.  
- Do not log secrets, addresses, document contents or payment data.  
- Include loading, empty, validation, error, permission and success states.  
- Include unit/integration/end-to-end tests appropriate to the change.  
DELIVERABLE: implementation plan, changed files, code, migration if required, tests, manual verification and rollback notes.

## 38.3 Build order for an AI-assisted team

110. Design tokens, component library, route shells and localisation foundation.

111. Identity, user/organisation context and permission framework.

112. Database schema, migrations, audit and outbox/inbox framework.

113. Services/routes/rating and quote vertical slice.

114. Booking, shipment, package and tracking vertical slice.

115. Documents, labels and customs vertical slice.

116. Payments, invoices and notification vertical slice.

117. Admin operations, warehouse and driver workflows.

118. Claims, returns, support and business integration features.

119. Security/performance/recovery hardening and controlled pilot.

## 38.4 AI completion checklist

- Requirement and acceptance criterion referenced.

- No invented business/legal/provider rule.

- Authorisation and privacy reviewed.

- Validation, idempotency and audit included where applicable.

- Responsive and accessible states present.

- No secret or sensitive-data logging.

- Tests pass and fail for the expected reasons.

- Migration and rollback reviewed.

- Staging evidence/screenshots/API examples attached.

- Human code and business review complete.

# 39. Final acceptance criteria

| **Acceptance area**   | **Pass condition**                                                                                                                                                               |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Public experience     | Visitors can understand the service, track a valid shipment, receive safe invalid-number handling, quote/book, find customs guidance and contact support in English and Italian. |
| Customer account      | Registration, verification, recovery, security, shipment/quote/payment/document/claim/return/support functions work and are private.                                             |
| Business account      | Organisation users, roles, bulk import, templates, rates, statements, reports, API keys and webhooks work within contract and scope.                                             |
| Shipment operations   | Unique tracking/package numbers, event mapping, corrections, exceptions, multi-package shipments and proof operate with immutable history.                                       |
| Warehouse             | Scanning, inspection, measurements, photos, storage, movement, consolidation, repacking and dispatch work on selected hardware and offline queue.                                |
| Driver                | Assignments, pickup, delivery, recipient verification, proof, failed attempts and offline sync work without exposing unrelated data.                                             |
| Customs/documents     | Required item data, restricted screening, upload scanning, review, broker case and action-required workflows work.                                                               |
| Payments/finance      | No duplicate fulfilment; hosted payment, bank confirmation, invoices, credit notes, refunds, disputes and reconciliation are audited.                                            |
| Support/claims        | Zendesk linkage, structured tickets, evidence, decisions, return and settlement progress work.                                                                                   |
| Security              | ASVS Level 2 verification, staff MFA, server-side permission testing, private files, verified webhooks, penetration test and remediation complete.                               |
| Reliability           | Monitoring/alerts active; targets load-tested; backup restoration and deployment rollback demonstrated; recovery exercise documented.                                            |
| Privacy/accessibility | Consent, rights requests, retention, masking and WCAG 2.2 AA testing complete.                                                                                                   |
| Operations approval   | Operations, finance, customs, warehouse, support, legal/privacy and Product Owner sign their acceptance evidence.                                                                |
| Pilot                 | A controlled real shipment completes quote-to-delivery, including payment, documents, scans, tracking and proof, with no unresolved critical defect.                             |

**APPENDICES**

**Detailed Screen, Data and Control Catalogues**

> These appendices make the specification executable by designers, developers, testers and AI coding systems.

**Nauterio Logistics**

# Appendix A. Complete 201-screen inventory

Each route below is a unique reusable screen template. Dynamic identifiers represent many records. The detailed screen blueprint that follows the inventory defines the common content, states, privacy and acceptance pattern for every screen.

| **\#** | **Area**                  | **Route**                      | **Screen**                       | **Purpose**                                                                            | **Primary action**     |
|--------|---------------------------|--------------------------------|----------------------------------|----------------------------------------------------------------------------------------|------------------------|
| 1      | Public and authentication | /                              | Home                             | Explain the service, provide tracking and move visitors to quote or shipment creation. | Track shipment         |
| 2      | Public and authentication | /track                         | Track shipment                   | Accept one tracking number and explain where to find it.                               | Track                  |
| 3      | Public and authentication | /track/\[trackingNumber\]      | Tracking result                  | Show current status, expected delivery, milestones and permitted proof of delivery.    | View details           |
| 4      | Public and authentication | /track/multiple                | Track multiple shipments         | Accept several tracking numbers for business or repeat users.                          | Track all              |
| 5      | Public and authentication | /quote                         | Get a quote                      | Collect route, package and service details for an instant estimate or manual review.   | Calculate quote        |
| 6      | Public and authentication | /quote/results                 | Quote result                     | Compare available services, prices, transit targets and inclusions.                    | Select service         |
| 7      | Public and authentication | /ship                          | Start shipment                   | Explain the booking process and continue a saved draft.                                | Start booking          |
| 8      | Public and authentication | /ship/service                  | Select service                   | Choose service level and delivery method.                                              | Continue               |
| 9      | Public and authentication | /ship/sender                   | Sender details                   | Collect and validate origin contact and address.                                       | Continue               |
| 10     | Public and authentication | /ship/receiver                 | Receiver details                 | Collect and validate destination contact and address.                                  | Continue               |
| 11     | Public and authentication | /ship/packages                 | Package details                  | Capture package count, dimensions, weight and packaging.                               | Continue               |
| 12     | Public and authentication | /ship/customs                  | Customs contents                 | Capture item descriptions, values, origin and HS information.                          | Continue               |
| 13     | Public and authentication | /ship/pickup                   | Pickup or drop-off               | Choose collection, time window or warehouse drop-off.                                  | Continue               |
| 14     | Public and authentication | /ship/review                   | Review shipment                  | Show all details, charges, declarations and terms before payment.                      | Confirm booking        |
| 15     | Public and authentication | /ship/payment                  | Shipment payment                 | Collect payment using hosted provider components.                                      | Pay securely           |
| 16     | Public and authentication | /ship/confirmation             | Shipment confirmation            | Show booking, tracking number, documents and next steps.                               | View shipment          |
| 17     | Public and authentication | /services                      | Services overview                | Present all active logistics services and who each suits.                              | Compare services       |
| 18     | Public and authentication | /services/air-express          | Air Express                      | Describe urgent air service, eligibility, timing and exclusions.                       | Get quote              |
| 19     | Public and authentication | /services/air-economy          | Air Economy                      | Describe lower-cost air service.                                                       | Get quote              |
| 20     | Public and authentication | /services/parcels              | Parcel Shipping                  | Explain personal and retail parcel shipping.                                           | Get quote              |
| 21     | Public and authentication | /services/documents            | Document Shipping                | Explain document envelope service and restrictions.                                    | Get quote              |
| 22     | Public and authentication | /services/commercial-cargo     | Commercial Cargo                 | Explain pallet, carton and equipment shipping.                                         | Request cargo quote    |
| 23     | Public and authentication | /services/sea-freight          | Sea Freight                      | Explain LCL and FCL options.                                                           | Compare sea options    |
| 24     | Public and authentication | /services/sea-freight/lcl      | LCL Freight                      | Explain shared-container service and volume pricing.                                   | Request LCL quote      |
| 25     | Public and authentication | /services/sea-freight/fcl      | FCL Freight                      | Explain dedicated container service.                                                   | Request FCL quote      |
| 26     | Public and authentication | /services/pickup               | Pickup Service                   | Explain collection availability, preparation and failed-pickup rules.                  | Book pickup            |
| 27     | Public and authentication | /services/drop-off             | Warehouse Drop-off               | Show locations, hours, appointment and acceptance rules.                               | Find location          |
| 28     | Public and authentication | /services/customs-assistance   | Customs Assistance               | Explain document review, broker coordination and limitations.                          | Prepare documents      |
| 29     | Public and authentication | /services/consolidation        | Package Consolidation            | Explain package grouping, measurements and approval.                                   | Request consolidation  |
| 30     | Public and authentication | /services/repacking            | Repacking Service                | Explain inspection, evidence, approval and fees.                                       | View requirements      |
| 31     | Public and authentication | /services/insurance            | Shipment Protection              | Explain optional protection, limits, exclusions and claims.                            | Add protection         |
| 32     | Public and authentication | /services/returns              | Returns Service                  | Explain returns, return-to-sender and applicable charges.                              | Start return           |
| 33     | Public and authentication | /routes/italy-to-usa           | Italy to USA                     | Present the launch corridor, steps, coverage and customs expectations.                 | Get quote              |
| 34     | Public and authentication | /service-areas                 | Service areas                    | Show active Italian origin and US destination coverage.                                | Check address          |
| 35     | Public and authentication | /transit-times                 | Transit-time guide               | Explain estimated transit, processing time and causes of delay.                        | Compare services       |
| 36     | Public and authentication | /pricing                       | Pricing overview                 | Explain how prices are formed without publishing unapproved rate cards.                | Get quote              |
| 37     | Public and authentication | /pricing/surcharges            | Surcharges                       | Explain fuel, remote area, oversized, storage and handling charges.                    | View quote             |
| 38     | Public and authentication | /guides/packaging              | Packaging guide                  | Show packaging standards by item and service.                                          | Prepare package        |
| 39     | Public and authentication | /guides/measure-weight         | Measure and weigh                | Explain actual, dimensional and chargeable weight.                                     | Calculate dimensions   |
| 40     | Public and authentication | /customs                       | Customs overview                 | Introduce export and import responsibilities and documents.                            | View customs steps     |
| 41     | Public and authentication | /customs/commercial-invoice    | Commercial invoice guide         | Explain required invoice fields with examples.                                         | Create invoice         |
| 42     | Public and authentication | /customs/hs-codes              | HS code guide                    | Explain classification and responsibility.                                             | Find guidance          |
| 43     | Public and authentication | /customs/duties-taxes          | Duties and taxes                 | Explain payer options, estimates and customs authority decisions.                      | Estimate costs         |
| 44     | Public and authentication | /customs/prohibited-items      | Prohibited items                 | List goods the company will not accept.                                                | Check an item          |
| 45     | Public and authentication | /customs/restricted-items      | Restricted items                 | List goods requiring pre-approval, licences or special handling.                       | Request review         |
| 46     | Public and authentication | /customs/batteries             | Battery shipping                 | Explain battery questions, approval and documentation.                                 | Request review         |
| 47     | Public and authentication | /customs/food-agriculture      | Food and agriculture             | Explain that agricultural and food items need review.                                  | Request review         |
| 48     | Public and authentication | /customs/medicines-medical     | Medicines and medical items      | Explain regulatory review and documentation.                                           | Request review         |
| 49     | Public and authentication | /customs/personal-effects      | Personal effects                 | Explain inventory, values and used-goods declarations.                                 | Prepare inventory      |
| 50     | Public and authentication | /customs/business-imports      | Business imports                 | Explain commercial records, importer information and broker workflow.                  | Contact business team  |
| 51     | Public and authentication | /help                          | Help centre                      | Search and browse support content.                                                     | Search help            |
| 52     | Public and authentication | /help/tracking                 | Tracking help                    | Resolve invalid numbers, delayed scans and status questions.                           | Track shipment         |
| 53     | Public and authentication | /help/quote-booking            | Quote and booking help           | Explain quote expiry, edits and booking conversion.                                    | Get help               |
| 54     | Public and authentication | /help/payment-billing          | Payment and billing help         | Explain failed payments, invoices and bank transfers.                                  | Contact billing        |
| 55     | Public and authentication | /help/pickup-delivery          | Pickup and delivery help         | Explain rescheduling, attempts and collection.                                         | Manage delivery        |
| 56     | Public and authentication | /help/customs                  | Customs help                     | Explain missing documents, holds and duties.                                           | Upload document        |
| 57     | Public and authentication | /help/claims-returns           | Claims and returns help          | Explain eligibility, evidence and progress.                                            | Start claim            |
| 58     | Public and authentication | /help/account-security         | Account and security help        | Explain login, MFA, recovery and suspicious activity.                                  | Secure account         |
| 59     | Public and authentication | /contact                       | Contact                          | Present phone, email, chat, address, hours and enquiry routes.                         | Contact support        |
| 60     | Public and authentication | /support/new                   | Submit support request           | Create a structured support ticket.                                                    | Submit request         |
| 61     | Public and authentication | /support/confirmation          | Support confirmation             | Confirm ticket reference and expected response.                                        | View ticket            |
| 62     | Public and authentication | /claims                        | Claims overview                  | Explain claim types, evidence, time limits and process.                                | Start claim            |
| 63     | Public and authentication | /claims/new                    | Submit claim                     | Collect claimant, shipment, event and evidence.                                        | Submit claim           |
| 64     | Public and authentication | /claims/confirmation           | Claim confirmation               | Confirm claim reference and review steps.                                              | View claim             |
| 65     | Public and authentication | /returns                       | Returns overview                 | Explain return eligibility and charges.                                                | Start return           |
| 66     | Public and authentication | /returns/new                   | Start return                     | Collect return reason, package and collection details.                                 | Submit return          |
| 67     | Public and authentication | /about                         | About Nauterio                   | Explain mission, route, operating model and verified company details.                  | Learn more             |
| 68     | Public and authentication | /service-alerts                | Service alerts                   | Publish current operational disruptions and resolved notices.                          | View alert             |
| 69     | Public and authentication | /resources                     | Resources hub                    | Publish practical cross-border shipping guidance.                                      | Read guide             |
| 70     | Public and authentication | /resources/\[slug\]            | Resource article                 | Present an individual editorial guide.                                                 | Related action         |
| 71     | Public and authentication | /legal                         | Legal hub                        | Link all legal, service and privacy policies.                                          | Read policies          |
| 72     | Public and authentication | /privacy                       | Privacy policy                   | Explain personal-data processing and rights.                                           | Manage privacy         |
| 73     | Public and authentication | /cookies                       | Cookie policy and preferences    | Explain cookies and open consent settings.                                             | Manage cookies         |
| 74     | Public and authentication | /terms                         | Terms and conditions             | Present carriage, website and account terms.                                           | Read terms             |
| 75     | Public and authentication | /signin                        | Sign in                          | Authenticate customers and staff through the appropriate route.                        | Sign in                |
| 76     | Public and authentication | /register                      | Create account                   | Register an individual or start business registration.                                 | Create account         |
| 77     | Public and authentication | /password                      | Password and account recovery    | Request reset, confirm code and set a new password.                                    | Recover account        |
| 78     | Customer portal           | /app                           | Customer dashboard               | Show active shipments, actions, alerts and recent documents.                           | View shipment          |
| 79     | Customer portal           | /app/shipments                 | My shipments                     | Filter and search all customer shipments.                                              | Create shipment        |
| 80     | Customer portal           | /app/shipments/\[id\]          | Shipment detail                  | Show complete authorised shipment information and actions.                             | Track shipment         |
| 81     | Customer portal           | /app/shipments/\[id\]/tracking | Detailed tracking                | Show milestone timeline, exceptions and proof of delivery.                             | Download proof         |
| 82     | Customer portal           | /app/shipments/new             | Create shipment                  | Start or resume a logged-in shipment flow.                                             | Start shipment         |
| 83     | Customer portal           | /app/drafts                    | Draft shipments                  | List incomplete bookings and expiry dates.                                             | Resume draft           |
| 84     | Customer portal           | /app/quotes                    | Quotes                           | List draft, pending, issued, accepted and expired quotes.                              | Request quote          |
| 85     | Customer portal           | /app/quotes/\[id\]             | Quote detail                     | Show pricing, service, conditions and acceptance.                                      | Accept quote           |
| 86     | Customer portal           | /app/pickups                   | Pickups                          | List scheduled, completed, failed and cancelled pickups.                               | Book pickup            |
| 87     | Customer portal           | /app/pickups/\[id\]            | Pickup detail                    | Show address, window, instructions and reschedule controls.                            | Reschedule             |
| 88     | Customer portal           | /app/addresses                 | Saved addresses                  | Manage validated sender and receiver addresses.                                        | Add address            |
| 89     | Customer portal           | /app/contacts                  | Saved contacts                   | Manage sender and receiver contacts.                                                   | Add contact            |
| 90     | Customer portal           | /app/payments                  | Payments                         | List payment status, amount and linked invoices.                                       | Pay balance            |
| 91     | Customer portal           | /app/payments/\[id\]           | Payment detail                   | Show provider reference, allocation, receipt and refund state.                         | Download receipt       |
| 92     | Customer portal           | /app/invoices                  | Invoices                         | List invoices, credit notes and outstanding balances.                                  | Download invoice       |
| 93     | Customer portal           | /app/invoices/\[id\]           | Invoice detail                   | Show line items, tax information and payment state.                                    | Pay invoice            |
| 94     | Customer portal           | /app/documents                 | Documents                        | List customs, commercial, generated and delivery files.                                | Upload document        |
| 95     | Customer portal           | /app/documents/\[id\]          | Document detail                  | Show file type, status, version and authorised download.                               | Download               |
| 96     | Customer portal           | /app/claims                    | Claims                           | List claim status and required actions.                                                | Start claim            |
| 97     | Customer portal           | /app/claims/\[id\]             | Claim detail                     | Show evidence, messages, decision and settlement.                                      | Add evidence           |
| 98     | Customer portal           | /app/returns                   | Returns                          | List return requests and returned shipments.                                           | Start return           |
| 99     | Customer portal           | /app/returns/\[id\]            | Return detail                    | Show approval, charge, label and tracking.                                             | Download label         |
| 100    | Customer portal           | /app/support                   | Support tickets                  | List open and closed support requests.                                                 | New ticket             |
| 101    | Customer portal           | /app/support/\[id\]            | Ticket detail                    | Show conversation, attachments and related shipment.                                   | Reply                  |
| 102    | Customer portal           | /app/notifications             | Notification centre              | Show operational messages and delivery state.                                          | Mark read              |
| 103    | Customer portal           | /app/profile-security          | Profile and security             | Manage identity, password, passkeys, MFA and sessions.                                 | Secure account         |
| 104    | Customer portal           | /app/preferences               | Preferences and consent          | Manage language, time zone, channels, cookies and marketing consent.                   | Save preferences       |
| 105    | Business portal           | /business                      | Business dashboard               | Show organisation shipment, spend, delay and credit summaries.                         | Create shipment        |
| 106    | Business portal           | /business/organisation         | Organisation profile             | Manage legal, billing and operational company data.                                    | Edit profile           |
| 107    | Business portal           | /business/team                 | Team users                       | Invite, suspend and remove organisation users.                                         | Invite user            |
| 108    | Business portal           | /business/roles                | Roles and approvals              | Set organisation permissions and internal approval rules.                              | Create role            |
| 109    | Business portal           | /business/import               | Bulk shipment import             | Upload a controlled shipment spreadsheet.                                              | Upload file            |
| 110    | Business portal           | /business/import/result        | Import result                    | Show validated rows, errors and accepted records.                                      | Fix errors             |
| 111    | Business portal           | /business/templates            | Shipment templates               | Save repeat routes, contacts, contents and package sets.                               | Create template        |
| 112    | Business portal           | /business/commodities          | Saved commodities                | Manage reusable customs item descriptions and codes.                                   | Add commodity          |
| 113    | Business portal           | /business/rates                | Contract rates                   | Show negotiated rates, effective dates and exclusions.                                 | Get quote              |
| 114    | Business portal           | /business/statements           | Statements and credit            | Show account balance, terms, statements and overdue items.                             | Pay balance            |
| 115    | Business portal           | /business/reports              | Business reports                 | Run shipment, cost, delivery and exception reports.                                    | Generate report        |
| 116    | Business portal           | /business/api                  | API credentials                  | Create scoped keys and view usage.                                                     | Create key             |
| 117    | Business portal           | /business/webhooks             | Webhooks and integrations        | Register endpoints and inspect delivery attempts.                                      | Add webhook            |
| 118    | Administration            | /admin                         | Operations dashboard             | Show live shipment, exception, finance and queue summaries.                            | Open exceptions        |
| 119    | Administration            | /admin/shipments               | Shipment management              | Search, filter and export permitted shipment records.                                  | Create shipment        |
| 120    | Administration            | /admin/shipments/\[id\]        | Shipment administration          | Manage complete shipment, packages, documents and events.                              | Add event              |
| 121    | Administration            | /admin/shipments/new           | Create shipment                  | Create a shipment on behalf of a customer.                                             | Create                 |
| 122    | Administration            | /admin/packages                | Package management               | Search packages across shipments and locations.                                        | Scan package           |
| 123    | Administration            | /admin/packages/\[id\]         | Package detail                   | Manage measurements, photos, labels and condition.                                     | Update package         |
| 124    | Administration            | /admin/tracking                | Tracking event queue             | Review recent events, conflicts and integration errors.                                | Resolve event          |
| 125    | Administration            | /admin/tracking/new            | Add or correct tracking event    | Create an authorised event or correction with reason.                                  | Save event             |
| 126    | Administration            | /admin/quotes                  | Quote management                 | Search and manage automatic and manual quotes.                                         | Create quote           |
| 127    | Administration            | /admin/quotes/\[id\]           | Quote detail                     | Review cost, margin, approval and customer response.                                   | Issue quote            |
| 128    | Administration            | /admin/pricing                 | Pricing rules                    | Configure calculation order and eligibility.                                           | Add rule               |
| 129    | Administration            | /admin/rate-cards              | Rate cards                       | Manage route, zone, weight and effective-date rates.                                   | Import rates           |
| 130    | Administration            | /admin/surcharges              | Surcharges                       | Manage fuel, remote, oversize and operational fees.                                    | Add surcharge          |
| 131    | Administration            | /admin/discounts               | Discounts and promotions         | Manage customer, organisation and campaign discounts.                                  | Create discount        |
| 132    | Administration            | /admin/customers               | Customer management              | Search customers and view account state.                                               | Create customer        |
| 133    | Administration            | /admin/customers/\[id\]        | Customer detail                  | View identity, shipments, payments, consent and support.                               | Update customer        |
| 134    | Administration            | /admin/organisations           | Business organisations           | Manage business accounts and verification.                                             | Create organisation    |
| 135    | Administration            | /admin/organisations/\[id\]    | Organisation detail              | Manage users, credit, rates and contracts.                                             | Approve account        |
| 136    | Administration            | /admin/pickups                 | Pickup management                | Schedule, assign, monitor and reschedule pickups.                                      | Assign pickup          |
| 137    | Administration            | /admin/pickups/\[id\]          | Pickup detail                    | View address, packages, driver and evidence.                                           | Update pickup          |
| 138    | Administration            | /admin/deliveries              | Delivery assignments             | Manage last-mile assignments and exceptions.                                           | Assign delivery        |
| 139    | Administration            | /admin/deliveries/\[id\]       | Delivery detail                  | View route, attempts, evidence and recipient result.                                   | Update delivery        |
| 140    | Administration            | /admin/warehouses              | Warehouse management             | Manage active facilities and operating rules.                                          | Add warehouse          |
| 141    | Administration            | /admin/warehouses/\[id\]       | Warehouse detail                 | View inventory, staff, capacity and settings.                                          | Edit warehouse         |
| 142    | Administration            | /admin/inventory               | Warehouse inventory              | Find packages by facility, zone, shelf or exception.                                   | Move package           |
| 143    | Administration            | /admin/consolidation           | Consolidation queue              | Group eligible packages and record approvals.                                          | Create consolidation   |
| 144    | Administration            | /admin/repacking               | Repacking queue                  | Review packaging issues, costs and completion evidence.                                | Approve repacking      |
| 145    | Administration            | /admin/dispatch                | Dispatch and manifests           | Build dispatch batches and close manifests.                                            | Create manifest        |
| 146    | Administration            | /admin/customs                 | Customs queue                    | Prioritise cases requiring documents, payment or broker action.                        | Open case              |
| 147    | Administration            | /admin/customs/\[id\]          | Customs case detail              | Manage declarations, broker messages, deadlines and releases.                          | Request document       |
| 148    | Administration            | /admin/document-review         | Document review                  | Approve, reject or request replacement documents.                                      | Review document        |
| 149    | Administration            | /admin/payments                | Payment management               | Search payment and reconciliation records.                                             | Reconcile              |
| 150    | Administration            | /admin/payments/\[id\]         | Payment detail                   | View payment events, allocation, dispute and refund links.                             | Take action            |
| 151    | Administration            | /admin/invoices                | Invoice management               | Search invoices, credit notes and overdue balances.                                    | Create invoice         |
| 152    | Administration            | /admin/invoices/\[id\]         | Invoice detail                   | Review line items, tax, payment and e-invoice state.                                   | Issue invoice          |
| 153    | Administration            | /admin/refunds                 | Refund queue                     | Review requested and approved refunds.                                                 | Review refund          |
| 154    | Administration            | /admin/refunds/\[id\]          | Refund detail                    | Record reason, approvals, amount and provider result.                                  | Approve refund         |
| 155    | Administration            | /admin/claims                  | Claims queue                     | Prioritise and assign claims.                                                          | Open claim             |
| 156    | Administration            | /admin/claims/\[id\]           | Claim detail                     | Review evidence, liability, carrier case and decision.                                 | Decide claim           |
| 157    | Administration            | /admin/returns                 | Return management                | Review return requests and return shipments.                                           | Approve return         |
| 158    | Administration            | /admin/returns/\[id\]          | Return detail                    | Manage charges, label, pickup and return tracking.                                     | Create return          |
| 159    | Administration            | /admin/support                 | Support tickets                  | View escalated and shipment-related support records.                                   | Open ticket            |
| 160    | Administration            | /admin/support/\[id\]          | Support ticket detail            | View support context and operational actions.                                          | Add note               |
| 161    | Administration            | /admin/notifications           | Notification centre              | Inspect operational sends, failures and retries.                                       | Retry notification     |
| 162    | Administration            | /admin/templates               | Message templates                | Manage approved email, SMS, WhatsApp and document templates.                           | Create template        |
| 163    | Administration            | /admin/staff                   | Staff management                 | Create, suspend and assign staff.                                                      | Invite staff           |
| 164    | Administration            | /admin/staff/\[id\]            | Staff detail                     | Manage role, warehouse, sessions and access review.                                    | Update access          |
| 165    | Administration            | /admin/roles                   | Roles and permissions            | Create roles and review permission grants.                                             | Create role            |
| 166    | Administration            | /admin/reports                 | Administration reports           | Run operational, financial, customs, warehouse and support reports.                    | Generate report        |
| 167    | Administration            | /admin/audit                   | Audit log                        | Search append-only high-risk activity.                                                 | Export permitted log   |
| 168    | Administration            | /admin/content                 | Content management               | Manage public pages, guides, FAQs, alerts and policies.                                | Create content         |
| 169    | Administration            | /admin/settings                | System settings and integrations | Manage controlled configuration and provider connections.                              | Open setting           |
| 170    | Warehouse PWA             | /warehouse/signin              | Warehouse sign in                | Authenticate the warehouse employee and select facility.                               | Sign in                |
| 171    | Warehouse PWA             | /warehouse                     | Warehouse dashboard              | Show receipt, inspection, storage, dispatch and exception workload.                    | Scan package           |
| 172    | Warehouse PWA             | /warehouse/receive             | Receive shipment                 | Scan master or package code and confirm physical receipt.                              | Confirm receipt        |
| 173    | Warehouse PWA             | /warehouse/scan                | Package scanner                  | Scan or manually enter a package number.                                               | Open package           |
| 174    | Warehouse PWA             | /warehouse/inspect             | Package inspection               | Record condition, prohibited-item answers and exceptions.                              | Complete inspection    |
| 175    | Warehouse PWA             | /warehouse/measure             | Measure and weigh                | Capture actual dimensions and calibrated weight.                                       | Save measurements      |
| 176    | Warehouse PWA             | /warehouse/photos              | Package photographs              | Capture required exterior, label and damage images.                                    | Upload photos          |
| 177    | Warehouse PWA             | /warehouse/storage             | Storage assignment               | Assign facility zone, shelf, bin and handling class.                                   | Assign location        |
| 178    | Warehouse PWA             | /warehouse/move                | Move package                     | Scan from and to locations and record movement.                                        | Confirm move           |
| 179    | Warehouse PWA             | /warehouse/consolidate         | Consolidation                    | Confirm package set, create consolidated package and measurements.                     | Complete consolidation |
| 180    | Warehouse PWA             | /warehouse/repack              | Repacking                        | Record old condition, materials, result and charge.                                    | Complete repacking     |
| 181    | Warehouse PWA             | /warehouse/dispatch            | Dispatch manifest                | Scan outbound packages and close the manifest.                                         | Close manifest         |
| 182    | Warehouse PWA             | /warehouse/exceptions          | Warehouse exceptions             | Resolve unidentified, damaged, restricted or missing packages.                         | Open exception         |
| 183    | Warehouse PWA             | /warehouse/sync                | Offline synchronisation          | Show pending actions, conflicts and last successful sync.                              | Synchronise            |
| 184    | Driver PWA                | /driver/signin                 | Driver sign in                   | Authenticate driver or delivery partner.                                               | Sign in                |
| 185    | Driver PWA                | /driver                        | Driver dashboard                 | Show shift, assignments, urgent notes and sync state.                                  | Start route            |
| 186    | Driver PWA                | /driver/assignments            | Assignment list                  | List pickups and deliveries in operational order.                                      | Open assignment        |
| 187    | Driver PWA                | /driver/assignments/\[id\]     | Assignment detail                | Show permitted contact, address, packages and instructions.                            | Start task             |
| 188    | Driver PWA                | /driver/route                  | Route and map                    | Show route sequence and navigation launch.                                             | Navigate               |
| 189    | Driver PWA                | /driver/pickup-checklist       | Pickup checklist                 | Verify person, package count, condition and declaration.                               | Confirm pickup         |
| 190    | Driver PWA                | /driver/pickup-confirmation    | Pickup confirmation              | Capture scan, name, signature/photo and timestamp.                                     | Complete pickup        |
| 191    | Driver PWA                | /driver/delivery-checklist     | Delivery checklist               | Verify address, package count and service requirement.                                 | Continue               |
| 192    | Driver PWA                | /driver/recipient-verification | Recipient verification           | Capture approved identity or one-time-code verification.                               | Verify recipient       |
| 193    | Driver PWA                | /driver/proof                  | Signature and photograph         | Capture proof of delivery according to service rules.                                  | Complete delivery      |
| 194    | Driver PWA                | /driver/failed-attempt         | Failed delivery attempt          | Record controlled reason, evidence and next action.                                    | Submit attempt         |
| 195    | Driver PWA                | /driver/sync                   | Offline synchronisation          | Show pending actions and conflicts.                                                    | Synchronise            |
| 196    | Driver PWA                | /driver/history                | Shift history                    | Show completed tasks and end-of-shift checks.                                          | End shift              |
| 197    | Status and developer      | /status                        | Public status page               | Show incidents, uptime history and planned maintenance.                                | Subscribe              |
| 198    | Status and developer      | /developers                    | Developer portal                 | Explain API access, environments and onboarding.                                       | Request access         |
| 199    | Status and developer      | /developers/api                | API reference                    | Publish versioned OpenAPI documentation.                                               | Try sandbox            |
| 200    | Status and developer      | /developers/changelog          | API changelog                    | Publish additions, fixes and deprecations.                                             | Subscribe              |
| 201    | Status and developer      | /developers/sandbox            | Sandbox access                   | Create or manage non-production integration credentials.                               | Create sandbox key     |

# Appendix B. Screen-by-screen implementation blueprints

The following specification card is repeated for all 201 screens so that no route is left as an unexplained name. Designers may combine shared visual templates, but developers and testers must still implement each route’s purpose, action and access rules.

## Public and authentication

### Home

Route: / \| Area: Public and authentication \| Primary action: Track shipment

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain the service, provide tracking and move visitors to quote or shipment creation.                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Track shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Track shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Track shipment” without undocumented staff assistance.                    |

### Track shipment

Route: /track \| Area: Public and authentication \| Primary action: Track

| **Specification item** | **Requirement**                                                                                                                                         |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Accept one tracking number and explain where to find it.                                                                                                |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                            |
| Core content           | The screen must present only information needed to complete “Track”, with a clear title, concise explanation, structured data and contextual guidance.  |
| Primary action         | Track                                                                                                                                                   |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                     |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant. |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.             |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.              |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values. |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Track” without undocumented staff assistance.                     |

### Tracking result

Route: /track/\[trackingNumber\] \| Area: Public and authentication \| Primary action: View details

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show current status, expected delivery, milestones and permitted proof of delivery.                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “View details”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View details                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View details” without undocumented staff assistance.                    |

### Track multiple shipments

Route: /track/multiple \| Area: Public and authentication \| Primary action: Track all

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Accept several tracking numbers for business or repeat users.                                                                                              |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Track all”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Track all                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Track all” without undocumented staff assistance.                    |

### Get a quote

Route: /quote \| Area: Public and authentication \| Primary action: Calculate quote

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect route, package and service details for an instant estimate or manual review.                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Calculate quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Calculate quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Calculate quote” without undocumented staff assistance.                    |

### Quote result

Route: /quote/results \| Area: Public and authentication \| Primary action: Select service

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Compare available services, prices, transit targets and inclusions.                                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Select service”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Select service                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Select service” without undocumented staff assistance.                    |

### Start shipment

Route: /ship \| Area: Public and authentication \| Primary action: Start booking

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain the booking process and continue a saved draft.                                                                                                        |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Start booking”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start booking                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start booking” without undocumented staff assistance.                    |

### Select service

Route: /ship/service \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Choose service level and delivery method.                                                                                                                 |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Sender details

Route: /ship/sender \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect and validate origin contact and address.                                                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Receiver details

Route: /ship/receiver \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect and validate destination contact and address.                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Package details

Route: /ship/packages \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture package count, dimensions, weight and packaging.                                                                                                  |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Customs contents

Route: /ship/customs \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture item descriptions, values, origin and HS information.                                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Pickup or drop-off

Route: /ship/pickup \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Choose collection, time window or warehouse drop-off.                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Review shipment

Route: /ship/review \| Area: Public and authentication \| Primary action: Confirm booking

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show all details, charges, declarations and terms before payment.                                                                                                |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Confirm booking”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Confirm booking                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Confirm booking” without undocumented staff assistance.                    |

### Shipment payment

Route: /ship/payment \| Area: Public and authentication \| Primary action: Pay securely

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect payment using hosted provider components.                                                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Pay securely”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Pay securely                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Pay securely” without undocumented staff assistance.                    |

### Shipment confirmation

Route: /ship/confirmation \| Area: Public and authentication \| Primary action: View shipment

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show booking, tracking number, documents and next steps.                                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “View shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View shipment” without undocumented staff assistance.                    |

### Services overview

Route: /services \| Area: Public and authentication \| Primary action: Compare services

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Present all active logistics services and who each suits.                                                                                                         |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Compare services”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Compare services                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Compare services” without undocumented staff assistance.                    |

### Air Express

Route: /services/air-express \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Describe urgent air service, eligibility, timing and exclusions.                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Air Economy

Route: /services/air-economy \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Describe lower-cost air service.                                                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Parcel Shipping

Route: /services/parcels \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain personal and retail parcel shipping.                                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Document Shipping

Route: /services/documents \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain document envelope service and restrictions.                                                                                                        |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Commercial Cargo

Route: /services/commercial-cargo \| Area: Public and authentication \| Primary action: Request cargo quote

| **Specification item** | **Requirement**                                                                                                                                                      |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain pallet, carton and equipment shipping.                                                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                         |
| Core content           | The screen must present only information needed to complete “Request cargo quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request cargo quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                  |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.              |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                          |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                           |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.              |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request cargo quote” without undocumented staff assistance.                    |

### Sea Freight

Route: /services/sea-freight \| Area: Public and authentication \| Primary action: Compare sea options

| **Specification item** | **Requirement**                                                                                                                                                      |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain LCL and FCL options.                                                                                                                                         |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                         |
| Core content           | The screen must present only information needed to complete “Compare sea options”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Compare sea options                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                  |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.              |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                          |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                           |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.              |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Compare sea options” without undocumented staff assistance.                    |

### LCL Freight

Route: /services/sea-freight/lcl \| Area: Public and authentication \| Primary action: Request LCL quote

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain shared-container service and volume pricing.                                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Request LCL quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request LCL quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request LCL quote” without undocumented staff assistance.                    |

### FCL Freight

Route: /services/sea-freight/fcl \| Area: Public and authentication \| Primary action: Request FCL quote

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain dedicated container service.                                                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Request FCL quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request FCL quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request FCL quote” without undocumented staff assistance.                    |

### Pickup Service

Route: /services/pickup \| Area: Public and authentication \| Primary action: Book pickup

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain collection availability, preparation and failed-pickup rules.                                                                                        |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Book pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Book pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Book pickup” without undocumented staff assistance.                    |

### Warehouse Drop-off

Route: /services/drop-off \| Area: Public and authentication \| Primary action: Find location

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show locations, hours, appointment and acceptance rules.                                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Find location”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Find location                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Find location” without undocumented staff assistance.                    |

### Customs Assistance

Route: /services/customs-assistance \| Area: Public and authentication \| Primary action: Prepare documents

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain document review, broker coordination and limitations.                                                                                                      |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Prepare documents”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Prepare documents                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Prepare documents” without undocumented staff assistance.                    |

### Package Consolidation

Route: /services/consolidation \| Area: Public and authentication \| Primary action: Request consolidation

| **Specification item** | **Requirement**                                                                                                                                                        |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain package grouping, measurements and approval.                                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                           |
| Core content           | The screen must present only information needed to complete “Request consolidation”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request consolidation                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                    |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.                |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                            |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                             |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.                |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request consolidation” without undocumented staff assistance.                    |

### Repacking Service

Route: /services/repacking \| Area: Public and authentication \| Primary action: View requirements

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain inspection, evidence, approval and fees.                                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “View requirements”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View requirements                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View requirements” without undocumented staff assistance.                    |

### Shipment Protection

Route: /services/insurance \| Area: Public and authentication \| Primary action: Add protection

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain optional protection, limits, exclusions and claims.                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Add protection”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add protection                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add protection” without undocumented staff assistance.                    |

### Returns Service

Route: /services/returns \| Area: Public and authentication \| Primary action: Start return

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain returns, return-to-sender and applicable charges.                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Start return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start return” without undocumented staff assistance.                    |

### Italy to USA

Route: /routes/italy-to-usa \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Present the launch corridor, steps, coverage and customs expectations.                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Service areas

Route: /service-areas \| Area: Public and authentication \| Primary action: Check address

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show active Italian origin and US destination coverage.                                                                                                        |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Check address”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Check address                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Check address” without undocumented staff assistance.                    |

### Transit-time guide

Route: /transit-times \| Area: Public and authentication \| Primary action: Compare services

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain estimated transit, processing time and causes of delay.                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Compare services”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Compare services                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Compare services” without undocumented staff assistance.                    |

### Pricing overview

Route: /pricing \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain how prices are formed without publishing unapproved rate cards.                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Surcharges

Route: /pricing/surcharges \| Area: Public and authentication \| Primary action: View quote

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain fuel, remote area, oversized, storage and handling charges.                                                                                         |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “View quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View quote” without undocumented staff assistance.                    |

### Packaging guide

Route: /guides/packaging \| Area: Public and authentication \| Primary action: Prepare package

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show packaging standards by item and service.                                                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Prepare package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Prepare package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Prepare package” without undocumented staff assistance.                    |

### Measure and weigh

Route: /guides/measure-weight \| Area: Public and authentication \| Primary action: Calculate dimensions

| **Specification item** | **Requirement**                                                                                                                                                       |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain actual, dimensional and chargeable weight.                                                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                               |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                          |
| Core content           | The screen must present only information needed to complete “Calculate dimensions”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Calculate dimensions                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                   |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.               |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                           |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                            |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.               |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Calculate dimensions” without undocumented staff assistance.                    |

### Customs overview

Route: /customs \| Area: Public and authentication \| Primary action: View customs steps

| **Specification item** | **Requirement**                                                                                                                                                     |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Introduce export and import responsibilities and documents.                                                                                                         |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                             |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                        |
| Core content           | The screen must present only information needed to complete “View customs steps”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View customs steps                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                 |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.             |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                         |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                          |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.             |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View customs steps” without undocumented staff assistance.                    |

### Commercial invoice guide

Route: /customs/commercial-invoice \| Area: Public and authentication \| Primary action: Create invoice

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain required invoice fields with examples.                                                                                                                  |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Create invoice”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create invoice                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create invoice” without undocumented staff assistance.                    |

### HS code guide

Route: /customs/hs-codes \| Area: Public and authentication \| Primary action: Find guidance

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain classification and responsibility.                                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Find guidance”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Find guidance                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Find guidance” without undocumented staff assistance.                    |

### Duties and taxes

Route: /customs/duties-taxes \| Area: Public and authentication \| Primary action: Estimate costs

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain payer options, estimates and customs authority decisions.                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Estimate costs”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Estimate costs                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Estimate costs” without undocumented staff assistance.                    |

### Prohibited items

Route: /customs/prohibited-items \| Area: Public and authentication \| Primary action: Check an item

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List goods the company will not accept.                                                                                                                        |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Check an item”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Check an item                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Check an item” without undocumented staff assistance.                    |

### Restricted items

Route: /customs/restricted-items \| Area: Public and authentication \| Primary action: Request review

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List goods requiring pre-approval, licences or special handling.                                                                                                |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Request review”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request review                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request review” without undocumented staff assistance.                    |

### Battery shipping

Route: /customs/batteries \| Area: Public and authentication \| Primary action: Request review

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain battery questions, approval and documentation.                                                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Request review”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request review                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request review” without undocumented staff assistance.                    |

### Food and agriculture

Route: /customs/food-agriculture \| Area: Public and authentication \| Primary action: Request review

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain that agricultural and food items need review.                                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Request review”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request review                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request review” without undocumented staff assistance.                    |

### Medicines and medical items

Route: /customs/medicines-medical \| Area: Public and authentication \| Primary action: Request review

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain regulatory review and documentation.                                                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Request review”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request review                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request review” without undocumented staff assistance.                    |

### Personal effects

Route: /customs/personal-effects \| Area: Public and authentication \| Primary action: Prepare inventory

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain inventory, values and used-goods declarations.                                                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Prepare inventory”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Prepare inventory                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Prepare inventory” without undocumented staff assistance.                    |

### Business imports

Route: /customs/business-imports \| Area: Public and authentication \| Primary action: Contact business team

| **Specification item** | **Requirement**                                                                                                                                                        |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain commercial records, importer information and broker workflow.                                                                                                  |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                           |
| Core content           | The screen must present only information needed to complete “Contact business team”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Contact business team                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                    |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.                |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                            |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                             |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.                |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Contact business team” without undocumented staff assistance.                    |

### Help centre

Route: /help \| Area: Public and authentication \| Primary action: Search help

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search and browse support content.                                                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Search help”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Search help                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Search help” without undocumented staff assistance.                    |

### Tracking help

Route: /help/tracking \| Area: Public and authentication \| Primary action: Track shipment

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Resolve invalid numbers, delayed scans and status questions.                                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Track shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Track shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Track shipment” without undocumented staff assistance.                    |

### Quote and booking help

Route: /help/quote-booking \| Area: Public and authentication \| Primary action: Get help

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain quote expiry, edits and booking conversion.                                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Get help”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get help                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get help” without undocumented staff assistance.                    |

### Payment and billing help

Route: /help/payment-billing \| Area: Public and authentication \| Primary action: Contact billing

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain failed payments, invoices and bank transfers.                                                                                                            |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Contact billing”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Contact billing                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Contact billing” without undocumented staff assistance.                    |

### Pickup and delivery help

Route: /help/pickup-delivery \| Area: Public and authentication \| Primary action: Manage delivery

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain rescheduling, attempts and collection.                                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Manage delivery”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Manage delivery                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Manage delivery” without undocumented staff assistance.                    |

### Customs help

Route: /help/customs \| Area: Public and authentication \| Primary action: Upload document

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain missing documents, holds and duties.                                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Upload document”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Upload document                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Upload document” without undocumented staff assistance.                    |

### Claims and returns help

Route: /help/claims-returns \| Area: Public and authentication \| Primary action: Start claim

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain eligibility, evidence and progress.                                                                                                                  |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Start claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start claim” without undocumented staff assistance.                    |

### Account and security help

Route: /help/account-security \| Area: Public and authentication \| Primary action: Secure account

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain login, MFA, recovery and suspicious activity.                                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Secure account”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Secure account                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Secure account” without undocumented staff assistance.                    |

### Contact

Route: /contact \| Area: Public and authentication \| Primary action: Contact support

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Present phone, email, chat, address, hours and enquiry routes.                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Contact support”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Contact support                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Contact support” without undocumented staff assistance.                    |

### Submit support request

Route: /support/new \| Area: Public and authentication \| Primary action: Submit request

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create a structured support ticket.                                                                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Submit request”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Submit request                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Submit request” without undocumented staff assistance.                    |

### Support confirmation

Route: /support/confirmation \| Area: Public and authentication \| Primary action: View ticket

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Confirm ticket reference and expected response.                                                                                                              |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “View ticket”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View ticket                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View ticket” without undocumented staff assistance.                    |

### Claims overview

Route: /claims \| Area: Public and authentication \| Primary action: Start claim

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain claim types, evidence, time limits and process.                                                                                                      |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Start claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start claim” without undocumented staff assistance.                    |

### Submit claim

Route: /claims/new \| Area: Public and authentication \| Primary action: Submit claim

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect claimant, shipment, event and evidence.                                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Submit claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Submit claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Submit claim” without undocumented staff assistance.                    |

### Claim confirmation

Route: /claims/confirmation \| Area: Public and authentication \| Primary action: View claim

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Confirm claim reference and review steps.                                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “View claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View claim” without undocumented staff assistance.                    |

### Returns overview

Route: /returns \| Area: Public and authentication \| Primary action: Start return

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain return eligibility and charges.                                                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Start return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start return” without undocumented staff assistance.                    |

### Start return

Route: /returns/new \| Area: Public and authentication \| Primary action: Submit return

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect return reason, package and collection details.                                                                                                         |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Submit return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Submit return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Submit return” without undocumented staff assistance.                    |

### About Nauterio

Route: /about \| Area: Public and authentication \| Primary action: Learn more

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain mission, route, operating model and verified company details.                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Learn more”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Learn more                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Learn more” without undocumented staff assistance.                    |

### Service alerts

Route: /service-alerts \| Area: Public and authentication \| Primary action: View alert

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Publish current operational disruptions and resolved notices.                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “View alert”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View alert                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View alert” without undocumented staff assistance.                    |

### Resources hub

Route: /resources \| Area: Public and authentication \| Primary action: Read guide

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Publish practical cross-border shipping guidance.                                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Read guide”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Read guide                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Read guide” without undocumented staff assistance.                    |

### Resource article

Route: /resources/\[slug\] \| Area: Public and authentication \| Primary action: Related action

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Present an individual editorial guide.                                                                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Related action”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Related action                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Related action” without undocumented staff assistance.                    |

### Legal hub

Route: /legal \| Area: Public and authentication \| Primary action: Read policies

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Link all legal, service and privacy policies.                                                                                                                  |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Read policies”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Read policies                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Read policies” without undocumented staff assistance.                    |

### Privacy policy

Route: /privacy \| Area: Public and authentication \| Primary action: Manage privacy

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain personal-data processing and rights.                                                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Manage privacy”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Manage privacy                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Manage privacy” without undocumented staff assistance.                    |

### Cookie policy and preferences

Route: /cookies \| Area: Public and authentication \| Primary action: Manage cookies

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain cookies and open consent settings.                                                                                                                      |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Manage cookies”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Manage cookies                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Manage cookies” without undocumented staff assistance.                    |

### Terms and conditions

Route: /terms \| Area: Public and authentication \| Primary action: Read terms

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Present carriage, website and account terms.                                                                                                                |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Read terms”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Read terms                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Read terms” without undocumented staff assistance.                    |

### Sign in

Route: /signin \| Area: Public and authentication \| Primary action: Sign in

| **Specification item** | **Requirement**                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Authenticate customers and staff through the appropriate route.                                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                             |
| Core content           | The screen must present only information needed to complete “Sign in”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Sign in                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                      |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.  |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.              |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.               |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.  |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Sign in” without undocumented staff assistance.                    |

### Create account

Route: /register \| Area: Public and authentication \| Primary action: Create account

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Register an individual or start business registration.                                                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Create account”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create account                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create account” without undocumented staff assistance.                    |

### Password and account recovery

Route: /password \| Area: Public and authentication \| Primary action: Recover account

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Request reset, confirm code and set a new password.                                                                                                              |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Recover account”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Recover account                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Recover account” without undocumented staff assistance.                    |

## Customer portal

### Customer dashboard

Route: /app \| Area: Customer portal \| Primary action: View shipment

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show active shipments, actions, alerts and recent documents.                                                                                                   |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “View shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View shipment” without undocumented staff assistance.                    |

### My shipments

Route: /app/shipments \| Area: Customer portal \| Primary action: Create shipment

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Filter and search all customer shipments.                                                                                                                        |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create shipment” without undocumented staff assistance.                    |

### Shipment detail

Route: /app/shipments/\[id\] \| Area: Customer portal \| Primary action: Track shipment

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show complete authorised shipment information and actions.                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Track shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Track shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Track shipment” without undocumented staff assistance.                    |

### Detailed tracking

Route: /app/shipments/\[id\]/tracking \| Area: Customer portal \| Primary action: Download proof

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show milestone timeline, exceptions and proof of delivery.                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Download proof”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Download proof                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Download proof” without undocumented staff assistance.                    |

### Create shipment

Route: /app/shipments/new \| Area: Customer portal \| Primary action: Start shipment

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Start or resume a logged-in shipment flow.                                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Start shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start shipment” without undocumented staff assistance.                    |

### Draft shipments

Route: /app/drafts \| Area: Customer portal \| Primary action: Resume draft

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List incomplete bookings and expiry dates.                                                                                                                    |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Resume draft”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Resume draft                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Resume draft” without undocumented staff assistance.                    |

### Quotes

Route: /app/quotes \| Area: Customer portal \| Primary action: Request quote

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List draft, pending, issued, accepted and expired quotes.                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Request quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request quote” without undocumented staff assistance.                    |

### Quote detail

Route: /app/quotes/\[id\] \| Area: Customer portal \| Primary action: Accept quote

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show pricing, service, conditions and acceptance.                                                                                                             |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Accept quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Accept quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Accept quote” without undocumented staff assistance.                    |

### Pickups

Route: /app/pickups \| Area: Customer portal \| Primary action: Book pickup

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List scheduled, completed, failed and cancelled pickups.                                                                                                     |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Book pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Book pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Book pickup” without undocumented staff assistance.                    |

### Pickup detail

Route: /app/pickups/\[id\] \| Area: Customer portal \| Primary action: Reschedule

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show address, window, instructions and reschedule controls.                                                                                                 |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Reschedule”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Reschedule                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Reschedule” without undocumented staff assistance.                    |

### Saved addresses

Route: /app/addresses \| Area: Customer portal \| Primary action: Add address

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage validated sender and receiver addresses.                                                                                                              |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Add address”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add address                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add address” without undocumented staff assistance.                    |

### Saved contacts

Route: /app/contacts \| Area: Customer portal \| Primary action: Add contact

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage sender and receiver contacts.                                                                                                                         |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Add contact”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add contact                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add contact” without undocumented staff assistance.                    |

### Payments

Route: /app/payments \| Area: Customer portal \| Primary action: Pay balance

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List payment status, amount and linked invoices.                                                                                                             |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Pay balance”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Pay balance                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Pay balance” without undocumented staff assistance.                    |

### Payment detail

Route: /app/payments/\[id\] \| Area: Customer portal \| Primary action: Download receipt

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show provider reference, allocation, receipt and refund state.                                                                                                    |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Download receipt”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Download receipt                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Download receipt” without undocumented staff assistance.                    |

### Invoices

Route: /app/invoices \| Area: Customer portal \| Primary action: Download invoice

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List invoices, credit notes and outstanding balances.                                                                                                             |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Download invoice”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Download invoice                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Download invoice” without undocumented staff assistance.                    |

### Invoice detail

Route: /app/invoices/\[id\] \| Area: Customer portal \| Primary action: Pay invoice

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show line items, tax information and payment state.                                                                                                          |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Pay invoice”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Pay invoice                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Pay invoice” without undocumented staff assistance.                    |

### Documents

Route: /app/documents \| Area: Customer portal \| Primary action: Upload document

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List customs, commercial, generated and delivery files.                                                                                                          |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Upload document”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Upload document                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Upload document” without undocumented staff assistance.                    |

### Document detail

Route: /app/documents/\[id\] \| Area: Customer portal \| Primary action: Download

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show file type, status, version and authorised download.                                                                                                  |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Download”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Download                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Download” without undocumented staff assistance.                    |

### Claims

Route: /app/claims \| Area: Customer portal \| Primary action: Start claim

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List claim status and required actions.                                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Start claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start claim” without undocumented staff assistance.                    |

### Claim detail

Route: /app/claims/\[id\] \| Area: Customer portal \| Primary action: Add evidence

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show evidence, messages, decision and settlement.                                                                                                             |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Add evidence”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add evidence                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add evidence” without undocumented staff assistance.                    |

### Returns

Route: /app/returns \| Area: Customer portal \| Primary action: Start return

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List return requests and returned shipments.                                                                                                                  |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Start return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start return” without undocumented staff assistance.                    |

### Return detail

Route: /app/returns/\[id\] \| Area: Customer portal \| Primary action: Download label

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show approval, charge, label and tracking.                                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Download label”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Download label                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Download label” without undocumented staff assistance.                    |

### Support tickets

Route: /app/support \| Area: Customer portal \| Primary action: New ticket

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List open and closed support requests.                                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “New ticket”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | New ticket                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “New ticket” without undocumented staff assistance.                    |

### Ticket detail

Route: /app/support/\[id\] \| Area: Customer portal \| Primary action: Reply

| **Specification item** | **Requirement**                                                                                                                                         |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show conversation, attachments and related shipment.                                                                                                    |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                            |
| Core content           | The screen must present only information needed to complete “Reply”, with a clear title, concise explanation, structured data and contextual guidance.  |
| Primary action         | Reply                                                                                                                                                   |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                     |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant. |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.             |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.              |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values. |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Reply” without undocumented staff assistance.                     |

### Notification centre

Route: /app/notifications \| Area: Customer portal \| Primary action: Mark read

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show operational messages and delivery state.                                                                                                              |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Mark read”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Mark read                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Mark read” without undocumented staff assistance.                    |

### Profile and security

Route: /app/profile-security \| Area: Customer portal \| Primary action: Secure account

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage identity, password, passkeys, MFA and sessions.                                                                                                          |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Secure account”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Secure account                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Secure account” without undocumented staff assistance.                    |

### Preferences and consent

Route: /app/preferences \| Area: Customer portal \| Primary action: Save preferences

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage language, time zone, channels, cookies and marketing consent.                                                                                              |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Save preferences”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Save preferences                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Save preferences” without undocumented staff assistance.                    |

## Business portal

### Business dashboard

Route: /business \| Area: Business portal \| Primary action: Create shipment

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show organisation shipment, spend, delay and credit summaries.                                                                                                   |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create shipment” without undocumented staff assistance.                    |

### Organisation profile

Route: /business/organisation \| Area: Business portal \| Primary action: Edit profile

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage legal, billing and operational company data.                                                                                                           |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Edit profile”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Edit profile                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Edit profile” without undocumented staff assistance.                    |

### Team users

Route: /business/team \| Area: Business portal \| Primary action: Invite user

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Invite, suspend and remove organisation users.                                                                                                               |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Invite user”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Invite user                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Invite user” without undocumented staff assistance.                    |

### Roles and approvals

Route: /business/roles \| Area: Business portal \| Primary action: Create role

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Set organisation permissions and internal approval rules.                                                                                                    |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Create role”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create role                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create role” without undocumented staff assistance.                    |

### Bulk shipment import

Route: /business/import \| Area: Business portal \| Primary action: Upload file

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Upload a controlled shipment spreadsheet.                                                                                                                    |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Upload file”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Upload file                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Upload file” without undocumented staff assistance.                    |

### Import result

Route: /business/import/result \| Area: Business portal \| Primary action: Fix errors

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show validated rows, errors and accepted records.                                                                                                           |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Fix errors”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Fix errors                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Fix errors” without undocumented staff assistance.                    |

### Shipment templates

Route: /business/templates \| Area: Business portal \| Primary action: Create template

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Save repeat routes, contacts, contents and package sets.                                                                                                         |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create template”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create template                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create template” without undocumented staff assistance.                    |

### Saved commodities

Route: /business/commodities \| Area: Business portal \| Primary action: Add commodity

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage reusable customs item descriptions and codes.                                                                                                           |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Add commodity”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add commodity                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add commodity” without undocumented staff assistance.                    |

### Contract rates

Route: /business/rates \| Area: Business portal \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show negotiated rates, effective dates and exclusions.                                                                                                     |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Statements and credit

Route: /business/statements \| Area: Business portal \| Primary action: Pay balance

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show account balance, terms, statements and overdue items.                                                                                                   |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Pay balance”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Pay balance                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Pay balance” without undocumented staff assistance.                    |

### Business reports

Route: /business/reports \| Area: Business portal \| Primary action: Generate report

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Run shipment, cost, delivery and exception reports.                                                                                                              |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Generate report”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Generate report                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Generate report” without undocumented staff assistance.                    |

### API credentials

Route: /business/api \| Area: Business portal \| Primary action: Create key

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create scoped keys and view usage.                                                                                                                          |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Create key”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create key                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create key” without undocumented staff assistance.                    |

### Webhooks and integrations

Route: /business/webhooks \| Area: Business portal \| Primary action: Add webhook

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Register endpoints and inspect delivery attempts.                                                                                                            |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Add webhook”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add webhook                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add webhook” without undocumented staff assistance.                    |

## Administration

### Operations dashboard

Route: /admin \| Area: Administration \| Primary action: Open exceptions

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show live shipment, exception, finance and queue summaries.                                                                                                      |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Open exceptions”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open exceptions                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open exceptions” without undocumented staff assistance.                    |

### Shipment management

Route: /admin/shipments \| Area: Administration \| Primary action: Create shipment

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search, filter and export permitted shipment records.                                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create shipment” without undocumented staff assistance.                    |

### Shipment administration

Route: /admin/shipments/\[id\] \| Area: Administration \| Primary action: Add event

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage complete shipment, packages, documents and events.                                                                                                  |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Add event”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add event                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add event” without undocumented staff assistance.                    |

### Create shipment

Route: /admin/shipments/new \| Area: Administration \| Primary action: Create

| **Specification item** | **Requirement**                                                                                                                                         |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create a shipment on behalf of a customer.                                                                                                              |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                             |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                            |
| Core content           | The screen must present only information needed to complete “Create”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                     |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant. |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.             |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.              |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values. |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create” without undocumented staff assistance.                    |

### Package management

Route: /admin/packages \| Area: Administration \| Primary action: Scan package

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search packages across shipments and locations.                                                                                                               |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Scan package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Scan package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Scan package” without undocumented staff assistance.                    |

### Package detail

Route: /admin/packages/\[id\] \| Area: Administration \| Primary action: Update package

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage measurements, photos, labels and condition.                                                                                                              |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Update package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Update package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Update package” without undocumented staff assistance.                    |

### Tracking event queue

Route: /admin/tracking \| Area: Administration \| Primary action: Resolve event

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review recent events, conflicts and integration errors.                                                                                                        |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Resolve event”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Resolve event                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Resolve event” without undocumented staff assistance.                    |

### Add or correct tracking event

Route: /admin/tracking/new \| Area: Administration \| Primary action: Save event

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create an authorised event or correction with reason.                                                                                                       |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Save event”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Save event                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Save event” without undocumented staff assistance.                    |

### Quote management

Route: /admin/quotes \| Area: Administration \| Primary action: Create quote

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search and manage automatic and manual quotes.                                                                                                                |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Create quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create quote” without undocumented staff assistance.                    |

### Quote detail

Route: /admin/quotes/\[id\] \| Area: Administration \| Primary action: Issue quote

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review cost, margin, approval and customer response.                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Issue quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Issue quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Issue quote” without undocumented staff assistance.                    |

### Pricing rules

Route: /admin/pricing \| Area: Administration \| Primary action: Add rule

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Configure calculation order and eligibility.                                                                                                              |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                               |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Add rule”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add rule                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add rule” without undocumented staff assistance.                    |

### Rate cards

Route: /admin/rate-cards \| Area: Administration \| Primary action: Import rates

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage route, zone, weight and effective-date rates.                                                                                                          |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Import rates”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Import rates                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Import rates” without undocumented staff assistance.                    |

### Surcharges

Route: /admin/surcharges \| Area: Administration \| Primary action: Add surcharge

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage fuel, remote, oversize and operational fees.                                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Add surcharge”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add surcharge                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add surcharge” without undocumented staff assistance.                    |

### Discounts and promotions

Route: /admin/discounts \| Area: Administration \| Primary action: Create discount

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage customer, organisation and campaign discounts.                                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create discount”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create discount                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create discount” without undocumented staff assistance.                    |

### Customer management

Route: /admin/customers \| Area: Administration \| Primary action: Create customer

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search customers and view account state.                                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create customer”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create customer                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create customer” without undocumented staff assistance.                    |

### Customer detail

Route: /admin/customers/\[id\] \| Area: Administration \| Primary action: Update customer

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View identity, shipments, payments, consent and support.                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Update customer”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Update customer                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Update customer” without undocumented staff assistance.                    |

### Business organisations

Route: /admin/organisations \| Area: Administration \| Primary action: Create organisation

| **Specification item** | **Requirement**                                                                                                                                                      |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage business accounts and verification.                                                                                                                           |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                         |
| Core content           | The screen must present only information needed to complete “Create organisation”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create organisation                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                  |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.              |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                          |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                           |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.              |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create organisation” without undocumented staff assistance.                    |

### Organisation detail

Route: /admin/organisations/\[id\] \| Area: Administration \| Primary action: Approve account

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage users, credit, rates and contracts.                                                                                                                       |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Approve account”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Approve account                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Approve account” without undocumented staff assistance.                    |

### Pickup management

Route: /admin/pickups \| Area: Administration \| Primary action: Assign pickup

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Schedule, assign, monitor and reschedule pickups.                                                                                                              |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Assign pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Assign pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Assign pickup” without undocumented staff assistance.                    |

### Pickup detail

Route: /admin/pickups/\[id\] \| Area: Administration \| Primary action: Update pickup

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View address, packages, driver and evidence.                                                                                                                   |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Update pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Update pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Update pickup” without undocumented staff assistance.                    |

### Delivery assignments

Route: /admin/deliveries \| Area: Administration \| Primary action: Assign delivery

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage last-mile assignments and exceptions.                                                                                                                     |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Assign delivery”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Assign delivery                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Assign delivery” without undocumented staff assistance.                    |

### Delivery detail

Route: /admin/deliveries/\[id\] \| Area: Administration \| Primary action: Update delivery

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View route, attempts, evidence and recipient result.                                                                                                             |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Update delivery”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Update delivery                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Update delivery” without undocumented staff assistance.                    |

### Warehouse management

Route: /admin/warehouses \| Area: Administration \| Primary action: Add warehouse

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage active facilities and operating rules.                                                                                                                  |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Add warehouse”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add warehouse                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add warehouse” without undocumented staff assistance.                    |

### Warehouse detail

Route: /admin/warehouses/\[id\] \| Area: Administration \| Primary action: Edit warehouse

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View inventory, staff, capacity and settings.                                                                                                                   |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Edit warehouse”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Edit warehouse                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Edit warehouse” without undocumented staff assistance.                    |

### Warehouse inventory

Route: /admin/inventory \| Area: Administration \| Primary action: Move package

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Find packages by facility, zone, shelf or exception.                                                                                                          |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Move package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Move package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Move package” without undocumented staff assistance.                    |

### Consolidation queue

Route: /admin/consolidation \| Area: Administration \| Primary action: Create consolidation

| **Specification item** | **Requirement**                                                                                                                                                       |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Group eligible packages and record approvals.                                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                          |
| Core content           | The screen must present only information needed to complete “Create consolidation”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create consolidation                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                   |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.               |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                           |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                            |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.               |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create consolidation” without undocumented staff assistance.                    |

### Repacking queue

Route: /admin/repacking \| Area: Administration \| Primary action: Approve repacking

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review packaging issues, costs and completion evidence.                                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Approve repacking”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Approve repacking                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Approve repacking” without undocumented staff assistance.                    |

### Dispatch and manifests

Route: /admin/dispatch \| Area: Administration \| Primary action: Create manifest

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Build dispatch batches and close manifests.                                                                                                                      |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create manifest”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create manifest                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create manifest” without undocumented staff assistance.                    |

### Customs queue

Route: /admin/customs \| Area: Administration \| Primary action: Open case

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Prioritise cases requiring documents, payment or broker action.                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Open case”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open case                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open case” without undocumented staff assistance.                    |

### Customs case detail

Route: /admin/customs/\[id\] \| Area: Administration \| Primary action: Request document

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage declarations, broker messages, deadlines and releases.                                                                                                     |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Request document”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request document                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request document” without undocumented staff assistance.                    |

### Document review

Route: /admin/document-review \| Area: Administration \| Primary action: Review document

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Approve, reject or request replacement documents.                                                                                                                |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Review document”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Review document                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Review document” without undocumented staff assistance.                    |

### Payment management

Route: /admin/payments \| Area: Administration \| Primary action: Reconcile

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search payment and reconciliation records.                                                                                                                 |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Reconcile”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Reconcile                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Reconcile” without undocumented staff assistance.                    |

### Payment detail

Route: /admin/payments/\[id\] \| Area: Administration \| Primary action: Take action

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View payment events, allocation, dispute and refund links.                                                                                                   |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Take action”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Take action                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Take action” without undocumented staff assistance.                    |

### Invoice management

Route: /admin/invoices \| Area: Administration \| Primary action: Create invoice

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search invoices, credit notes and overdue balances.                                                                                                             |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Create invoice”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create invoice                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create invoice” without undocumented staff assistance.                    |

### Invoice detail

Route: /admin/invoices/\[id\] \| Area: Administration \| Primary action: Issue invoice

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review line items, tax, payment and e-invoice state.                                                                                                           |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Issue invoice”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Issue invoice                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Issue invoice” without undocumented staff assistance.                    |

### Refund queue

Route: /admin/refunds \| Area: Administration \| Primary action: Review refund

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review requested and approved refunds.                                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Review refund”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Review refund                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Review refund” without undocumented staff assistance.                    |

### Refund detail

Route: /admin/refunds/\[id\] \| Area: Administration \| Primary action: Approve refund

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Record reason, approvals, amount and provider result.                                                                                                           |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Approve refund”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Approve refund                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Approve refund” without undocumented staff assistance.                    |

### Claims queue

Route: /admin/claims \| Area: Administration \| Primary action: Open claim

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Prioritise and assign claims.                                                                                                                               |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Open claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open claim” without undocumented staff assistance.                    |

### Claim detail

Route: /admin/claims/\[id\] \| Area: Administration \| Primary action: Decide claim

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review evidence, liability, carrier case and decision.                                                                                                        |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Decide claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Decide claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Decide claim” without undocumented staff assistance.                    |

### Return management

Route: /admin/returns \| Area: Administration \| Primary action: Approve return

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review return requests and return shipments.                                                                                                                    |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Approve return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Approve return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Approve return” without undocumented staff assistance.                    |

### Return detail

Route: /admin/returns/\[id\] \| Area: Administration \| Primary action: Create return

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage charges, label, pickup and return tracking.                                                                                                             |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Create return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create return” without undocumented staff assistance.                    |

### Support tickets

Route: /admin/support \| Area: Administration \| Primary action: Open ticket

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View escalated and shipment-related support records.                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Open ticket”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open ticket                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open ticket” without undocumented staff assistance.                    |

### Support ticket detail

Route: /admin/support/\[id\] \| Area: Administration \| Primary action: Add note

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View support context and operational actions.                                                                                                             |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                               |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Add note”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add note                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add note” without undocumented staff assistance.                    |

### Notification centre

Route: /admin/notifications \| Area: Administration \| Primary action: Retry notification

| **Specification item** | **Requirement**                                                                                                                                                     |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Inspect operational sends, failures and retries.                                                                                                                    |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                        |
| Core content           | The screen must present only information needed to complete “Retry notification”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Retry notification                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                 |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.             |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                         |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                          |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.             |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Retry notification” without undocumented staff assistance.                    |

### Message templates

Route: /admin/templates \| Area: Administration \| Primary action: Create template

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage approved email, SMS, WhatsApp and document templates.                                                                                                     |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create template”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create template                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create template” without undocumented staff assistance.                    |

### Staff management

Route: /admin/staff \| Area: Administration \| Primary action: Invite staff

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create, suspend and assign staff.                                                                                                                             |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Invite staff”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Invite staff                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Invite staff” without undocumented staff assistance.                    |

### Staff detail

Route: /admin/staff/\[id\] \| Area: Administration \| Primary action: Update access

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage role, warehouse, sessions and access review.                                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Update access”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Update access                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Update access” without undocumented staff assistance.                    |

### Roles and permissions

Route: /admin/roles \| Area: Administration \| Primary action: Create role

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create roles and review permission grants.                                                                                                                   |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Create role”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create role                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create role” without undocumented staff assistance.                    |

### Administration reports

Route: /admin/reports \| Area: Administration \| Primary action: Generate report

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Run operational, financial, customs, warehouse and support reports.                                                                                              |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Generate report”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Generate report                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Generate report” without undocumented staff assistance.                    |

### Audit log

Route: /admin/audit \| Area: Administration \| Primary action: Export permitted log

| **Specification item** | **Requirement**                                                                                                                                                       |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search append-only high-risk activity.                                                                                                                                |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                          |
| Core content           | The screen must present only information needed to complete “Export permitted log”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Export permitted log                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                   |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.               |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                           |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                            |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.               |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Export permitted log” without undocumented staff assistance.                    |

### Content management

Route: /admin/content \| Area: Administration \| Primary action: Create content

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage public pages, guides, FAQs, alerts and policies.                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Create content”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create content                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create content” without undocumented staff assistance.                    |

### System settings and integrations

Route: /admin/settings \| Area: Administration \| Primary action: Open setting

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage controlled configuration and provider connections.                                                                                                     |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Open setting”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open setting                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open setting” without undocumented staff assistance.                    |

## Warehouse PWA

### Warehouse sign in

Route: /warehouse/signin \| Area: Warehouse PWA \| Primary action: Sign in

| **Specification item** | **Requirement**                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Authenticate the warehouse employee and select facility.                                                                                                 |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                             |
| Core content           | The screen must present only information needed to complete “Sign in”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Sign in                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                      |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.  |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.              |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.               |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.  |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Sign in” without undocumented staff assistance.                    |

### Warehouse dashboard

Route: /warehouse \| Area: Warehouse PWA \| Primary action: Scan package

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show receipt, inspection, storage, dispatch and exception workload.                                                                                           |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Scan package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Scan package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Scan package” without undocumented staff assistance.                    |

### Receive shipment

Route: /warehouse/receive \| Area: Warehouse PWA \| Primary action: Confirm receipt

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Scan master or package code and confirm physical receipt.                                                                                                        |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Confirm receipt”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Confirm receipt                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Confirm receipt” without undocumented staff assistance.                    |

### Package scanner

Route: /warehouse/scan \| Area: Warehouse PWA \| Primary action: Open package

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Scan or manually enter a package number.                                                                                                                      |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Open package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open package” without undocumented staff assistance.                    |

### Package inspection

Route: /warehouse/inspect \| Area: Warehouse PWA \| Primary action: Complete inspection

| **Specification item** | **Requirement**                                                                                                                                                      |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Record condition, prohibited-item answers and exceptions.                                                                                                            |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                         |
| Core content           | The screen must present only information needed to complete “Complete inspection”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Complete inspection                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                  |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.              |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                          |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                           |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.              |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Complete inspection” without undocumented staff assistance.                    |

### Measure and weigh

Route: /warehouse/measure \| Area: Warehouse PWA \| Primary action: Save measurements

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture actual dimensions and calibrated weight.                                                                                                                   |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Save measurements”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Save measurements                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Save measurements” without undocumented staff assistance.                    |

### Package photographs

Route: /warehouse/photos \| Area: Warehouse PWA \| Primary action: Upload photos

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture required exterior, label and damage images.                                                                                                            |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                               |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Upload photos”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Upload photos                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Upload photos” without undocumented staff assistance.                    |

### Storage assignment

Route: /warehouse/storage \| Area: Warehouse PWA \| Primary action: Assign location

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Assign facility zone, shelf, bin and handling class.                                                                                                             |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Assign location”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Assign location                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Assign location” without undocumented staff assistance.                    |

### Move package

Route: /warehouse/move \| Area: Warehouse PWA \| Primary action: Confirm move

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Scan from and to locations and record movement.                                                                                                               |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Confirm move”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Confirm move                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Confirm move” without undocumented staff assistance.                    |

### Consolidation

Route: /warehouse/consolidate \| Area: Warehouse PWA \| Primary action: Complete consolidation

| **Specification item** | **Requirement**                                                                                                                                                         |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Confirm package set, create consolidated package and measurements.                                                                                                      |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                            |
| Core content           | The screen must present only information needed to complete “Complete consolidation”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Complete consolidation                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                     |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.                 |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                             |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                              |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.                 |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Complete consolidation” without undocumented staff assistance.                    |

### Repacking

Route: /warehouse/repack \| Area: Warehouse PWA \| Primary action: Complete repacking

| **Specification item** | **Requirement**                                                                                                                                                     |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Record old condition, materials, result and charge.                                                                                                                 |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                        |
| Core content           | The screen must present only information needed to complete “Complete repacking”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Complete repacking                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                 |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.             |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                         |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                          |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.             |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Complete repacking” without undocumented staff assistance.                    |

### Dispatch manifest

Route: /warehouse/dispatch \| Area: Warehouse PWA \| Primary action: Close manifest

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Scan outbound packages and close the manifest.                                                                                                                  |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Close manifest”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Close manifest                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Close manifest” without undocumented staff assistance.                    |

### Warehouse exceptions

Route: /warehouse/exceptions \| Area: Warehouse PWA \| Primary action: Open exception

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Resolve unidentified, damaged, restricted or missing packages.                                                                                                  |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Open exception”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open exception                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open exception” without undocumented staff assistance.                    |

### Offline synchronisation

Route: /warehouse/sync \| Area: Warehouse PWA \| Primary action: Synchronise

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show pending actions, conflicts and last successful sync.                                                                                                    |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                             |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Synchronise”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Synchronise                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Synchronise” without undocumented staff assistance.                    |

## Driver PWA

### Driver sign in

Route: /driver/signin \| Area: Driver PWA \| Primary action: Sign in

| **Specification item** | **Requirement**                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Authenticate driver or delivery partner.                                                                                                                 |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                             |
| Core content           | The screen must present only information needed to complete “Sign in”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Sign in                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                      |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.  |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.              |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.               |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.  |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Sign in” without undocumented staff assistance.                    |

### Driver dashboard

Route: /driver \| Area: Driver PWA \| Primary action: Start route

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show shift, assignments, urgent notes and sync state.                                                                                                        |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Start route”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start route                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start route” without undocumented staff assistance.                    |

### Assignment list

Route: /driver/assignments \| Area: Driver PWA \| Primary action: Open assignment

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List pickups and deliveries in operational order.                                                                                                                |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Open assignment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open assignment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open assignment” without undocumented staff assistance.                    |

### Assignment detail

Route: /driver/assignments/\[id\] \| Area: Driver PWA \| Primary action: Start task

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show permitted contact, address, packages and instructions.                                                                                                 |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                             |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Start task”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start task                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start task” without undocumented staff assistance.                    |

### Route and map

Route: /driver/route \| Area: Driver PWA \| Primary action: Navigate

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show route sequence and navigation launch.                                                                                                                |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Navigate”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Navigate                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Navigate” without undocumented staff assistance.                    |

### Pickup checklist

Route: /driver/pickup-checklist \| Area: Driver PWA \| Primary action: Confirm pickup

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Verify person, package count, condition and declaration.                                                                                                        |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Confirm pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Confirm pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Confirm pickup” without undocumented staff assistance.                    |

### Pickup confirmation

Route: /driver/pickup-confirmation \| Area: Driver PWA \| Primary action: Complete pickup

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture scan, name, signature/photo and timestamp.                                                                                                               |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Complete pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Complete pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Complete pickup” without undocumented staff assistance.                    |

### Delivery checklist

Route: /driver/delivery-checklist \| Area: Driver PWA \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Verify address, package count and service requirement.                                                                                                    |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Recipient verification

Route: /driver/recipient-verification \| Area: Driver PWA \| Primary action: Verify recipient

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture approved identity or one-time-code verification.                                                                                                          |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Verify recipient”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Verify recipient                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Verify recipient” without undocumented staff assistance.                    |

### Signature and photograph

Route: /driver/proof \| Area: Driver PWA \| Primary action: Complete delivery

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture proof of delivery according to service rules.                                                                                                              |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Complete delivery”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Complete delivery                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Complete delivery” without undocumented staff assistance.                    |

### Failed delivery attempt

Route: /driver/failed-attempt \| Area: Driver PWA \| Primary action: Submit attempt

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Record controlled reason, evidence and next action.                                                                                                             |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Submit attempt”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Submit attempt                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Submit attempt” without undocumented staff assistance.                    |

### Offline synchronisation

Route: /driver/sync \| Area: Driver PWA \| Primary action: Synchronise

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show pending actions and conflicts.                                                                                                                          |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Synchronise”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Synchronise                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Synchronise” without undocumented staff assistance.                    |

### Shift history

Route: /driver/history \| Area: Driver PWA \| Primary action: End shift

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show completed tasks and end-of-shift checks.                                                                                                              |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “End shift”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | End shift                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “End shift” without undocumented staff assistance.                    |

## Status and developer

### Public status page

Route: /status \| Area: Status and developer \| Primary action: Subscribe

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show incidents, uptime history and planned maintenance.                                                                                                    |
| Primary audience       | Public status visitors or approved technical partners.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Subscribe”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Subscribe                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Subscribe” without undocumented staff assistance.                    |

### Developer portal

Route: /developers \| Area: Status and developer \| Primary action: Request access

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain API access, environments and onboarding.                                                                                                                |
| Primary audience       | Public status visitors or approved technical partners.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Request access”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request access                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request access” without undocumented staff assistance.                    |

### API reference

Route: /developers/api \| Area: Status and developer \| Primary action: Try sandbox

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Publish versioned OpenAPI documentation.                                                                                                                     |
| Primary audience       | Public status visitors or approved technical partners.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Try sandbox”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Try sandbox                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Try sandbox” without undocumented staff assistance.                    |

### API changelog

Route: /developers/changelog \| Area: Status and developer \| Primary action: Subscribe

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Publish additions, fixes and deprecations.                                                                                                                 |
| Primary audience       | Public status visitors or approved technical partners.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Subscribe”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Subscribe                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Subscribe” without undocumented staff assistance.                    |

### Sandbox access

Route: /developers/sandbox \| Area: Status and developer \| Primary action: Create sandbox key

| **Specification item** | **Requirement**                                                                                                                                                     |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create or manage non-production integration credentials.                                                                                                            |
| Primary audience       | Public status visitors or approved technical partners.                                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                        |
| Core content           | The screen must present only information needed to complete “Create sandbox key”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create sandbox key                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                 |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.             |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                         |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                          |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.             |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create sandbox key” without undocumented staff assistance.                    |

# Appendix C. Tracking status catalogue

| **Code**                | **Customer label**              | **Meaning**                                                              | **Visibility/control**                   |
|-------------------------|---------------------------------|--------------------------------------------------------------------------|------------------------------------------|
| SHIPMENT_CREATED        | Shipment created                | Booking exists; physical package may not yet be received.                | Customer visible                         |
| AWAITING_PAYMENT        | Awaiting payment                | Required payment has not been completed.                                 | Customer visible                         |
| PAYMENT_CONFIRMED       | Payment confirmed               | Required payment has been recorded.                                      | Customer visible                         |
| PICKUP_SCHEDULED        | Pickup scheduled                | Collection date or window is confirmed.                                  | Customer visible                         |
| PACKAGE_COLLECTED       | Package collected               | Driver has collected the package.                                        | Customer visible                         |
| RECEIVED_ORIGIN         | Received at origin facility     | Package has been scanned into the Italian facility.                      | Customer visible                         |
| PROCESSING_ORIGIN       | Processing at origin facility   | Inspection, measuring, packing and documentation checks are in progress. | Customer visible                         |
| DOCUMENTATION_REQUIRED  | Documentation required          | Customer or importer must provide information or a file.                 | Customer visible; action required        |
| MEASUREMENT_REVIEW      | Measurement review              | Actual dimensions or weight differ from the booking.                     | Customer visible if price changes        |
| READY_FOR_EXPORT        | Ready for export                | Origin processing is complete.                                           | Customer visible                         |
| EXPORT_CLEARANCE        | Export clearance in progress    | Export customs processing is underway.                                   | Customer visible                         |
| EXPORT_CLEARED          | Export clearance completed      | Shipment is cleared for departure.                                       | Customer visible                         |
| DEPARTED_ORIGIN         | Departed Italy                  | Shipment has left the origin country or gateway.                         | Customer visible                         |
| INTERNATIONAL_TRANSIT   | In international transit        | Shipment is moving between origin and destination.                       | Customer visible                         |
| ARRIVED_DESTINATION     | Arrived in the United States    | Shipment has reached the destination country or gateway.                 | Customer visible                         |
| IMPORT_CLEARANCE        | Customs clearance in progress   | US import processing is underway.                                        | Customer visible                         |
| CUSTOMS_ACTION_REQUIRED | Customs action required         | Document, clarification or payment is required.                          | Customer visible; action required        |
| CUSTOMS_HELD            | Held by customs                 | Customs or another authority has placed the shipment on hold.            | Customer visible with controlled wording |
| CUSTOMS_CLEARED         | Customs cleared                 | Import release has been received.                                        | Customer visible                         |
| DESTINATION_FACILITY    | At destination facility         | Shipment is at the delivery facility.                                    | Customer visible                         |
| TRANSFERRED_PARTNER     | Transferred to delivery partner | Custody has moved to an approved last-mile partner.                      | Customer visible                         |
| OUT_FOR_DELIVERY        | Out for delivery                | Final delivery attempt is underway.                                      | Customer visible                         |
| DELIVERY_ATTEMPTED      | Delivery attempted              | A delivery was attempted but not completed.                              | Customer visible; action may be required |
| HELD_FOR_COLLECTION     | Held for collection             | Shipment is available at an approved collection point.                   | Customer visible                         |
| DELIVERED               | Delivered                       | Delivery has been completed with required evidence.                      | Customer visible                         |
| DELAYED                 | Shipment delayed                | The current estimate cannot be met.                                      | Customer visible                         |
| ADDRESS_ISSUE           | Address information required    | Address is invalid, incomplete or inaccessible.                          | Customer visible; action required        |
| DAMAGED                 | Damage reported                 | Damage has been identified and an operational review is open.            | Controlled customer wording              |
| MISSING_INVESTIGATION   | Shipment under investigation    | Shipment or package cannot currently be located.                         | Customer visible                         |
| LOST_CONFIRMED          | Shipment loss confirmed         | Investigation concluded that the shipment is lost.                       | Customer visible after approval          |
| RETURN_REQUESTED        | Return requested                | Return workflow has been initiated.                                      | Customer visible                         |
| RETURN_IN_TRANSIT       | Return in transit               | Shipment is moving back to sender or approved destination.               | Customer visible                         |
| RETURNED_SENDER         | Returned to sender              | Return delivery is complete.                                             | Customer visible                         |
| CANCELLED               | Shipment cancelled              | Booking or shipment has been cancelled.                                  | Customer visible                         |
| ARCHIVED                | Archived                        | Operational record is closed and retained.                               | Internal only                            |

## Status transition controls

- A status transition is permitted only by a configured source/role and may require prerequisite status, location, note, document, payment or evidence.

- External carrier statuses are mapped; they do not automatically become customer-visible if the mapping or payload is ambiguous.

- Backdated events retain received time and source time. Corrections link to the original event rather than deleting it.

- Delivered, loss confirmed, refund approved and claim decision transitions require stronger permission and evidence.

# Appendix D. Forms and required fields

## Quote

- Origin country/postcode

- Destination country/ZIP

- Shipment type

- Package count

- Length/width/height

- Actual weight

- Contents summary

- Declared value/currency

- Service speed

- Pickup requirement

- Contact name/email/phone

Form behaviour: persistent labels; required/optional indication; inline validation plus error summary; save draft where appropriate; plain-language privacy explanation; no loss of valid input after error; accessible keyboard and mobile operation.

## Sender

- Person/company

- Full name

- Email

- Phone

- Address lines

- City

- Province

- Postal code

- Country

- Tax/business identifier when required

- Save to address book

Form behaviour: persistent labels; required/optional indication; inline validation plus error summary; save draft where appropriate; plain-language privacy explanation; no loss of valid input after error; accessible keyboard and mobile operation.

## Receiver

- Person/company

- Full name

- Email

- Phone

- Address lines

- City

- State

- ZIP code

- Country

- Delivery instructions

- Importer relationship

Form behaviour: persistent labels; required/optional indication; inline validation plus error summary; save draft where appropriate; plain-language privacy explanation; no loss of valid input after error; accessible keyboard and mobile operation.

## Package

- Package type

- Quantity

- Actual weight

- Length

- Width

- Height

- Units

- Fragile/oversized indicators

- Battery/liquid/food/medicine/chemical questions

- Photograph where requested

Form behaviour: persistent labels; required/optional indication; inline validation plus error summary; save draft where appropriate; plain-language privacy explanation; no loss of valid input after error; accessible keyboard and mobile operation.

## Customs item

- Plain-language description

- Quantity

- Unit value

- Total value

- Currency

- Country of origin

- HS code if known

- Intended use

- Material/composition where relevant

- Manufacturer/brand/model where relevant

Form behaviour: persistent labels; required/optional indication; inline validation plus error summary; save draft where appropriate; plain-language privacy explanation; no loss of valid input after error; accessible keyboard and mobile operation.

## Pickup

- Address

- Contact

- Date

- Time window

- Package count

- Access instructions

- Vehicle/access constraints

- Confirmation consent

Form behaviour: persistent labels; required/optional indication; inline validation plus error summary; save draft where appropriate; plain-language privacy explanation; no loss of valid input after error; accessible keyboard and mobile operation.

## Claim

- Tracking number

- Claimant role

- Claim type

- Incident date

- Description

- Amount claimed

- Proof of value

- Package photos

- Damage photos

- Packaging photos

- Repair estimate when relevant

- Settlement details after approval

Form behaviour: persistent labels; required/optional indication; inline validation plus error summary; save draft where appropriate; plain-language privacy explanation; no loss of valid input after error; accessible keyboard and mobile operation.

## Support ticket

- Customer contact

- Category

- Tracking number

- Subject

- Description

- Priority evidence

- Attachments

- Preferred response channel

Form behaviour: persistent labels; required/optional indication; inline validation plus error summary; save draft where appropriate; plain-language privacy explanation; no loss of valid input after error; accessible keyboard and mobile operation.

## Business registration

- Legal company name

- Registration number

- VAT/tax number

- Registered address

- Billing address

- Primary contact

- Billing email

- Expected volume

- Services required

- Verification documents

- Terms acceptance

Form behaviour: persistent labels; required/optional indication; inline validation plus error summary; save draft where appropriate; plain-language privacy explanation; no loss of valid input after error; accessible keyboard and mobile operation.

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

# Appendix G. Retention schedule

| **Record**                      | **Default proposed period**                            | **Notes**                                                                          |
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

# Appendix H. Glossary

| **Term**           | **Meaning**                                                                                                                  |
|--------------------|------------------------------------------------------------------------------------------------------------------------------|
| API                | A controlled interface that allows another software system to exchange data with Nauterio.                                   |
| Chargeable weight  | The greater of actual weight and configured volumetric weight for a service.                                                 |
| Commercial invoice | Customs and transaction document describing goods, value, origin and parties.                                                |
| Consignee          | The receiver or party to whom goods are addressed.                                                                           |
| Consignor          | The sender or party tendering goods for transport.                                                                           |
| DDP                | Delivered Duty Paid; a commercial term with import responsibility implications that requires legal and operational approval. |
| DDU/DAP            | Common description for recipient/importer responsibility; actual contractual Incoterm must be selected correctly.            |
| EORI               | EU identifier used for relevant customs operations.                                                                          |
| FCL                | Full Container Load.                                                                                                         |
| HS code            | Harmonised System classification code for goods.                                                                             |
| Idempotency        | A design property that prevents the same request or event from creating duplicate business effects.                          |
| LCL                | Less than Container Load.                                                                                                    |
| PWA                | Progressive Web Application installable from a browser with selected offline capabilities.                                   |
| RPO                | Maximum acceptable amount of data loss measured in time.                                                                     |
| RTO                | Maximum target time to restore critical service after a disaster.                                                            |
| Webhook            | A signed provider-to-platform event callback.                                                                                |

# Appendix I. Official benchmark and technical sources

The specification uses official sources to identify established shipping patterns, regulatory expectations and current technology choices. These sources inform the design; they do not create a carrier partnership or substitute for the company’s legal/contractual advice.

**\[B1\] DHL - DHL MyDHL+ and Tracking.** MyDHL+ combines quotes, shipment creation, pickup scheduling, locations and tracking; DHL tracking explains public tracking-number use. [<u>Primary source</u>](https://www.dhl.com/us-en/home/redirect/express/get-a-quote.html) \| [<u>Additional source</u>](https://www.dhl.com/us-en/home/tracking.html)

**\[B2\] FedEx - FedEx Home, Tracking and Customs Documents.** FedEx prioritises rate-and-ship, tracking, locations, pickup management, proof of delivery and customs-document preparation. [<u>Primary source</u>](https://www.fedex.com/en-us/home.html) \| [<u>Additional source</u>](https://www.fedex.com/en-us/tracking.html)

**\[B3\] UPS - UPS Tracking Support and International Shipping.** UPS exposes tracking, delivery changes, hold/reroute options, claims and international customs guidance. [<u>Primary source</u>](https://www.ups.com/gb/en/support/tracking-support) \| [<u>Additional source</u>](https://www.ups.com/gb/en/shipping/how-to-ship-internationally)

**\[B4\] USPS - USPS Home, International Shipping and Claims.** USPS provides public tracking, labels, pickup scheduling, Informed Delivery and structured missing-mail/claims journeys. [<u>Primary source</u>](https://www.usps.com/) \| [<u>Additional source</u>](https://www.usps.com/help/claims.htm)

**\[B5\] Maersk - Maersk Tracking, Instant Prices and Booking.** Maersk provides cargo tracking, instant prices, route availability, booking, shipment modification and document workflows. [<u>Primary source</u>](https://www.maersk.com/tracking/) \| [<u>Additional source</u>](https://www.maersk.com/digital-booking-overview)

**\[L1\] European Commission - EORI Guidance.** EU customs operations use an Economic Operators Registration and Identification number where applicable. [<u>Primary source</u>](https://taxation-customs.ec.europa.eu/customs/customs-procedures-import-and-export/customs-operations/economic-operators-registration-and-identification-number-eori_en)

**\[L2\] European Commission - EU Data Protection.** GDPR governs processing and international transfers of personal data. [<u>Primary source</u>](https://commission.europa.eu/law/law-topic/data-protection_en)

**\[L3\] European Commission - European Commission Cookies Policy.** Separates operational/preferences cookies from analytics and external cookies. [<u>Primary source</u>](https://commission.europa.eu/cookies-policy_en)

**\[L4\] U.S. Customs and Border Protection - Prohibited and Restricted Items.** CBP publishes categories of goods that may be prohibited or restricted on entry to the United States. [<u>Primary source</u>](https://www.cbp.gov/travel/us-citizens/know-before-you-go/prohibited-and-restricted-items)

**\[L5\] U.S. Customs and Border Protection - Acceptable Cargo Descriptions.** Cargo descriptions must be specific enough to identify the goods rather than vague labels. [<u>Primary source</u>](https://www.cbp.gov/trade/basic-import-export/e-commerce/examples-unacceptable-vs-acceptable-cargo-descriptions)

**\[L6\] IATA - Lithium Battery Guidance.** Lithium and sodium-ion battery shipments require controlled classification, packing, marking and documentation. [<u>Primary source</u>](https://www.iata.org/en/programs/cargo/dgr/lithium-batteries/)

**\[Q1\] W3C - WCAG 2.2.** WCAG 2.2 is the accessibility target for the public and operational interfaces. [<u>Primary source</u>](https://www.w3.org/TR/WCAG22/)

**\[Q2\] OWASP - Application Security Verification Standard.** OWASP ASVS provides the application-security verification baseline. [<u>Primary source</u>](https://owasp.org/www-project-application-security-verification-standard/)

**\[Q3\] OWASP - File Upload Cheat Sheet.** Uploaded files require allow-listing, validation, malware controls and private storage. [<u>Primary source</u>](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

**\[T1\] Node.js - Node.js Releases.** Node.js 24 is the active LTS line at specification date. [<u>Primary source</u>](https://nodejs.org/en/about/previous-releases)

**\[T2\] Next.js - Next.js 16.3.** Next.js 16.3 is the selected current framework release. [<u>Primary source</u>](https://nextjs.org/blog/next-16-3)

**\[T3\] NestJS - NestJS 11.** NestJS supplies the modular TypeScript server framework. [<u>Primary source</u>](https://docs.nestjs.com/migration-guide)

**\[T4\] PostgreSQL Global Development Group - PostgreSQL 18.** PostgreSQL 18 is the selected relational database major version. [<u>Primary source</u>](https://www.postgresql.org/docs/current/release-18.html)

**\[T5\] Prisma - Prisma ORM 7.** Prisma 7 is the selected type-safe database toolkit. [<u>Primary source</u>](https://www.prisma.io/docs)

**\[T6\] AWS - AWS Europe (Milan).** Production is designed for the AWS Europe (Milan) region, eu-south-1. [<u>Primary source</u>](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html)

**\[T7\] AWS - AWS Fargate.** Fargate runs containerised services without managing EC2 hosts. [<u>Primary source</u>](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)

**\[T8\] Stripe - Stripe Webhooks.** Payment events must be signature-verified and processed idempotently. [<u>Primary source</u>](https://docs.stripe.com/webhooks)

**\[T9\] Google Maps Platform - Google Address Validation.** Address validation standardises and validates sender and receiver addresses. [<u>Primary source</u>](https://developers.google.com/maps/documentation/address-validation/overview)

**\[T10\] Twilio - Twilio Webhook Security.** Twilio callbacks must use HTTPS and signature verification. [<u>Primary source</u>](https://www.twilio.com/docs/usage/webhooks/webhooks-security)

**\[T11\] Zendesk - Zendesk Messaging.** Zendesk provides agent messaging and support-ticket workflows. [<u>Primary source</u>](https://www.zendesk.com/service/messaging/)

# Appendix J. Final pre-launch evidence checklist

120. Company registration, VAT, EORI, office/warehouse and support details are verified and displayed correctly.

121. Final .com and trademarks are cleared and owned by the company.

122. Carrier, broker, insurer, payment, support, messaging, maps and accounting agreements/accounts are active.

123. Rate cards, zones, package limits, service times, surcharges and margin approvals are loaded and tested.

124. Legal and privacy policies are reviewed and approved for Italy/EU and US operations.

125. Restricted/prohibited categories and escalation contacts are approved.

126. Production AWS/GitHub/domain/provider accounts and root/recovery access are under company control.

127. Warehouse and driver hardware pass real scan/print/offline tests.

128. Accessibility, security, load, backup, recovery and penetration evidence is approved.

129. Staff training, manuals, support scripts and incident runbooks are complete.

130. Controlled pilot shipments complete end-to-end and all critical/high defects are closed.

**END OF SPECIFICATION**

Nauterio Logistics \| Complete Product and Technical Specification \| Version 1.0

Implementation begins only after Product Owner approval and completion of the company-specific evidence checklist.

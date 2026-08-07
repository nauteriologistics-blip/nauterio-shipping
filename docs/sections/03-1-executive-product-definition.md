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

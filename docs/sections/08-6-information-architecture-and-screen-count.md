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

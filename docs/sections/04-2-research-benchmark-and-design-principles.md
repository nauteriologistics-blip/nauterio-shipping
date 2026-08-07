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

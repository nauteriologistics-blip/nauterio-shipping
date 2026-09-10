# Production operating model without direct carrier or payment integration

Date: 2026-09-09

Status: Accepted

Approver: Product owner (explicit direction in the Nauterio implementation session)

## Context

The product owner approved hardcoded online planning prices and the Milan homepage example, declined direct carrier and online-payment integrations for this release, accepted manual customs operations and the current legal/claims policy, and asked that document intake, reporting and driver work be made operational rather than presented as placeholders.

## Decision

- Nauterio publishes one deterministic hardcoded planning-price schedule for supported international country pairs. Duties, taxes, storage and exceptional handling remain separate where applicable.
- The Milan route card remains clearly labelled as an example.
- Nauterio may describe coordination with independent transport partners, but must not claim a named partnership, live carrier connection or carrier-generated schedule.
- Online payment is not offered. Invoice status and any settlement instructions are managed by authorised staff offline.
- Customs remains a staff-managed document and shipment process; no automated customs decision is represented.
- Customer documents use private quarantine storage, declared size/type checks, file-signature validation and malware scanning before staff review or download.
- Admin reports show only live database counters. No fabricated revenue, performance or service-level percentages are displayed.
- Operations staff assign each delivery to an active `DRIVER` account. Drivers can see and complete only assigned work.
- Claims are accepted for active, action-required and delivered shipments; submissions and decisions create in-app status notifications.
- Business-account workflows stay outside current navigation and acceptance scope.

This supersedes the affected deferred-item wording in ADR 0003 for quotes, documents, reports, claims and driver operations. ADR 0003 remains in force for the core request-to-tracking workflow and business-account deferral.

## Alternatives considered

- Direct carrier and payment-provider integrations: rejected for this release by the product owner.
- Fabricated carrier responses or payment success: rejected because they would create false operational and financial records.
- Upload completion without malware scanning: rejected because a private bucket alone does not make untrusted files safe.
- Placeholder analytics: rejected; zero is a valid live count and is preferable to invented data.

## Consequences

Operations staff remain responsible for partner coordination, customs handling, shipment acceptance and offline settlement. The application supports those responsibilities without implying automation that does not exist. A future direct provider integration requires a new ADR, credentials, contract evidence and end-to-end verification.

## Security and privacy

Uploads fail closed when byte verification or scanning fails. Documents remain inaccessible until marked clean. Driver record access is assignment-scoped. Assignment and delivery changes are audited. Existing retention and legal-hold rules remain unchanged.

## Migration and rollback

No database migration is required because the existing `Delivery.assignedDriverUserId`, document scan result, notification and reporting source tables are used. Rollback is an application release rollback; documents already rejected by security scanning remain rejected and tracking history remains append-only.

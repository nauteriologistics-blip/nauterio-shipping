---
name: nauterio-logistics-domain
description: Applies Nauterio shipping-domain rules. Use for quotes, bookings, shipments, packages, tracking statuses, pickups, warehouses, consolidation, dispatch, customs milestones, deliveries, exceptions, claims, and returns.
compatibility: Nauterio Italy-to-USA launch domain.
---

# Nauterio Logistics Domain

## Core model

- A booking expresses the customer's requested service.
- An accepted quote records commercial terms.
- A shipment is the master movement and may contain several packages.
- Each package has its own physical identity, barcode, measurements, condition, and location history.
- Internal, master, package, and carrier tracking numbers may coexist.
- Tracking events are immutable facts from staff, scanner, driver, carrier, partner, or system automation.

## Status transitions

Use the approved catalogue and transition controls. Never allow arbitrary status strings. Validate predecessor, actor permission, required location, timestamp, note, evidence, customer visibility, notification, and reversibility.

- Do not overwrite an event.
- Correct an error with a linked correction/reversal record.
- Preserve original carrier status and raw payload.
- Store event and receipt timestamps separately.
- Display public descriptions that are accurate but do not reveal sensitive operational detail.

## Package operations

- Warehouse receipt confirms package count and condition.
- Re-measurement may change the chargeable weight and trigger customer approval/payment.
- Consolidation and splitting require explicit parent-child history.
- Every location movement is scanned or otherwise attributed.
- Label reprints and package exceptions are audited.

## Delivery

- Assignments are scoped to authorised drivers/partners.
- Delivery evidence depends on service and risk: name, signature, photograph, timestamp, GPS, one-time code, or identification confirmation.
- Failed attempts need a controlled reason and next action.
- Proof of delivery is sensitive and access-controlled.

## Exceptions

Model delay, customs action, missing, damaged, address problem, recipient unavailable, return, cancellation, and investigation as explicit workflows, not free-text notes alone.

## References

- `docs/sections/05-3-business-model-and-services.md`
- `docs/sections/07-5-end-to-end-operating-journeys.md`
- `docs/sections/44-appendix-c-tracking-status-catalogue.md`
- `docs/sections/45-appendix-d-forms-and-required-fields.md`

# Phase 3: live shipment tracking operations

## Delivered

- Operations staff can record a shipment's status, event time, location, public description, internal notes, reason, and evidence.
- The API accepts only the curated launch-MVP tracking catalogue.
- Reason and approved evidence requirements are enforced server-side.
- Tracking events update the shipment's current status and lifecycle atomically.
- Delivery timestamps and action-required messages are maintained automatically.
- Invalid lifecycle changes and all changes to archived shipments are rejected.
- Staff can correct only the latest effective event. Corrections append a replacement linked to the original; history is never deleted or overwritten.
- Public tracking and the customer dashboard immediately reflect the latest effective event.
- Each update creates an audit entry and transactional outbox event.
- The worker routes status-update notifications to the shipment owner.

## API

- `GET /v1/admin/shipments/:shipmentId/tracking-events/statuses`
- `POST /v1/admin/shipments/:shipmentId/tracking-events`
- `POST /v1/admin/shipments/:shipmentId/tracking-events/:eventId/corrections`

Writes require idempotency keys and the existing tracking-event permissions.

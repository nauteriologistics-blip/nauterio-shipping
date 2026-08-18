# Phase 2: shipment request workflow

## Delivered

- Customers save a shipment request as a draft and submit it for review.
- Submission validates sender, receiver, goods, service, weight, and dimensions.
- Submitted requests become immutable to the customer.
- Operations staff can list pending requests and approve or reject each request.
- Rejection requires a reason, which is displayed on the customer dashboard.
- Approval is concurrency-safe and atomically creates the shipment, package, initial tracking event, outbox event, audit record, and tracking number.
- The customer dashboard shows pending and rejected requests separately from active shipments.
- The admin dashboard reports requests awaiting review.

## API

- `POST /v1/bookings/:id/submit`
- `GET /v1/bookings/admin/requests?status=SUBMITTED`
- `POST /v1/bookings/:id/approve`
- `POST /v1/bookings/:id/reject`

All mutating endpoints require idempotency keys. Staff review endpoints use the existing permission guard.

# Customer and admin shipping MVP scope

## Decision

The first production release focuses on one complete operating loop:

1. A customer registers, signs in, and submits a shipment request.
2. An administrator reviews and approves or rejects the request.
3. Approval converts the request into a shipment and assigns a public tracking number.
4. An administrator records each physical movement or exception as a tracking event.
5. The customer sees the current status, history, estimated delivery, and any required action.
6. The shipment is delivered, cancelled, and optionally archived.

## Included

- Customer registration, sign-in, account status, and profile identity
- Shipment request form with sender, receiver, goods, package, service, reference, and notes fields
- Request review and the `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`, `CONVERTED`, and `CANCELLED` states
- Admin shipment creation, unique tracking-number assignment, lifecycle controls, and event corrections
- Customer dashboard, admin operations dashboard, public tracking, notifications, and optional supporting documents
- English and Italian customer-facing navigation

## Deferred

- Online quotes, payments, invoices, customs balances, and advanced pricing
- Automated carrier, port, customs, warehouse, or driver integrations
- Claims, returns, business accounts, analytics reports, and finance workflows

Deferred database structures may remain when they do not affect the MVP. Deferred routes are not part of navigation or release acceptance.

## Workflow rules

The canonical request, shipment, and tracking-status definitions live in `packages/contracts/src/mvp.ts`. Invalid backward transitions are rejected by those contracts. Delivered or cancelled shipments may only be archived; archived shipments are terminal.

## Deployment boundary

- Vercel: customer web and admin web
- Render: API and background worker
- Neon: PostgreSQL
- Upstash: Redis-backed queues, rate limiting, and short-lived state

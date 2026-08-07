---
name: nauterio-payments-billing
description: Implements Nauterio pricing, quotes, payments, refunds, invoices, credits, currencies, and reconciliation. Use for Stripe, PayPal, bank transfers, calculation rules, financial states, webhooks, and accounting exports.
compatibility: Stripe-primary payment architecture with EUR primary accounting and USD support.
---

# Nauterio Payments and Billing

## Pricing

- Calculate actual, volumetric, and chargeable weight using configurable service rules.
- Separate transport, pickup, delivery, handling, fuel, remote-area, oversized, fragile, repacking, storage, insurance, customs-processing, redelivery, return, tax, discount, and corporate-rate components.
- Record the rate-card version and every input used.
- Show a clear breakdown and label duties/taxes as estimates unless contractually included.
- Recalculate when verified measurements differ; never silently charge a changed amount.

## Quotes

- Standard parcels may receive an automated estimate.
- Sea freight, pallets, commercial cargo, restricted goods, high value, unusual dimensions, and special delivery require manual review.
- Accepted quotes are versioned and lock currency/exchange assumptions.
- Quote-to-booking conversion must be idempotent.

## Payments

- Use hosted/provider-controlled payment elements. Never store full card numbers or security codes.
- Treat provider webhooks as the source of payment outcome, after signature verification.
- Use idempotency keys and a unique provider-event ledger.
- Payment success must not be inferred from a browser redirect alone.
- Bank transfers remain pending until reconciled or confirmed by authorised finance staff with evidence.

## Refunds and adjustments

- Refunds require role-based approval, reason, amount, currency, related payment, operational confirmation, and audit.
- Use partial refunds, credit notes, or additional invoices rather than editing settled financial history.
- Handle disputes and chargebacks as explicit cases.

## Invoicing

- Generate immutable numbered invoices and receipts.
- Support Italian electronic-invoicing integration selected with the accountant.
- Keep tax treatment configurable and legally reviewed.

## References

- `docs/sections/17-15-pricing-payments-and-invoicing.md`
- `docs/sections/27-25-database-and-data-model.md`
- `docs/sections/32-30-external-integrations.md`

---
name: nauterio-integrations
description: Implements Nauterio external integrations and adapters. Use for DHL, FedEx, UPS, EasyPost, Stripe, PayPal, Twilio, WhatsApp, SES, Zendesk, Google Maps, customs brokers, accounting, and partner webhooks.
compatibility: Adapter-based NestJS integration layer with queues and signed webhooks.
---

# Nauterio Integration Engineering

## Adapter contract

Every provider adapter must expose a provider-neutral interface, map provider data to internal contracts, preserve raw provider payloads securely, classify errors, support test/live environments, and publish operational metrics.

## Inbound webhooks

1. Read the raw request body when required by signature verification.
2. Verify signature, timestamp, account, and endpoint secret.
3. Store a unique provider event ID and reject/reuse duplicates safely.
4. Acknowledge quickly and process asynchronously.
5. Map to internal events through the adapter.
6. Record success/failure and retry transient errors.
7. Route exhausted failures to a dead-letter queue with replay controls.

## Outbound calls

- Set explicit timeouts.
- Retry only safe/transient operations.
- Use idempotency keys for creation or payment operations.
- Apply circuit breakers or graceful degradation for unstable providers.
- Never expose provider credentials to browsers.
- Maintain sandbox and production configurations separately.

## Carrier rules

Keep internal tracking, package, and status semantics independent of any carrier. Store carrier status, description, event time, location, tracking number, raw payload, received time, and mapping version.

## Messaging

Record template, language, recipient, channel, shipment, provider ID, status, retry count, failure reason, and timestamps. Separate mandatory operational messages from consent-based marketing.

## Address and maps

Treat address validation suggestions as assistance, not automatic replacement. Preserve entered and standardised forms with user confirmation when material.

## Testing

Use contract fixtures, signature tests, sandbox calls, replay tests, duplicate-event tests, timeout tests, and provider-outage tests. Do not depend on live external services in the normal test suite.

## References

- `docs/sections/28-26-api-and-webhook-specification.md`
- `docs/sections/31-29-events-queues-caching-and-scheduled-work.md`
- `docs/sections/32-30-external-integrations.md`
- `docs/sections/47-appendix-f-notification-catalogue.md`

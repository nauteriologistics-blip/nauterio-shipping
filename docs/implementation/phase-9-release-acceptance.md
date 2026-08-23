# Phase 9: security, performance, and release acceptance

## Delivered

- CI security-invariant and committed-secret scan.
- Document and malware state-transition regression tests.
- Production smoke assertions for disabled API documentation and anonymous protected-route rejection.
- Authenticated, read-only acceptance checks for customer identity, documents, shipments, staff identity, shipment requests, and document review.
- Configurable health-endpoint load smoke with concurrency, zero-error, and p95 latency gates.
- CSP, anti-framing, MIME-sniffing, referrer, and production HSTS headers across API, customer site, and admin site.
- Release rollback, database recovery, queue recovery, security-incident, no-payment, Render free-worker, keep-warm, backup/restore, and monitoring runbooks.

## Commands

```bash
pnpm security:check
pnpm smoke:production
pnpm acceptance:production
pnpm worker:readiness
pnpm monitoring:readiness
pnpm smoke:load
```

The authenticated acceptance suite is read-only. Its customer and staff tokens must belong to dedicated staging acceptance accounts and must be supplied only through secret environment variables.

## Go-live decision

A release is not accepted until CI and Docker builds pass, staging migrations complete, production/staging smoke and acceptance suites pass, a current database restore point exists, worker readiness is clean, monitoring evidence is attached, and the external Resend, Cognito, R2/scanner when document upload is enabled, Neon, Upstash, Render, Vercel, and Cloudflare integrations have been exercised with non-production accounts.

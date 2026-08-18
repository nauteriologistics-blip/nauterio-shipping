# Phase 5: production readiness

## Delivered

- Customer sessions are now random, hashed at rest, expiring, revocable, and invalidated by logout.
- Expired and old revoked sessions are removed by the worker.
- API and worker Docker images use Node.js 24, matching the repository engine declaration.
- `render.yaml` defines the paid API web service and background worker in Frankfurt, health checking, graceful shutdown, migration execution, and secret placeholders.
- GitHub Actions validates types, lint, workflow-contract tests, and production builds before Render's `checksPass` deployment trigger can deploy.
- `scripts/release-check.mjs` verifies the required migration and deployment structure.
- `scripts/smoke-production.mjs` verifies API liveness/readiness plus the customer and admin entry points after deployment.
- Vercel and Render environment examples document the current Neon, Upstash, Render, and Vercel boundary.

## Required configuration before production traffic

### Render

- Set `DATABASE_URL` to the Neon pooled PostgreSQL URL.
- Set `REDIS_URL` to the Upstash TLS Redis URL.
- Set `WEB_APP_URL` to the production Vercel customer URL.
- Keep `NODE_ENV=production`, `LOCAL_AUTH_MODE=false`, and `ENABLE_API_DOCS=false`.
- The API service must remain on a paid plan for `preDeployCommand` migration support.
- For a brand-new Neon database, follow `docs/runbooks/database-migrations.md` for the historical `20260809150000_concurrent_indexes` migration before enabling automatic `migrate deploy`; an already-baselined database needs no repeat application.

### Vercel

- Create separate projects rooted at `apps/web` and `apps/admin`.
- Set `NAUTERIO_API_URL` in both projects to the Render API origin.

## Explicit launch blockers

- Production registration needs a transactional email provider to deliver the one-time verification link. The API correctly withholds that link from production responses.
- Staff login needs a configured identity provider (the existing Cognito verifier) or a dedicated staff-session issuance flow. Never enable `LOCAL_AUTH_MODE` in production.
- Secure file uploads still need private object storage and malware scanning, as recorded in Phase 4.

The deployment configuration is ready to use, but production traffic must not be enabled until these external identity/email/storage items are configured and a real staging smoke test passes.

Run that smoke test with:

```bash
NAUTERIO_API_URL=https://api.example.com \
NAUTERIO_WEB_URL=https://www.example.com \
NAUTERIO_ADMIN_URL=https://admin.example.com \
pnpm smoke:production
```

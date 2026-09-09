# Render free deployment, worker, and keep-warm

Render free plans do not support a separate background worker service. Nauterio therefore runs the API and worker in one free web service using `scripts/start-render.mjs`.

## Render

- Blueprint service: `nauterio-api`
- Plan: `free`
- Dockerfile: `apps/api/Dockerfile`
- Runtime command: the Docker `CMD` starts `scripts/start-render.mjs`
- Supervisor starts:
  - `apps/api/dist/main.js`
  - `apps/worker/dist/main.js`

If either child exits unexpectedly, the supervisor terminates the container so Render restarts the service.

## Cloudflare keep-warm

Deploy `infra/cloudflare/render-keepalive` as a Cloudflare Worker. It runs every five minutes and calls:

`https://nauterio-shipping.onrender.com/v1/healthz`

The endpoint returns no body, no cache, and no index headers, so it is safe for a public keep-warm ping.

## GitHub Actions fallback

`.github/workflows/keep-api-warm.yml` calls the production `healthz` endpoint
every five minutes and can also be triggered manually. Keep this fallback
enabled until the Cloudflare worker is deployed or the Render service is moved
to an always-on plan. The workflow uses only the public liveness endpoint and
does not require production credentials.

## Verification

Run:

```bash
pnpm smoke:production
pnpm worker:readiness
pnpm pilot:daily-report
```

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

## Verification

Run:

```bash
pnpm smoke:production
pnpm worker:readiness
pnpm pilot:daily-report
```

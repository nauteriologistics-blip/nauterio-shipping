# Backup, restore, and monitoring acceptance

General launch is not accepted until evidence exists for each item below.

## Required evidence

- Neon backup/restore evidence URL or screenshot.
- Render logs evidence URL or screenshot showing API and worker supervisor startup.
- Upstash metrics evidence URL or screenshot showing Redis availability.
- Production smoke output for API, web, admin, protected anonymous rejection, and docs-disabled check.
- Worker readiness output showing zero failed outbox events and zero critical pilot issues.
- Malware scanner configuration evidence if document upload is enabled for the environment.

## Commands

```bash
pnpm smoke:production
pnpm acceptance:production
pnpm worker:readiness
pnpm monitoring:readiness
pnpm pilot:daily-report
```

`pnpm monitoring:readiness` intentionally requires evidence URLs through environment variables so launch cannot be marked complete from code checks alone.

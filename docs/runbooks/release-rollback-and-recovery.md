# Release rollback and recovery

## Go-live gate

Do not enable production traffic unless CI, image builds, migrations, `smoke:production`, `acceptance:production`, and `smoke:load` all pass. Confirm a current Neon restore point and record the deployed Git commit.

## Application rollback

1. Stop automatic deployment of the failing commit.
2. Roll Render API and worker back to the last known-good image together.
3. Roll both Vercel projects back to their matching known-good deployments.
4. Run the basic and authenticated smoke suites.
5. Re-enable traffic only when health, authentication, customer dashboard, admin queues, and worker processing are confirmed.

## Database recovery

Database migrations are forward-only. Do not manually delete migration records or run destructive resets. If a migration is incompatible, deploy a corrective migration. If data corruption occurred, stop API and worker writes, restore Neon to a new branch from the pre-release restore point, verify counts and critical relationships, change `DATABASE_URL` on both Render services, then run acceptance checks before reopening traffic.

## Queue recovery

After restoring the database, inspect outbox rows in `PENDING`, `PUBLISHING`, and `FAILED`. The worker reclaims expired publishing leases. Do not reset failed events blindly: determine whether the operation is idempotent and whether its external effect already occurred before retrying.

## Security incident

Revoke affected sessions and rotate Cognito, Resend, R2, scanner, Neon, and Upstash credentials as applicable. Keep audit records intact. Preserve logs and correlation IDs, then verify that no old credential can access a protected endpoint.

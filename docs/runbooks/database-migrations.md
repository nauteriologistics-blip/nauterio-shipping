# Runbook: applying database migrations

## The `nauterio_app` least-privilege role

`20260809170000_app_role_least_privilege` creates a `nauterio_app` Postgres role with SELECT/INSERT/UPDATE/DELETE on every table except the append-only ones (which it can SELECT/INSERT only, plus UPDATE on `outbox_events` specifically) — real GRANT-level enforcement of the append-only invariant, independent of the `BEFORE UPDATE/DELETE` triggers. Verified locally: connected as `nauterio_app`, normal CRUD (including a full API boot and a real quote write) succeeds, while `UPDATE`/`DELETE` on any append-only table fails with `permission denied` before the trigger even runs.

**Not yet done — a real remaining gap, not silently assumed complete:** neither `apps/api` nor `apps/worker` actually connects as `nauterio_app` in any environment. Locally they still use the superuser connection (`DATABASE_URL` in `.env`) for developer convenience — migrations need DDL/`CREATEROLE` rights `nauterio_app` deliberately lacks, so a single shared local connection string can't serve both purposes without a two-URL setup this hasn't been changed to require. In the CDK-provisioned RDS instance, `nauterio_admin` (the RDS *master* credential) remains the one the API/worker ECS tasks connect as. Wiring the actual runtime connection to `nauterio_app` needs one of:
- A CDK Custom Resource (Lambda) that sets `nauterio_app`'s password from a dedicated Secrets Manager secret at deploy time (CloudFormation has no native "run this SQL" primitive for a role that isn't the RDS master user), or
- RDS IAM database authentication (`iamAuthentication: true` on the instance, `rds-db:connect` IAM policy on the ECS task role, `GRANT rds_iam TO nauterio_app` — already conditionally applied by the migration above) plus short-lived-token generation/refresh logic in `packages/database/src/index.ts`, replacing the current static-password connection.

Either path is real infrastructure/application work that cannot be verified without a real AWS account and a deployed RDS instance — it was not attempted blind. Until it lands, the GRANT-level protection above exists and is correct, but is not yet load-bearing in any deployed environment; the trigger-level protection (already load-bearing everywhere, verified in `docs/audit/BACKEND_AUDIT_EVIDENCE.md`) remains the actual enforcement mechanism until this is completed.

## Standard migrations

Any migration whose statements can run inside a transaction (the vast majority — `CREATE TABLE`, `ADD COLUMN`, `ADD CONSTRAINT ... NOT VALID`, plain `CREATE INDEX` on a small/new table, etc.) is applied the normal way:

```bash
pnpm --filter @nauterio/database exec prisma migrate deploy
```

This wraps each migration's SQL in one transaction — if any statement fails, the whole migration rolls back cleanly.

## `NOT VALID` constraints on a populated table

Two-phase: add the constraint without validating existing rows (fast, brief lock), then validate separately (slower, but only takes a `SHARE UPDATE EXCLUSIVE` lock — concurrent with reads and writes):

```sql
ALTER TABLE "some_table" ADD CONSTRAINT "..." CHECK (...) NOT VALID;
ALTER TABLE "some_table" VALIDATE CONSTRAINT "...";
```

Both statements can go in one normal `migrate deploy`-applied migration file — this is the pattern used in `20260809120500_tracking_integrity_and_indexes` for `tracking_events_canonical_code_valid`.

## `CREATE INDEX CONCURRENTLY` on a production-sized table

**Cannot be applied via `prisma migrate deploy`.** Postgres refuses to run `CREATE INDEX CONCURRENTLY` (or `DROP INDEX CONCURRENTLY`) inside a transaction block, and `migrate deploy` always wraps a migration's SQL in one transaction with no per-statement opt-out. Attempting it will fail with:

```
ERROR:  CREATE INDEX CONCURRENTLY cannot run inside a transaction block
```

Apply these migrations manually, in this order, before the next `migrate deploy`:

1. **Run the migration file directly against the target database**, outside Prisma:
   ```bash
   psql "$DATABASE_URL" -f packages/database/prisma/migrations/<name>/migration.sql
   ```
   `psql -f` autocommits each top-level statement by default (no implicit `BEGIN`/`COMMIT` wrapping the whole file), which is what lets `CONCURRENTLY` succeed.

2. **Register the migration as applied in Prisma's own history**, without re-executing it:
   ```bash
   pnpm --filter @nauterio/database exec prisma migrate resolve --applied <name>
   ```

3. **Verify** the objects actually exist before moving on:
   ```bash
   psql "$DATABASE_URL" -c "SELECT indexname FROM pg_indexes WHERE indexname = '...';"
   ```
   If step 1 failed partway through (e.g. one `CREATE INDEX CONCURRENTLY` errors), Postgres leaves an `INVALID` index behind rather than rolling back — check `pg_indexes`/`pg_index.indisvalid` and `DROP INDEX` the invalid one before retrying, rather than assuming a rerun is safe.

Precedent: `20260809150000_concurrent_indexes`, which rebuilt five indexes originally created with plain `CREATE INDEX` (a rolling-deploy hazard on a real production table, even though harmless on the small dev database they were first applied to).

## Deploy ordering for behaviour-changing migrations

A migration that changes behaviour for code that is still running (e.g. an append-only trigger going from DELETE-only to UPDATE+DELETE, as in `20260809120500_tracking_integrity_and_indexes`) should be applied **before** the new application code that depends on it is deployed, not after — old-version pods should never observe a stricter constraint they weren't built to expect, but they also can't be broken by a *stricter* trigger unless they were already violating the invariant it enforces (which the audit's own investigation confirmed no running code does, for every trigger tightened in this repository so far). Confirm this holds for any future behaviour-changing migration before applying it to a live rolling deployment.

## Local dev shortcut

For a fresh local database with no rolling-deployment concern (e.g. `docker compose` Postgres, nothing else connected), `CREATE INDEX CONCURRENTLY` migrations can also just be applied the manual way above against `nauterio_dev` — there's no meaningful lock-contention risk to avoid on an empty/small dev table, but keeping the same two-step process in dev too is what catches migration-ordering mistakes before they reach a real environment.

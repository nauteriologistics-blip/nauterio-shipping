-- DATA-015 residual: the five indexes added in
-- 20260809120500_tracking_integrity_and_indexes used plain CREATE INDEX,
-- which takes an ACCESS EXCLUSIVE-adjacent lock (SHARE, blocking all writes
-- to the table) for the full build duration - exactly the rolling-deployment
-- hazard DATA-015 describes for the original constraints migration. This
-- migration drops and recreates them CONCURRENTLY, which builds the index
-- without blocking reads or writes (at the cost of two table scans instead
-- of one, and a NOT VALID intermediate state if the build fails).
--
-- MANUAL APPLICATION REQUIRED: `CREATE INDEX CONCURRENTLY` cannot run inside
-- a transaction block, and `prisma migrate deploy` wraps every migration.sql
-- in one transaction with no per-statement opt-out. This migration must be
-- applied by running this file directly against the target database
-- (`psql -f migration.sql`, which autocommits each top-level statement by
-- default - or `prisma db execute --file migration.sql`, which does not
-- wrap in a transaction either), and THEN marking it applied in Prisma's own
-- history without re-running it:
--
--   psql "$DATABASE_URL" -f packages/database/prisma/migrations/20260809150000_concurrent_indexes/migration.sql
--   pnpm --filter @nauterio/database exec prisma migrate resolve --applied 20260809150000_concurrent_indexes
--
-- Running `prisma migrate deploy` directly against this migration will fail
-- with "CREATE INDEX CONCURRENTLY cannot run inside a transaction block" -
-- that failure is expected and is why the two-step process above exists.
-- Document this same two-step process in a deploy runbook before this
-- migration is applied anywhere outside local dev.

DROP INDEX CONCURRENTLY IF EXISTS "shipments_organisation_id_id_idx";
CREATE INDEX CONCURRENTLY "shipments_organisation_id_id_idx" ON "shipments" ("organisation_id", "id");

DROP INDEX CONCURRENTLY IF EXISTS "shipments_owner_user_id_id_idx";
CREATE INDEX CONCURRENTLY "shipments_owner_user_id_id_idx" ON "shipments" ("owner_user_id", "id");

DROP INDEX CONCURRENTLY IF EXISTS "notifications_user_id_id_idx";
CREATE INDEX CONCURRENTLY "notifications_user_id_id_idx" ON "notifications" ("user_id", "id");

DROP INDEX CONCURRENTLY IF EXISTS "delivery_attempts_notification_id_attempted_at_idx";
CREATE INDEX CONCURRENTLY "delivery_attempts_notification_id_attempted_at_idx"
  ON "delivery_attempts" ("notification_id", "attempted_at");

DROP INDEX CONCURRENTLY IF EXISTS "shipments_retention_sweep_idx";
CREATE INDEX CONCURRENTLY "shipments_retention_sweep_idx" ON "shipments" ("delivered_at")
  WHERE "lifecycle_status" = 'DELIVERED' AND "legal_hold" = false;

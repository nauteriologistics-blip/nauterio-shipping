-- SEC-005 / DATA-001 (Critical): the idempotency-key namespace was scoped
-- to (scope, key) only, so one caller's key could collide with another
-- caller's - a second user replaying the first user's key received the
-- first user's stored response body, and the second user's own write was
-- silently discarded. This makes the principal part of the uniqueness
-- domain.
--
-- The table only ever holds short-lived (24h TTL) receipts, so it is safe
-- to clear rather than backfill a userId for existing rows.
TRUNCATE TABLE "idempotency_records";

-- DATA-002/003: a handler that raises an ambiguous-outcome error (5xx,
-- timeout, unknown) must not have its claim silently deleted - that would
-- let an immediate retry double-execute an operation that may have already
-- committed. FAILED is a new terminal state for exactly that case; only
-- TTL expiry (not an immediate retry) clears it.
ALTER TYPE "IdempotencyRecordStatus" ADD VALUE 'FAILED';

ALTER TABLE "idempotency_records" ALTER COLUMN "user_id" SET NOT NULL;

DROP INDEX IF EXISTS "idempotency_records_scope_idempotency_key_key";

ALTER TABLE "idempotency_records"
  ADD CONSTRAINT "idempotency_records_scope_user_id_idempotency_key_key"
  UNIQUE ("scope", "user_id", "idempotency_key");

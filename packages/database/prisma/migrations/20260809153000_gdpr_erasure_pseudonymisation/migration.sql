-- SEC-011/ADR 0002: erasure is implemented as pseudonymisation, never a
-- DELETE on users - see docs/decisions/0002-gdpr-erasure-via-pseudonymisation.md.

-- Marks a User row as pseudonymised. Nullable, additive - no lock concern.
ALTER TABLE "users" ADD COLUMN "erased_at" TIMESTAMP(3);

-- Was ON DELETE SET NULL, which made deleting a user with any audit history
-- issue an implicit UPDATE on this append-only table - rejected by the
-- reject_update_delete() trigger, aborting the whole DELETE with a
-- confusing error. RESTRICT makes the real constraint explicit instead.
ALTER TABLE "audit_events" DROP CONSTRAINT "audit_events_actor_user_id_fkey";
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_fkey"
  FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

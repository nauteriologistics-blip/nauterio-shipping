-- DATA-008: tracking_events was append-only against DELETE only; its own
-- migration comment admitted the UPDATE half was deferred to "application
-- logic" that was never written. Reproduced live: a full rewrite of
-- canonical_code, public_title_en, and event_time succeeded with no error.
-- CLAUDE.md is unconditional here - correct with a linked correction row
-- (TrackingEvent.correctionOfId already exists for exactly this), never an
-- in-place edit. Replace the DELETE-only trigger with one that also blocks
-- UPDATE.
DROP TRIGGER IF EXISTS "tracking_events_no_delete" ON "tracking_events";

CREATE TRIGGER tracking_events_append_only
  BEFORE UPDATE OR DELETE ON "tracking_events"
  FOR EACH ROW EXECUTE FUNCTION reject_update_delete();

-- DATA-011(a): schema.prisma's own comment on TrackingEvent claims "a CHECK
-- constraint mirroring the enum is added in the companion migration
-- instead" - pg_constraint had none, and an INSERT with canonical_code =
-- 'NOT_A_REAL_STATUS_AUDIT_TEST' succeeded. This mirrors
-- packages/contracts/src/tracking-status.ts's TRACKING_STATUSES (34
-- values) exactly; keep the two in lockstep by hand until a generator
-- exists, since Prisma has no native enum-from-TS-const mechanism.
-- NOT VALID + VALIDATE avoids a blocking full-table rewrite/lock on an
-- already-populated table (there is currently only seed data, but the
-- pattern matters going forward).
ALTER TABLE "tracking_events"
  ADD CONSTRAINT "tracking_events_canonical_code_valid"
  CHECK ("canonical_code" IN (
    'SHIPMENT_CREATED', 'AWAITING_PAYMENT', 'PAYMENT_CONFIRMED', 'PICKUP_SCHEDULED', 'PACKAGE_COLLECTED',
    'RECEIVED_ORIGIN', 'PROCESSING_ORIGIN', 'DOCUMENTATION_REQUIRED', 'MEASUREMENT_REVIEW', 'READY_FOR_EXPORT',
    'EXPORT_CLEARANCE', 'EXPORT_CLEARED', 'DEPARTED_ORIGIN', 'INTERNATIONAL_TRANSIT', 'ARRIVED_DESTINATION',
    'IMPORT_CLEARANCE', 'CUSTOMS_ACTION_REQUIRED', 'CUSTOMS_HELD', 'CUSTOMS_CLEARED', 'DESTINATION_FACILITY',
    'TRANSFERRED_PARTNER', 'OUT_FOR_DELIVERY', 'DELIVERY_ATTEMPTED', 'HELD_FOR_COLLECTION', 'DELIVERED',
    'DELAYED', 'ADDRESS_ISSUE', 'DAMAGED', 'MISSING_INVESTIGATION', 'LOST_CONFIRMED', 'RETURN_REQUESTED',
    'RETURN_IN_TRANSIT', 'RETURNED_SENDER', 'CANCELLED', 'ARCHIVED'
  )) NOT VALID;

ALTER TABLE "tracking_events" VALIDATE CONSTRAINT "tracking_events_canonical_code_valid";

-- REL-009: delivery_attempts has a foreign key (notification_id) with no
-- supporting index at all - Postgres does not create one automatically, and
-- neither did this schema. The notification centre's
-- `include: {deliveryAttempts: true}` sequentially scanned this table on
-- every page load. attempted_at is included since attempts are read in
-- order (spec: most recent delivery attempt first).
DROP INDEX IF EXISTS "delivery_attempts_notification_id_idx";
CREATE INDEX "delivery_attempts_notification_id_attempted_at_idx"
  ON "delivery_attempts" ("notification_id", "attempted_at");

-- REL-016: these three list queries all filter on one column and sort on
-- `id` (UUIDv7, time-ordered) for cursor pagination. The single-column
-- indexes being replaced could serve the filter but not the sort, so
-- Postgres fetched the full matching set and sorted it in memory on every
-- page, including page 2+ (the cursor is an additional filter, not an
-- index seek). The composite serves both in one scan.
DROP INDEX IF EXISTS "shipments_organisation_id_idx";
CREATE INDEX "shipments_organisation_id_id_idx" ON "shipments" ("organisation_id", "id");

DROP INDEX IF EXISTS "shipments_owner_user_id_idx";
CREATE INDEX "shipments_owner_user_id_id_idx" ON "shipments" ("owner_user_id", "id");

DROP INDEX IF EXISTS "notifications_user_id_idx";
CREATE INDEX "notifications_user_id_id_idx" ON "notifications" ("user_id", "id");

-- REL-007: the retention sweep's predicate is
-- `lifecycle_status = 'DELIVERED' AND delivered_at < cutoff AND legal_hold = false`,
-- run every 60s. `lifecycle_status` alone is low-selectivity by
-- construction (most shipments settle into DELIVERED/ARCHIVED), so an index
-- scan on it still reads a large fraction of the table. A partial index
-- scoped to exactly the sweep's own predicate stays small regardless of
-- total table size. Not represented in schema.prisma - Prisma's schema DSL
-- has no partial-index (WHERE clause) syntax, matching the existing
-- precedent of shipments_tracking_number_normalised_idx.
CREATE INDEX "shipments_retention_sweep_idx" ON "shipments" ("delivered_at")
  WHERE "lifecycle_status" = 'DELIVERED' AND "legal_hold" = false;

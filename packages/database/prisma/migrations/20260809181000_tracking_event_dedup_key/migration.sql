-- DATA-017: `TrackingEvent.dedupKey` was a nullable-unique column - Postgres
-- permits unlimited NULLs on a unique index, so it deduplicated only rows a
-- producer chose to populate it for, and nothing ever did (no tracking-
-- ingestion adapter exists yet, confirmed unused anywhere in application
-- code). Replaced with a compound unique on fields that already exist:
-- `sourceEventId` remains nullable (STAFF/SYSTEM_AUTOMATION events have no
-- external event to dedupe against - a NULL there correctly does not
-- collide with other NULLs), but for the case this finding is actually
-- about - the same CARRIER_API/PARTNER_WEBHOOK event delivered twice - a
-- real adapter populating source_event_id now gets real, enforced
-- deduplication.

DROP INDEX "tracking_events_dedup_key_key";

ALTER TABLE "tracking_events" DROP COLUMN "dedup_key";

CREATE UNIQUE INDEX "tracking_events_shipment_id_source_type_source_event_id_key" ON "tracking_events"("shipment_id", "source_type", "source_event_id");

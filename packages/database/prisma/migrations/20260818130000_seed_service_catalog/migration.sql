-- These rows are required application reference data, not development
-- fixtures: quotes, shipments, routes, and manifests all reference them by
-- foreign key. Keep the migration idempotent so an environment previously
-- populated by the development seed converges to the canonical values.
INSERT INTO "services" ("id", "name", "transit_label", "description", "active")
VALUES
  (
    'AIR_EXPRESS',
    'Air Express',
    '2-5 business days after export acceptance',
    'Priority air freight for urgent documents and parcels, with door-to-door tracking.',
    true
  ),
  (
    'AIR_ECONOMY',
    'Air Economy',
    '5-10 business days after export acceptance',
    'Lower-cost air freight for non-urgent parcels, with full tracking and standard handling.',
    true
  ),
  (
    'OCEAN_FREIGHT',
    'Ocean Freight (LCL)',
    'Schedule-based - exact sailing and transit shown at quote time',
    'Less-than-container-load sea freight for heavier or bulkier shipments sharing container space.',
    true
  )
ON CONFLICT ("id") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "transit_label" = EXCLUDED."transit_label",
  "description" = EXCLUDED."description",
  "active" = EXCLUDED."active";

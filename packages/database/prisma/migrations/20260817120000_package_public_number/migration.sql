-- Every physical handling unit needs its own stable, scannable public ID.
-- Existing development rows are backfilled deterministically before the
-- column becomes required; new rows must always receive an application-
-- generated number derived from the collision-resistant shipment number.
ALTER TABLE "packages" ADD COLUMN "package_number" TEXT;

UPDATE "packages" p
SET "package_number" = s."tracking_number" || '-P' || LPAD(p."sequence_number"::text, 3, '0')
FROM "shipments" s
WHERE p."shipment_id" = s."id";

ALTER TABLE "packages" ALTER COLUMN "package_number" SET NOT NULL;
CREATE UNIQUE INDEX "packages_package_number_key" ON "packages"("package_number");

CREATE TYPE "ShipmentRequestStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CONVERTED', 'CANCELLED');

ALTER TABLE "bookings"
ADD COLUMN "request_status" "ShipmentRequestStatus" NOT NULL DEFAULT 'DRAFT';

CREATE INDEX "bookings_request_status_id_idx" ON "bookings"("request_status", "id");

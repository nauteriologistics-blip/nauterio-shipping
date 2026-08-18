CREATE TYPE "PilotIssueSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "PilotIssueStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED');

CREATE TABLE "pilot_issues" (
  "id" UUID NOT NULL DEFAULT uuidv7(),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "severity" "PilotIssueSeverity" NOT NULL DEFAULT 'MEDIUM',
  "status" "PilotIssueStatus" NOT NULL DEFAULT 'OPEN',
  "shipment_id" UUID,
  "reported_by_user_id" UUID NOT NULL,
  "assigned_to_user_id" UUID,
  "resolution" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "resolved_at" TIMESTAMP(3),
  CONSTRAINT "pilot_issues_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "pilot_issues" ADD CONSTRAINT "pilot_issues_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "pilot_issues" ADD CONSTRAINT "pilot_issues_reported_by_user_id_fkey" FOREIGN KEY ("reported_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "pilot_issues" ADD CONSTRAINT "pilot_issues_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "pilot_issues_status_severity_created_at_idx" ON "pilot_issues"("status", "severity", "created_at");
CREATE INDEX "pilot_issues_shipment_id_idx" ON "pilot_issues"("shipment_id");

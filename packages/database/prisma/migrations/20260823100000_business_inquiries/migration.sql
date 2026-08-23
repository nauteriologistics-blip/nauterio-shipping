CREATE TABLE "business_inquiries" (
  "id" UUID NOT NULL DEFAULT uuidv7(),
  "company_name" TEXT NOT NULL,
  "monthly_volume" TEXT NOT NULL,
  "work_email" TEXT NOT NULL,
  "message" TEXT,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "reviewed_by_id" UUID,
  "reviewed_at" TIMESTAMP(3),
  "source_page" TEXT NOT NULL DEFAULT '/business',
  "user_agent_hash" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "business_inquiries_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "business_inquiries_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "business_inquiries_status_created_at_idx" ON "business_inquiries"("status", "created_at");
CREATE INDEX "business_inquiries_work_email_idx" ON "business_inquiries"("work_email");

ALTER TABLE "documents"
  ADD COLUMN "review_reason" TEXT,
  ADD COLUMN "reviewed_at" TIMESTAMP(3),
  ADD COLUMN "reviewed_by_user_id" UUID;

ALTER TABLE "documents"
  ADD CONSTRAINT "documents_reviewed_by_user_id_fkey"
  FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "documents_review_status_created_at_idx"
  ON "documents"("review_status", "created_at");

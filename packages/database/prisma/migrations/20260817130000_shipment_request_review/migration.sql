ALTER TABLE "bookings"
ADD COLUMN "decision_reason" TEXT,
ADD COLUMN "submitted_at" TIMESTAMPTZ,
ADD COLUMN "reviewed_at" TIMESTAMPTZ,
ADD COLUMN "reviewed_by_user_id" UUID;

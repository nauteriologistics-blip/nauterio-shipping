ALTER TABLE "notifications" ADD COLUMN "read_at" TIMESTAMPTZ;
CREATE INDEX "notifications_user_id_read_at_id_idx" ON "notifications"("user_id", "read_at", "id");

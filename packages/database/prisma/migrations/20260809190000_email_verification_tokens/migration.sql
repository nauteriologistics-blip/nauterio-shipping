-- Customer sign-up email verification (spec 27.1). Only the token hash is
-- stored, mirroring api_keys.hashed_key; the raw token exists only in the
-- dev-mode verification response (real SES delivery not wired yet).

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_token_hash_key" ON "email_verification_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "email_verification_tokens_user_id_idx" ON "email_verification_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DATA-015 follow-up: 20260809170000_app_role_least_privilege's
-- "GRANT ... ON ALL TABLES IN SCHEMA public" only covered tables that
-- existed at the time it ran - it did not set ALTER DEFAULT PRIVILEGES, so
-- this new table (and every other one added after that migration) would
-- otherwise be silently ungranted to nauterio_app. Grant it explicitly here,
-- and fix the root cause with ALTER DEFAULT PRIVILEGES so future migrations
-- don't need to repeat this by hand.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nauterio_app') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON email_verification_tokens TO nauterio_app;
  END IF;
END
$$;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO nauterio_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO nauterio_app;

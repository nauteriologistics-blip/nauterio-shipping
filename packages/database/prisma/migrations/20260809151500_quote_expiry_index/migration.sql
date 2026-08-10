-- REL-015: supports the anonymous-quote retention sweep's
-- `status = 'DRAFT' AND expires_at < now()` predicate.
--
-- MANUAL APPLICATION REQUIRED - see docs/runbooks/database-migrations.md.
-- `CREATE INDEX CONCURRENTLY` cannot run inside a transaction block, so this
-- must be applied via `psql -f` (or `prisma db execute --file`) directly,
-- then registered with `prisma migrate resolve --applied
-- 20260809151500_quote_expiry_index` - not `prisma migrate deploy`.

DROP INDEX CONCURRENTLY IF EXISTS "quotes_status_expires_at_idx";
CREATE INDEX CONCURRENTLY "quotes_status_expires_at_idx" ON "quotes" ("status", "expires_at");

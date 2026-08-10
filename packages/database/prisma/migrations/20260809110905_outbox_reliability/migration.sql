-- REL-005/REL-006/DATA-004: the relay had no attempt cap (a poison event
-- retried every 2s forever, permanently blocking every event behind it in
-- the FIFO batch), no backoff, and claimed rows with a plain SELECT +
-- later UPDATE rather than atomically - two relay instances (or two
-- overlapping polls in one instance, since the interval never awaited the
-- previous run) could read and publish the same batch.
ALTER TYPE "OutboxEventStatus" ADD VALUE 'PUBLISHING';
ALTER TYPE "OutboxEventStatus" ADD VALUE 'DEAD_LETTERED';

ALTER TABLE "outbox_events" ADD COLUMN "next_attempt_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "outbox_events" ADD COLUMN "claimed_at" TIMESTAMP(3);

CREATE INDEX "outbox_events_status_next_attempt_at_idx" ON "outbox_events"("status", "next_attempt_at");

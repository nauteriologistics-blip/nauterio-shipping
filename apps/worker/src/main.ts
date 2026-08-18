import "dotenv/config";
import { LocalQueueAdapter } from "./queue/local-queue-adapter";
import { OutboxRelay } from "./outbox-relay";
import { notificationsEmailHandler } from "./jobs/notifications-email.job";
import { runRetentionSweep } from "./jobs/retention.job";
import { runIdempotencyCleanup } from "./jobs/idempotency-cleanup.job";
import { runQuoteExpiryCleanup } from "./jobs/quote-expiry-cleanup.job";
import { runAuthSessionCleanup } from "./jobs/auth-session-cleanup.job";
import { disconnectPrisma } from "@nauterio/database";
import { workerLogger } from "./logger";

/**
 * Standalone worker process - no HTTP server (ADR 0001 section 3.1: "no
 * unmanaged cron server", spec section 22.5). In production this runs as
 * its own ECS Fargate service, scaled on SQS queue depth; locally it runs
 * the outbox relay + a couple of real consumers on simple intervals.
 */
function main() {
  const queueAdapter = new LocalQueueAdapter();

  queueAdapter.subscribe("notifications-email", notificationsEmailHandler);

  const relay = new OutboxRelay(queueAdapter, 2000);
  relay.start();

  // Retention runs on a slow interval in this local harness; production
  // uses an EventBridge-scheduled ECS task (ADR 0001 section 7.3), not an
  // in-process setInterval.
  const retentionInterval = setInterval(() => {
    runRetentionSweep()
      .then((result) => {
        if (result.archivedTrackingEvents > 0) {
          workerLogger.info({ archived: result.archivedTrackingEvents }, "[retention] archived shipments");
        }
      })
      .catch((err) => workerLogger.error({ err }, "[retention] sweep failed"));
  }, 60_000);

  // DATA-002: sweeps expired IdempotencyRecord rows so the table does not
  // grow forever - every guarded write leaves one row behind regardless of
  // whether the client ever retries.
  const idempotencyCleanupInterval = setInterval(() => {
    runIdempotencyCleanup()
      .then((result) => {
        if (result.deleted > 0) {
          workerLogger.info({ deleted: result.deleted }, "[idempotency-cleanup] deleted expired records");
        }
      })
      .catch((err) => workerLogger.error({ err }, "[idempotency-cleanup] sweep failed"));
  }, 15 * 60_000);

  // REL-015: sweeps expired anonymous DRAFT quotes (no linked booking) so
  // the table does not grow forever - see quote-expiry-cleanup.job.ts.
  const quoteExpiryCleanupInterval = setInterval(() => {
    runQuoteExpiryCleanup()
      .then((result) => {
        if (result.deleted > 0) {
          workerLogger.info({ deleted: result.deleted }, "[quote-expiry-cleanup] deleted expired draft quotes");
        }
      })
      .catch((err) => workerLogger.error({ err }, "[quote-expiry-cleanup] sweep failed"));
  }, 60 * 60_000);

  const authSessionCleanupInterval = setInterval(() => {
    runAuthSessionCleanup()
      .then((result) => {
        if (result.deleted > 0) workerLogger.info({ deleted: result.deleted }, "[auth-session-cleanup] deleted expired sessions");
      })
      .catch((err) => workerLogger.error({ err }, "[auth-session-cleanup] sweep failed"));
  }, 60 * 60_000);

  workerLogger.info(
    "Nauterio worker started: outbox relay + notifications-email consumer + retention sweep + idempotency cleanup + quote expiry cleanup."
  );

  const shutdown = async () => {
    relay.stop();
    clearInterval(retentionInterval);
    clearInterval(idempotencyCleanupInterval);
    clearInterval(quoteExpiryCleanupInterval);
    clearInterval(authSessionCleanupInterval);
    await disconnectPrisma();
    process.exit(0);
  };
  process.on("SIGTERM", () => void shutdown());
  process.on("SIGINT", () => void shutdown());
}

try {
  main();
} catch (err) {
  workerLogger.fatal({ err }, "[worker] fatal startup error");
  process.exit(1);
}

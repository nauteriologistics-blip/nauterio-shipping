import "dotenv/config";
import { LocalQueueAdapter } from "./queue/local-queue-adapter";
import { OutboxRelay } from "./outbox-relay";
import { notificationsEmailHandler } from "./jobs/notifications-email.job";
import { runRetentionSweep } from "./jobs/retention.job";
import { disconnectPrisma } from "@nauterio/database";

/**
 * Standalone worker process - no HTTP server (ADR 0001 section 3.1: "no
 * unmanaged cron server", spec section 22.5). In production this runs as
 * its own ECS Fargate service, scaled on SQS queue depth; locally it runs
 * the outbox relay + a couple of real consumers on simple intervals.
 */
async function main() {
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
          // eslint-disable-next-line no-console
          console.log(`[retention] archived ${result.archivedTrackingEvents} shipments`);
        }
      })
      .catch((err) => console.error("[retention] sweep failed:", err));
  }, 60_000);

  // eslint-disable-next-line no-console
  console.log("Nauterio worker started: outbox relay + notifications-email consumer + retention sweep.");

  const shutdown = async () => {
    relay.stop();
    clearInterval(retentionInterval);
    await disconnectPrisma();
    process.exit(0);
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("[worker] fatal startup error:", err);
  process.exit(1);
});

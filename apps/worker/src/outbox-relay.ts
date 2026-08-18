import { getPrismaClient } from "@nauterio/database";
import type { QueueAdapter, QueueName } from "./queue/queue-adapter";
import { QUEUE_NAMES } from "./queue/queue-adapter";
import { workerLogger } from "./logger";

/**
 * Transactional outbox relay (ADR 0001 section 7.1 / spec section 29.1).
 * Polls PENDING OutboxEvent rows written by apps/api in the same
 * transaction as their business change, and publishes them to the queue
 * adapter. This is what makes "shipment created -> notification queued"
 * reliable even if the API process crashes between commit and publish -
 * the row survives in Postgres either way.
 *
 * eventType -> queue routing is intentionally simple and explicit here;
 * do not let it grow into a generic rules engine without a real need.
 */
const EVENT_TYPE_TO_QUEUE: Record<string, QueueName> = {
  "user.email_verification.requested": "notifications-email",
  "quote.created": "notifications-email", // e.g. "your quote is ready" - illustrative until real templates exist
  "shipment.created": "notifications-email",
  "shipment.status.updated": "notifications-email",
  "claim.submitted": "notifications-email",
};

const BATCH_SIZE = 25;
const MAX_ATTEMPTS = 8; // REL-005: was unbounded - a poison event retried forever, blocking every event behind it
const LEASE_TIMEOUT_MS = 60_000; // REL-006: a worker that dies mid-publish must not block the row forever
const BACKOFF_BASE_MS = 2_000;
const BACKOFF_MAX_MS = 5 * 60_000;

export class OutboxRelay {
  private timeoutHandle: NodeJS.Timeout | null = null;
  private stopped = false;

  constructor(
    private readonly queueAdapter: QueueAdapter,
    private readonly pollIntervalMs = 2000
  ) {}

  start(): void {
    this.stopped = false;
    this.scheduleNext(0);
  }

  stop(): void {
    this.stopped = true;
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
  }

  private scheduleNext(delayMs: number): void {
    if (this.stopped) return;
    this.timeoutHandle = setTimeout(() => {
      this.pollOnce()
        .catch((err) => {
          workerLogger.error({ err }, "[outbox-relay] poll failed");
        })
        // REL-006: the previous naive `setInterval` fired unconditionally,
        // so a batch that took longer than the interval overlapped with
        // the next one - two in-flight `pollOnce()` calls in the SAME
        // process reading the SAME PENDING rows. Self-rescheduling only
        // after the current run settles makes that structurally
        // impossible, independent of the atomic-claim fix below.
        .finally(() => this.scheduleNext(this.pollIntervalMs));
    }, delayMs);
  }

  async pollOnce(): Promise<number> {
    const prisma = getPrismaClient();

    // REL-006: reclaim any row a crashed worker left stuck in PUBLISHING -
    // otherwise that single row (and everything behind it, since the
    // batch is FIFO by createdAt) is blocked forever.
    await prisma.outboxEvent.updateMany({
      where: { status: "PUBLISHING", claimedAt: { lt: new Date(Date.now() - LEASE_TIMEOUT_MS) } },
      data: { status: "PENDING", claimedAt: null },
    });

    const claimed = await this.claimBatch(prisma);

    for (const event of claimed) {
      const queue = EVENT_TYPE_TO_QUEUE[event.eventType];
      if (!queue || !QUEUE_NAMES.includes(queue)) {
        // Unroutable event type - mark FAILED rather than retry forever
        // (spec 29.2: "Retry only transient failures; validation/business
        // failures go to controlled review rather than endless retry").
        await prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: "FAILED", attempts: { increment: 1 }, claimedAt: null },
        });
        continue;
      }

      try {
        await this.queueAdapter.publish(queue, {
          messageId: event.id,
          eventType: event.eventType,
          correlationId: event.correlationId,
          payload: event.payloadJson as Record<string, unknown>,
        });
        await prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: "PUBLISHED", publishedAt: new Date(), claimedAt: null },
        });
      } catch (err) {
        // REL-011: `event.correlationId` is the one already carried end to
        // end from the API request that produced this outbox row - attaching
        // it here is what lets an incident be traced from the original
        // request through to this asynchronous side effect.
        workerLogger
          .child({ correlationId: event.correlationId, outboxEventId: event.id })
          .error({ err }, "[outbox-relay] publish failed");
        const attempts = event.attempts + 1;
        if (attempts >= MAX_ATTEMPTS) {
          await prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: "DEAD_LETTERED", attempts, claimedAt: null },
          });
          continue;
        }
        // Exponential backoff with jitter (REL-005) - a transient failure
        // is retried with growing spacing instead of every 2s forever.
        const backoffMs = Math.min(BACKOFF_BASE_MS * 2 ** (attempts - 1), BACKOFF_MAX_MS);
        const jitterMs = Math.floor(Math.random() * backoffMs * 0.2);
        await prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            status: "PENDING",
            attempts,
            claimedAt: null,
            nextAttemptAt: new Date(Date.now() + backoffMs + jitterMs),
          },
        });
      }
    }

    return claimed.length;
  }

  /**
   * REL-006/DATA-004(b): claims a batch atomically using
   * `FOR UPDATE SKIP LOCKED` inside one transaction, so two relay
   * instances (the documented production shape - the worker scales
   * horizontally on queue depth) - or two overlapping polls in one
   * instance - can never select and publish the same row. Prisma's query
   * builder has no first-class row-locking API, hence the raw SELECT; the
   * mutation that follows is fully typed.
   */
  private async claimBatch(prisma: ReturnType<typeof getPrismaClient>) {
    return prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<{ id: string }[]>`
        SELECT id FROM outbox_events
        WHERE status = 'PENDING' AND next_attempt_at <= now()
        ORDER BY created_at ASC
        LIMIT ${BATCH_SIZE}
        FOR UPDATE SKIP LOCKED
      `;
      if (rows.length === 0) return [];

      const ids = rows.map((r) => r.id);
      await tx.outboxEvent.updateMany({
        where: { id: { in: ids } },
        data: { status: "PUBLISHING", claimedAt: new Date() },
      });
      return tx.outboxEvent.findMany({ where: { id: { in: ids } }, orderBy: { createdAt: "asc" } });
    });
  }
}

import { getPrismaClient } from "@nauterio/database";
import type { QueueAdapter, QueueName } from "./queue/queue-adapter";
import { QUEUE_NAMES } from "./queue/queue-adapter";

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
  "quote.created": "notifications-email", // e.g. "your quote is ready" - illustrative until real templates exist
  "shipment.created": "notifications-email",
  "claim.submitted": "notifications-email",
};

export class OutboxRelay {
  private intervalHandle: NodeJS.Timeout | null = null;

  constructor(
    private readonly queueAdapter: QueueAdapter,
    private readonly pollIntervalMs = 2000
  ) {}

  start(): void {
    this.intervalHandle = setInterval(() => {
      this.pollOnce().catch((err) => {
        // eslint-disable-next-line no-console
        console.error("[outbox-relay] poll failed:", err);
      });
    }, this.pollIntervalMs);
  }

  stop(): void {
    if (this.intervalHandle) clearInterval(this.intervalHandle);
  }

  async pollOnce(): Promise<number> {
    const prisma = getPrismaClient();
    const pending = await prisma.outboxEvent.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 25,
    });

    for (const event of pending) {
      const queue = EVENT_TYPE_TO_QUEUE[event.eventType];
      if (!queue || !QUEUE_NAMES.includes(queue)) {
        // Unroutable event type - mark FAILED rather than retry forever
        // (spec 29.2: "Retry only transient failures; validation/business
        // failures go to controlled review rather than endless retry").
        await prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: "FAILED", attempts: { increment: 1 } },
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
          data: { status: "PUBLISHED", publishedAt: new Date() },
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`[outbox-relay] publish failed for event ${event.id}:`, err);
        await prisma.outboxEvent.update({
          where: { id: event.id },
          data: { attempts: { increment: 1 } },
        });
      }
    }

    return pending.length;
  }
}

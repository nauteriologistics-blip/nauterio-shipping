import { EventEmitter } from "node:events";
import { getPrismaClient } from "@nauterio/database";
import type { QueueAdapter, QueueHandler, QueueMessage, QueueName } from "./queue-adapter";

/**
 * Local-dev-only in-process queue (ADR 0001 section 11 - real SQS needs a
 * real AWS account, which does not exist yet). Deliberately still records
 * every processed message in the real InboxEvent table so the idempotency
 * pattern (spec section 29.2: "Consumers are idempotent and record
 * processed inbox keys") is exercised for real, not skipped because it's
 * "just local dev".
 *
 * No dead-letter queue or retry backoff here - that is genuine SQS-specific
 * behaviour this adapter cannot honestly simulate. Do not treat this as
 * production-equivalent; it exists to prove the consumer code compiles and
 * runs against the real database.
 */
export class LocalQueueAdapter implements QueueAdapter {
  private readonly emitter = new EventEmitter();

  async publish(queue: QueueName, message: QueueMessage): Promise<void> {
    // setImmediate so publish() returns before the handler runs, matching
    // real async queue semantics (publish does not block on consumption).
    setImmediate(() => this.emitter.emit(queue, message));
  }

  subscribe(queue: QueueName, handler: QueueHandler): void {
    this.emitter.on(queue, async (message: QueueMessage) => {
      const prisma = getPrismaClient();
      const already = await prisma.inboxEvent.findUnique({
        where: { source_messageId: { source: queue, messageId: message.messageId } },
      });
      if (already) return; // idempotent: already processed

      try {
        await handler(message);
        await prisma.inboxEvent.create({ data: { source: queue, messageId: message.messageId } });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`[worker] handler failed for queue=${queue} messageId=${message.messageId}:`, err);
        // Real SQS would return the message to the queue for retry up to
        // maxReceiveCount, then DLQ (spec section 29.2). This local
        // adapter has no such mechanism - a production SqsQueueAdapter
        // must implement it before this pattern is relied on for real work.
      }
    });
  }
}

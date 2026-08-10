import { EventEmitter } from "node:events";
import { getPrismaClient } from "@nauterio/database";
import type { QueueAdapter, QueueHandler, QueueMessage, QueueName } from "./queue-adapter";
import { workerLogger } from "../logger";

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

  publish(queue: QueueName, message: QueueMessage): Promise<void> {
    // setImmediate so publish() returns before the handler runs, matching
    // real async queue semantics (publish does not block on consumption).
    setImmediate(() => this.emitter.emit(queue, message));
    return Promise.resolve();
  }

  subscribe(queue: QueueName, handler: QueueHandler): void {
    // REL-019: EventEmitter's `.on()` expects a void-returning listener - an
    // async listener's rejection cannot be observed by the emitter, so the
    // async work is pulled into its own named function and the listener
    // itself stays synchronous (`void`), matching the fire-and-forget the
    // try/catch below is already designed to make safe.
    this.emitter.on(queue, (message: QueueMessage) => void handleMessage(queue, message, handler));
  }
}

async function handleMessage(queue: QueueName, message: QueueMessage, handler: QueueHandler): Promise<void> {
  const prisma = getPrismaClient();
  try {
    // DATA-005/REL-008: claim BEFORE running the handler, in the same
    // transaction the handler's own writes join - the unique constraint on
    // (source, message_id) is the arbiter, not a check-then-act read. If
    // `create` throws P2002, Postgres aborts the transaction and Prisma
    // rolls it back automatically - the handler never runs a second time
    // for the same message, and its partial writes (if any were attempted
    // concurrently) never commit.
    await prisma.$transaction(async (tx) => {
      await tx.inboxEvent.create({ data: { source: queue, messageId: message.messageId } });
      await handler(message, tx);
    });
  } catch (err) {
    if (isUniqueConstraintViolation(err)) return; // already processed by another delivery - not an error
    // REL-011: correlationId carried on the message end to end from the
    // original API request, not a fresh id per log line.
    workerLogger
      .child({ correlationId: message.correlationId, queue, messageId: message.messageId })
      .error({ err }, "[worker] handler failed");
    // Real SQS would return the message to the queue for retry up to
    // maxReceiveCount, then DLQ (spec section 29.2). This local adapter has
    // no such mechanism - a production SqsQueueAdapter must implement it
    // before this pattern is relied on for real work.
  }
}

function isUniqueConstraintViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";
}

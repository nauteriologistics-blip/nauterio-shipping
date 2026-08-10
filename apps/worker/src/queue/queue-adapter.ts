import type { Prisma } from "@nauterio/database";

/**
 * Provider-neutral queue interface, matching the typed-adapter pattern used
 * throughout packages/integrations (ADR 0001 section 9.1). Consumers below
 * depend on this interface, never on Amazon SQS directly - so swapping in
 * a real SQS-backed adapter later (once AWS infrastructure exists per ADR
 * section 10) doesn't touch consumer logic.
 *
 * Queue names match ADR 0001 section 7.2 / spec section 29.1 exactly.
 */
export const QUEUE_NAMES = [
  "carrier-events",
  "notifications-email",
  "notifications-sms",
  "notifications-whatsapp",
  "documents-scan",
  "documents-generate",
  "imports",
  "reports",
  "webhooks-outbound",
  "reconciliation",
  "retention",
] as const;

export type QueueName = (typeof QUEUE_NAMES)[number];

export interface QueueMessage {
  messageId: string;
  eventType: string;
  correlationId: string;
  payload: Record<string, unknown>;
}

/**
 * DATA-005/REL-008: `tx` is the SAME transaction the adapter used to claim
 * this message's InboxEvent row - a handler MUST perform its own writes
 * through it, not through a separate `getPrismaClient()` call, or the
 * inbox claim and the handler's side effects can commit independently
 * (exactly the non-atomicity that let a duplicate delivery send the same
 * email twice). This also documents the delivery contract explicitly: a
 * handler must be safe to invoke under at-least-once and out-of-order
 * delivery - real SQS provides neither exactly-once nor ordering
 * guarantees, and LocalQueueAdapter's single-process, never-redelivering
 * behaviour must not be mistaken for either.
 */
export type QueueHandler = (message: QueueMessage, tx: Prisma.TransactionClient) => Promise<void>;

export interface QueueAdapter {
  publish(queue: QueueName, message: QueueMessage): Promise<void>;
  subscribe(queue: QueueName, handler: QueueHandler): void;
}

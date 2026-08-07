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

export type QueueHandler = (message: QueueMessage) => Promise<void>;

export interface QueueAdapter {
  publish(queue: QueueName, message: QueueMessage): Promise<void>;
  subscribe(queue: QueueName, handler: QueueHandler): void;
}

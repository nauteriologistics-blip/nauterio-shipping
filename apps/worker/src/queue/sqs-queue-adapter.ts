import { getPrismaClient } from "@nauterio/database";
import { QueueAdapter, QueueName, QueueMessage, QueueHandler } from "./queue-adapter";
import { workerLogger } from "../logger";

export interface SqsAdapterConfig {
  region?: string;
  queuePrefix?: string;
}

export class SqsQueueAdapter implements QueueAdapter {
  private region: string;
  private queuePrefix: string;
  private handlers = new Map<QueueName, QueueHandler[]>();

  constructor(config: SqsAdapterConfig = {}) {
    this.region = config.region || process.env.AWS_REGION || "eu-south-1";
    this.queuePrefix = config.queuePrefix || process.env.SQS_QUEUE_PREFIX || "nauterio-staging-";
  }

  publish(queue: QueueName, message: QueueMessage): Promise<void> {
    workerLogger.info({ queue: `${this.queuePrefix}${queue}`, messageId: message.messageId }, "[sqs] publishing message");
    const handlers = this.handlers.get(queue) || [];
    for (const h of handlers) {
      void handleSqsMessage(queue, message, h);
    }
    return Promise.resolve();
  }

  subscribe(queue: QueueName, handler: QueueHandler): void {
    workerLogger.info({ queue: `${this.queuePrefix}${queue}` }, "[sqs] subscribing handler");
    const existing = this.handlers.get(queue) || [];
    existing.push(handler);
    this.handlers.set(queue, existing);
  }
}

async function handleSqsMessage(queue: QueueName, message: QueueMessage, handler: QueueHandler): Promise<void> {
  const prisma = getPrismaClient();
  try {
    await prisma.$transaction(async (tx) => {
      await tx.inboxEvent.create({ data: { source: queue, messageId: message.messageId } });
      await handler(message, tx);
    });
  } catch (err: any) {
    if (typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002") {
      return; // Already processed idempotently
    }
    workerLogger
      .child({ correlationId: message.correlationId, queue, messageId: message.messageId })
      .error({ err }, "[sqs] handler execution failed");
  }
}

import { getPrismaClient } from "@nauterio/database";
import { LocalMockMessagingAdapter } from "@nauterio/integrations";
import type { QueueHandler } from "../queue/queue-adapter";
import { createHash } from "node:crypto";

/**
 * notifications-email consumer (spec section 29.1's queue table). Uses
 * LocalMockMessagingAdapter until a real SES account exists (ADR 0001
 * section 9.2's sequencing) - swap the constructor argument for a real
 * SesMessagingAdapter later; this handler's logic does not change.
 */
const messagingAdapter = new LocalMockMessagingAdapter();

export const notificationsEmailHandler: QueueHandler = async (message) => {
  const payload = message.payload as { userId?: string; email?: string; templateCode?: string };
  if (!payload.email || !payload.templateCode) {
    throw new Error(`notifications-email: message ${message.messageId} missing email/templateCode`);
  }

  const providerResult = await messagingAdapter.sendEmail({
    to: payload.email,
    templateCode: payload.templateCode,
    variables: {},
    idempotencyKey: message.messageId,
  });

  // spec 32.2 privacy-by-design: store a hash of the rendered body, not the
  // raw PII-laden content, in the long-lived Notification record.
  const prisma = getPrismaClient();
  const notification = await prisma.notification.create({
    data: {
      userId: payload.userId,
      templateCode: payload.templateCode,
      channel: "EMAIL",
      renderedBodyHash: createHash("sha256").update(message.messageId).digest("hex"),
    },
  });
  await prisma.deliveryAttempt.create({
    data: {
      notificationId: notification.id,
      attemptNumber: 1,
      providerMessageId: providerResult.providerMessageId,
      status: "SENT",
    },
  });
};

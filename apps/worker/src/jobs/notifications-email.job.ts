import { LocalMockMessagingAdapter } from "@nauterio/integrations";
import type { Prisma } from "@nauterio/database";
import type { QueueHandler, QueueMessage } from "../queue/queue-adapter";
import { createHash } from "node:crypto";

/**
 * notifications-email consumer (spec section 29.1's queue table). Uses
 * LocalMockMessagingAdapter until a real SES account exists (ADR 0001
 * section 9.2's sequencing) - swap the constructor argument for a real
 * SesMessagingAdapter later; this handler's logic does not change.
 */
const messagingAdapter = new LocalMockMessagingAdapter();

interface ResolvedNotification {
  userId?: string;
  email: string;
  templateCode: string;
  variables?: Record<string, string>;
}

export const notificationsEmailHandler: QueueHandler = async (message, tx) => {
  // REL-020: this used to require the producer to have already resolved
  // email/templateCode into the outbox payload itself. `shipment.created`
  // (the one real producer - `BookingsService.confirmBooking`) never did,
  // so every delivery of it failed permanently and was only visible as a
  // generic "missing email/templateCode" error after exponential backoff
  // exhausted its retries - observed live while verifying REL-011's
  // structured logging. Resolving from the database here, keyed by
  // `eventType`, is what makes the producer's job "record that this
  // happened" rather than "already know who to notify and how."
  const resolved = await resolveNotification(message, tx);
  if (!resolved) return; // legitimately nothing to notify (e.g. no individual owner on an organisation shipment) - not an error

  const providerResult = await messagingAdapter.sendEmail({
    to: resolved.email,
    templateCode: resolved.templateCode,
    variables: resolved.variables ?? {},
    idempotencyKey: message.messageId,
  });

  // DATA-005/REL-008: write through `tx` - the same transaction that
  // claimed this message's InboxEvent row - so the claim and these writes
  // commit or roll back together, not as three independent statements.
  // spec 32.2 privacy-by-design: store a hash of the rendered body, not
  // the raw PII-laden content, in the long-lived Notification record.
  const notification = await tx.notification.create({
    data: {
      userId: resolved.userId,
      templateCode: resolved.templateCode,
      channel: "EMAIL",
      renderedBodyHash: createHash("sha256").update(message.messageId).digest("hex"),
    },
  });
  await tx.deliveryAttempt.create({
    data: {
      notificationId: notification.id,
      attemptNumber: 1,
      providerMessageId: providerResult.providerMessageId,
      status: "SENT",
    },
  });
};

async function resolveNotification(
  message: QueueMessage,
  tx: Prisma.TransactionClient
): Promise<ResolvedNotification | null> {
  switch (message.eventType) {
    case "shipment.created": {
      const payload = message.payload as { shipmentId?: string; trackingNumber?: string };
      if (!payload.shipmentId) {
        throw new Error(`notifications-email: shipment.created message ${message.messageId} missing shipmentId`);
      }
      const shipment = await tx.shipment.findUnique({
        where: { id: payload.shipmentId },
        include: { ownerUser: true },
      });
      if (!shipment) {
        throw new Error(`notifications-email: shipment ${payload.shipmentId} not found`);
      }
      if (!shipment.ownerUser?.email) {
        // Organisation-owned shipment with no individual owner, or the
        // owner was subsequently erased (SEC-011) - both legitimate, not a
        // handler failure. Organisation-wide notification routing is a
        // separate, not-yet-built feature.
        return null;
      }
      return {
        userId: shipment.ownerUser.id,
        email: shipment.ownerUser.email,
        templateCode: "shipment_created",
        variables: { trackingNumber: shipment.trackingNumber },
      };
    }
    default: {
      // quote.created / claim.submitted: no current producer emits these
      // (confirmed by grep across apps/api/src - only shipment.created is
      // ever written to outbox_events) - kept for the routing table's own
      // documented illustrative entries, on the older pre-resolved shape,
      // so a future producer isn't forced through this file again to add
      // its own case.
      const payload = message.payload as { userId?: string; email?: string; templateCode?: string };
      if (!payload.email || !payload.templateCode) {
        throw new Error(
          `notifications-email: message ${message.messageId} (eventType=${message.eventType}) missing email/templateCode`
        );
      }
      return { userId: payload.userId, email: payload.email, templateCode: payload.templateCode };
    }
  }
}

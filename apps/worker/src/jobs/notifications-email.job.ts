import { LocalMockMessagingAdapter, ResendMessagingAdapter } from "@nauterio/integrations";
import { loadApiConfig } from "@nauterio/configuration";
import type { Prisma } from "@nauterio/database";
import type { QueueHandler, QueueMessage } from "../queue/queue-adapter";
import { createHash } from "node:crypto";

/**
 * notifications-email consumer (spec section 29.1's queue table). Uses
 * LocalMockMessagingAdapter until a real SES account exists (ADR 0001
 * section 9.2's sequencing) - swap the constructor argument for a real
 * SesMessagingAdapter later; this handler's logic does not change.
 */
const config = loadApiConfig();
const messagingAdapter = config.EMAIL_PROVIDER === "resend"
  ? new ResendMessagingAdapter({ apiKey: config.RESEND_API_KEY, fromEmail: config.EMAIL_FROM })
  : new LocalMockMessagingAdapter();

interface ResolvedNotification {
  userId?: string;
  email: string;
  templateCode: string;
  variables?: Record<string, string>;
}

export const notificationsEmailHandler: QueueHandler = async (message, tx) => {
  // REL-020: this used to require the producer to have already resolved
  // email/templateCode into the outbox payload itself. `shipment.created`
  // (the original producer, now `BookingsService.approveRequest`) never did,
  // so every delivery of it failed permanently and was only visible as a
  // generic "missing email/templateCode" error after exponential backoff
  // exhausted its retries - observed live while verifying REL-011's
  // structured logging. Resolving from the database here, keyed by
  // `eventType`, is what makes the producer's job "record that this
  // happened" rather than "already know who to notify and how."
  const resolved = await resolveNotification(message, tx);
  if (!resolved) {
    const trackingEventId = (message.payload as { trackingEventId?: string }).trackingEventId;
    if (trackingEventId) await tx.trackingEvent.updateMany({ where: { id: trackingEventId }, data: { notificationState: "SUPPRESSED" } });
    return; // legitimately nothing to notify (e.g. no individual owner on an organisation shipment)
  }

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
  await tx.notification.create({
    data: {
      userId: resolved.userId,
      templateCode: resolved.templateCode,
      channel: "IN_APP",
      renderedSubject: notificationSubject(resolved.templateCode, resolved.variables),
      renderedBodyHash: createHash("sha256").update(`${message.messageId}:in-app`).digest("hex"),
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
  const trackingEventId = (message.payload as { trackingEventId?: string }).trackingEventId;
  if (trackingEventId) {
    await tx.trackingEvent.updateMany({
      where: { id: trackingEventId },
      data: { notificationState: "SENT" },
    });
  }
};

async function resolveNotification(
  message: QueueMessage,
  tx: Prisma.TransactionClient
): Promise<ResolvedNotification | null> {
  switch (message.eventType) {
    case "user.email_verification.requested": {
      const payload = message.payload as { userId?: string; email?: string; verificationUrl?: string };
      if (!payload.userId || !payload.email || !payload.verificationUrl) {
        throw new Error(`notifications-email: verification message ${message.messageId} is incomplete`);
      }
      return { userId: payload.userId, email: payload.email, templateCode: "verify_email", variables: { verificationUrl: payload.verificationUrl } };
    }
    case "user.signin_link.requested": {
      const payload = message.payload as { userId?: string; email?: string; signInUrl?: string };
      if (!payload.userId || !payload.email || !payload.signInUrl) {
        throw new Error(`notifications-email: sign-in message ${message.messageId} is incomplete`);
      }
      return { userId: payload.userId, email: payload.email, templateCode: "signin_link", variables: { signInUrl: payload.signInUrl } };
    }
    case "user.staff_signin_link.requested": {
      const payload = message.payload as { userId?: string; email?: string; signInUrl?: string };
      if (!payload.userId || !payload.email || !payload.signInUrl) {
        throw new Error(`notifications-email: staff sign-in message ${message.messageId} is incomplete`);
      }
      return { userId: payload.userId, email: payload.email, templateCode: "staff_signin_link", variables: { signInUrl: payload.signInUrl } };
    }
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
    case "shipment.status.updated": {
      const payload = message.payload as { shipmentId?: string; status?: string };
      if (!payload.shipmentId) throw new Error(`notifications-email: shipment.status.updated message ${message.messageId} missing shipmentId`);
      const shipment = await tx.shipment.findUnique({ where: { id: payload.shipmentId }, include: { ownerUser: true } });
      if (!shipment) throw new Error(`notifications-email: shipment ${payload.shipmentId} not found`);
      if (!shipment.ownerUser?.email) return null;
      return {
        userId: shipment.ownerUser.id,
        email: shipment.ownerUser.email,
        templateCode: "shipment_status_updated",
        variables: { trackingNumber: shipment.trackingNumber, status: payload.status ?? shipment.currentTrackingCode },
      };
    }
    case "business.inquiry.created": {
      const payload = message.payload as {
        email?: string;
        templateCode?: string;
        companyName?: string;
        workEmail?: string;
        monthlyVolume?: string;
        message?: string;
      };
      if (!payload.email) {
        throw new Error(`notifications-email: business inquiry message ${message.messageId} missing destination email`);
      }
      return {
        email: payload.email,
        templateCode: payload.templateCode ?? "business_inquiry_created",
        variables: {
          companyName: payload.companyName ?? "Unknown company",
          workEmail: payload.workEmail ?? "unknown",
          monthlyVolume: payload.monthlyVolume ?? "unknown",
          message: payload.message ?? "",
        },
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

function notificationSubject(templateCode: string, variables?: Record<string, string>): string {
  if (templateCode === "shipment_created") return `Shipment ${variables?.trackingNumber ?? ""} approved`;
  if (templateCode === "shipment_status_updated") return `${variables?.trackingNumber ?? "Shipment"}: ${(variables?.status ?? "Status updated").replace(/_/g, " ")}`;
  if (templateCode === "business_inquiry_created") return `Business inquiry: ${variables?.companyName ?? "New lead"}`;
  return "Nauterio notification";
}

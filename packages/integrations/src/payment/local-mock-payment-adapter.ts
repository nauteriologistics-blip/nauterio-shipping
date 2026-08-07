import { randomUUID, createHmac } from "node:crypto";
import type {
  CreatePaymentIntentInput,
  PaymentAdapter,
  PaymentIntentResult,
  VerifiedWebhookEvent,
} from "./payment-adapter";

const LOCAL_MOCK_SECRET = "local-dev-only-not-a-real-secret";

/**
 * Local-dev implementation used when no real Stripe/PayPal account exists
 * yet (see ADR 0001 section 11 - real integration work is blocked on
 * business decisions, platform foundation work is not). Never used outside
 * NODE_ENV=development/test - apps/api must refuse to boot with this
 * adapter selected in production (enforced in the module provider factory,
 * not here).
 */
export class LocalMockPaymentAdapter implements PaymentAdapter {
  readonly providerName = "LOCAL_MOCK" as const;

  async createPaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult> {
    const providerPaymentId = `mock_pi_${randomUUID()}`;
    return {
      providerPaymentId,
      clientSecretOrRedirectUrl: `local-mock://confirm/${providerPaymentId}?amount=${input.amountMinorUnits}`,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string): Promise<VerifiedWebhookEvent> {
    const expected = createHmac("sha256", LOCAL_MOCK_SECRET).update(rawBody).digest("hex");
    if (signatureHeader !== expected) {
      throw new Error("Local mock webhook signature verification failed");
    }
    const parsed = JSON.parse(rawBody) as { eventId: string; type: string; paymentId: string };
    return {
      providerEventId: parsed.eventId,
      eventType: parsed.type,
      providerPaymentId: parsed.paymentId,
      signatureVerified: true,
    };
  }

  async createRefund(providerPaymentId: string): Promise<{ providerRefundId: string }> {
    return { providerRefundId: `mock_re_${randomUUID()}_${providerPaymentId}` };
  }
}

/**
 * Provider-neutral payment adapter interface (ADR 0001 section 9.1).
 * BillingModule calls this interface, never Stripe/PayPal SDKs directly -
 * that is what lets a provider be swapped or run in sandbox mode without
 * touching domain logic.
 */
export interface CreatePaymentIntentInput {
  amountMinorUnits: number;
  currency: string;
  idempotencyKey: string;
  metadata: Record<string, string>;
}

export interface PaymentIntentResult {
  providerPaymentId: string;
  clientSecretOrRedirectUrl: string;
}

export interface VerifiedWebhookEvent {
  providerEventId: string;
  eventType: string;
  providerPaymentId: string;
  signatureVerified: true;
}

export interface PaymentAdapter {
  readonly providerName: "STRIPE" | "PAYPAL" | "LOCAL_MOCK";
  createPaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult>;
  /** Throws if the signature is invalid - callers must never process an unverified webhook. */
  verifyWebhookSignature(rawBody: string, signatureHeader: string): Promise<VerifiedWebhookEvent>;
  createRefund(providerPaymentId: string, amountMinorUnits: number, idempotencyKey: string): Promise<{ providerRefundId: string }>;
}

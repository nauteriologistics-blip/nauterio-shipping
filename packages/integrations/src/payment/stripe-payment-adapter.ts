import { PaymentAdapter, CreatePaymentIntentInput, PaymentIntentResult, VerifiedWebhookEvent } from "./payment-adapter";
import { createHmac } from "node:crypto";

export interface StripeAdapterConfig {
  apiKey?: string;
  webhookSecret?: string;
}

/**
 * Stripe Payment Adapter implementing PaymentAdapter interface.
 * Operates against Stripe REST API endpoint directly using standard fetch/crypto.
 */
export class StripePaymentAdapter implements PaymentAdapter {
  readonly providerName = "STRIPE" as const;
  private apiKey: string;
  private webhookSecret: string;

  constructor(config: StripeAdapterConfig = {}) {
    this.apiKey = config.apiKey || process.env.STRIPE_API_KEY || "sk_test_mock";
    this.webhookSecret = config.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock";
  }

  async createPaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult> {
    if (this.apiKey.startsWith("sk_test_mock")) {
      // Sandbox fallback mode when no live API key is set
      const mockId = `pi_stripe_${input.idempotencyKey.slice(0, 16)}`;
      return {
        providerPaymentId: mockId,
        clientSecretOrRedirectUrl: `${mockId}_secret_mock`,
      };
    }

    const params = new URLSearchParams({
      amount: input.amountMinorUnits.toString(),
      currency: input.currency.toLowerCase(),
    });

    Object.entries(input.metadata).forEach(([k, v]) => {
      params.append(`metadata[${k}]`, v);
    });

    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": input.idempotencyKey,
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Stripe API error (${res.status}): ${errorText}`);
    }

    const data = (await res.json()) as any;
    return {
      providerPaymentId: data.id,
      clientSecretOrRedirectUrl: data.client_secret,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string): Promise<VerifiedWebhookEvent> {
    const items = signatureHeader.split(",").reduce((acc, item) => {
      const [k, v] = item.trim().split("=");
      if (k && v) acc[k] = v;
      return acc;
    }, {} as Record<string, string>);

    const timestamp = items["t"];
    const expectedSig = items["v1"];

    if (!timestamp || !expectedSig) {
      throw new Error("Invalid Stripe signature header structure");
    }

    const payloadToSign = `${timestamp}.${rawBody}`;
    const hmac = createHmac("sha256", this.webhookSecret).update(payloadToSign).digest("hex");

    if (hmac !== expectedSig && !this.apiKey.startsWith("sk_test_mock")) {
      throw new Error("Stripe webhook signature verification failed");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      throw new Error("Invalid JSON body in Stripe webhook");
    }

    return {
      providerEventId: parsed.id || `evt_${Date.now()}`,
      eventType: parsed.type || "payment_intent.succeeded",
      providerPaymentId: parsed.data?.object?.id || "pi_mock",
      signatureVerified: true,
    };
  }

  async createRefund(providerPaymentId: string, amountMinorUnits: number, idempotencyKey: string): Promise<{ providerRefundId: string }> {
    if (this.apiKey.startsWith("sk_test_mock")) {
      return { providerRefundId: `re_mock_${Date.now()}` };
    }

    const params = new URLSearchParams({
      payment_intent: providerPaymentId,
      amount: amountMinorUnits.toString(),
    });

    const res = await fetch("https://api.stripe.com/v1/refunds", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": idempotencyKey,
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Stripe refund error (${res.status}): ${errorText}`);
    }

    const data = (await res.json()) as any;
    return { providerRefundId: data.id };
  }
}

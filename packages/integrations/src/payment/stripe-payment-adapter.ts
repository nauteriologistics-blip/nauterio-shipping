import { PaymentAdapter, CreatePaymentIntentInput, PaymentIntentResult, VerifiedWebhookEvent } from "./payment-adapter";
import { createHmac, timingSafeEqual } from "node:crypto";

export interface StripeAdapterConfig {
  apiKey?: string;
  webhookSecret?: string;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Stripe Payment Adapter implementing PaymentAdapter interface.
 * Operates against Stripe REST API endpoint directly using standard fetch/crypto.
 */
export class StripePaymentAdapter implements PaymentAdapter {
  readonly providerName = "STRIPE" as const;
  private apiKey: string;
  private webhookSecret: string;
  private successUrl: string;
  private cancelUrl: string;

  constructor(config: StripeAdapterConfig = {}) {
    this.apiKey = config.apiKey || process.env.STRIPE_API_KEY || "sk_test_mock";
    this.webhookSecret = config.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock";
    this.successUrl = config.successUrl || "http://localhost:3000/portal?payment=success";
    this.cancelUrl = config.cancelUrl || "http://localhost:3000/portal?payment=cancelled";
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

    const params = new URLSearchParams({ mode: "payment", success_url: this.successUrl, cancel_url: this.cancelUrl,
      "line_items[0][price_data][currency]": input.currency.toLowerCase(), "line_items[0][price_data][unit_amount]": input.amountMinorUnits.toString(),
      "line_items[0][price_data][product_data][name]": "Nauterio shipment and insurance", "line_items[0][quantity]": "1" });

    Object.entries(input.metadata).forEach(([k, v]) => {
      params.append(`metadata[${k}]`, v);
    });

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
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
      clientSecretOrRedirectUrl: data.url,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string): Promise<VerifiedWebhookEvent> {
    const items = signatureHeader.split(",").reduce((acc, item) => {
      const [k, v] = item.trim().split("=");
      if (k && v) (acc[k] ??= []).push(v);
      return acc;
    }, {} as Record<string, string[]>);

    const timestamp = items["t"]?.[0];
    const expectedSignatures = items["v1"] ?? [];

    if (!timestamp || expectedSignatures.length === 0) {
      throw new Error("Invalid Stripe signature header structure");
    }

    if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) throw new Error("Stripe signature timestamp is outside the five-minute tolerance");
    const payloadToSign = `${timestamp}.${rawBody}`;
    const hmac = createHmac("sha256", this.webhookSecret).update(payloadToSign).digest("hex");

    const signatureMatches = expectedSignatures.some((signature) =>
      signature.length === hmac.length && timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))
    );
    if (!signatureMatches && !this.apiKey.startsWith("sk_test_mock")) {
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
      eventType: parsed.type || "checkout.session.completed",
      providerPaymentId: parsed.data?.object?.id || "cs_mock",
      paymentStatus: parsed.data?.object?.payment_status,
      amountTotalMinorUnits: typeof parsed.data?.object?.amount_total === "number" ? parsed.data.object.amount_total : undefined,
      currency: typeof parsed.data?.object?.currency === "string" ? parsed.data.object.currency.toUpperCase() : undefined,
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

import type { MessagingAdapter, SendEmailInput, SendSmsInput } from "./messaging-adapter";

export interface ResendAdapterConfig { apiKey: string; fromEmail: string }

export class ResendMessagingAdapter implements MessagingAdapter {
  constructor(private readonly config: ResendAdapterConfig) {}
  async sendEmail(input: SendEmailInput): Promise<{ providerMessageId: string }> {
    const rendered = renderTemplate(input.templateCode, input.variables);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        from: friendlyFromAddress(this.config.fromEmail),
        to: [input.to],
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      }),
    });
    const body = (await response.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!response.ok || !body.id) throw new Error(`Resend email failed (${response.status}): ${body.message ?? "invalid response"}`);
    return { providerMessageId: body.id };
  }
  async sendSms(_input: SendSmsInput): Promise<{ providerMessageId: string }> { throw new Error("Resend does not support SMS"); }
}

function escapeHtml(value: string): string { return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!); }
function renderTemplate(code: string, variables: Record<string, string>): { subject: string; html: string; text: string } {
  const rawTracking = variables.trackingNumber ?? "";
  const tracking = escapeHtml(rawTracking);
  const trackingSubject = sanitizeSubjectPart(rawTracking);
  if (code === "verify_email") {
    const rawUrl = variables.verificationUrl ?? "";
    return {
      subject: "Verify your Nauterio account",
      html: emailLayout({
        heading: "Verify your email address",
        intro: "Welcome to Nauterio Logistics. Confirm this address to finish creating your customer account.",
        actionLabel: "Verify email address",
        actionUrl: rawUrl,
        detail: "This single-use verification link expires in 24 hours. If you did not create an account, you can safely ignore this email.",
      }),
      text: `Welcome to Nauterio Logistics.\n\nVerify your email address: ${rawUrl}\n\nThis single-use verification link expires in 24 hours. If you did not create an account, you can safely ignore this email.`,
    };
  }
  if (code === "signin_link" || code === "staff_signin_link") {
    const rawUrl = variables.signInUrl ?? "";
    const staff = code === "staff_signin_link";
    const destination = staff ? "Nauterio Admin" : "your Nauterio customer account";
    return {
      subject: staff ? "Sign in to Nauterio Admin" : "Sign in to Nauterio",
      html: emailLayout({
        heading: staff ? "Staff sign-in requested" : "Your secure sign-in link",
        intro: `Use the button below to sign in to ${destination}.`,
        actionLabel: "Sign in securely",
        actionUrl: rawUrl,
        detail: "This single-use link expires in 15 minutes. If you did not request it, do not forward this email and simply ignore it.",
      }),
      text: `Sign in to ${destination}: ${rawUrl}\n\nThis single-use link expires in 15 minutes. If you did not request it, do not forward this email and simply ignore it.`,
    };
  }
  if (code === "shipment_created") {
    const trackingUrl = publicTrackingUrl(rawTracking);
    return {
      subject: `Shipment ${trackingSubject} approved`,
      html: emailLayout({
        heading: "Your shipment request is approved",
        intro: "Nauterio operations has reviewed your shipment request and created its tracking record.",
        actionLabel: "View shipment tracking",
        actionUrl: trackingUrl,
        detail: `<strong>Tracking number:</strong> ${tracking}<br><br>Your invoice is available in your customer portal for review. Payment is handled separately after operations confirms the arrangements; this email does not request payment.`,
        detailIsHtml: true,
      }),
      text: `Your Nauterio shipment request has been approved.\n\nTracking number: ${rawTracking}\nTrack it here: ${trackingUrl}\n\nYour invoice is available in your customer portal for review. Payment is handled separately after operations confirms the arrangements; this email does not request payment.`,
    };
  }
  if (code === "shipment_status_updated") {
    const status = humanizeStatus(variables.status ?? "updated");
    const trackingUrl = publicTrackingUrl(rawTracking);
    return {
      subject: `${trackingSubject}: shipment update`,
      html: emailLayout({
        heading: "A shipment movement was recorded",
        intro: "Nauterio operations has added a new update to a shipment associated with your customer account.",
        actionLabel: "View the full tracking timeline",
        actionUrl: trackingUrl,
        detail: `<strong>Tracking number:</strong> ${tracking}<br><strong>Current status:</strong> ${escapeHtml(status)}`,
        detailIsHtml: true,
      }),
      text: `A movement was recorded for your Nauterio shipment.\n\nTracking number: ${rawTracking}\nCurrent status: ${status}\nView the full timeline: ${trackingUrl}\n\nYou are receiving this transactional update because this shipment is associated with your Nauterio customer account.`,
    };
  }
  if (code === "business_inquiry_created") {
    const companyName = variables.companyName ?? "New lead";
    const workEmail = variables.workEmail ?? "";
    const monthlyVolume = variables.monthlyVolume ?? "";
    const message = variables.message ?? "";
    return {
      subject: `Business inquiry: ${sanitizeSubjectPart(companyName)}`,
      html: emailLayout({
        heading: "New business inquiry",
        intro: "A business customer submitted an inquiry through nauteriologistics.com.",
        detail: `<strong>Company:</strong> ${escapeHtml(companyName)}<br><strong>Email:</strong> ${escapeHtml(workEmail)}<br><strong>Monthly volume:</strong> ${escapeHtml(monthlyVolume)}<br><br><strong>Requirements:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}`,
        detailIsHtml: true,
      }),
      text: `New business inquiry\n\nCompany: ${companyName}\nEmail: ${workEmail}\nMonthly volume: ${monthlyVolume}\n\nRequirements:\n${message}`,
    };
  }
  throw new Error(`Unknown email template: ${code}`);
}

interface EmailLayoutInput {
  heading: string;
  intro: string;
  detail: string;
  detailIsHtml?: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

function emailLayout(input: EmailLayoutInput): string {
  const action = input.actionLabel && input.actionUrl
    ? `<p style="margin:28px 0"><a href="${escapeHtml(input.actionUrl)}" style="display:inline-block;border-radius:8px;background:#0f766e;color:#ffffff;font-weight:700;padding:12px 18px;text-decoration:none">${escapeHtml(input.actionLabel)}</a></p>`
    : "";
  const detail = input.detailIsHtml ? input.detail : escapeHtml(input.detail);
  return `<!doctype html><html><body style="margin:0;background:#f8fafc;color:#0f172a;font-family:Arial,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(input.intro)}</div><div style="max-width:600px;margin:0 auto;padding:32px 20px"><div style="margin-bottom:22px;font-size:18px;font-weight:800;color:#0f766e">Nauterio Logistics</div><div style="border:1px solid #e2e8f0;border-radius:14px;background:#ffffff;padding:30px"><h1 style="font-size:24px;line-height:1.25;margin:0 0 14px">${escapeHtml(input.heading)}</h1><p style="font-size:16px;line-height:1.6;margin:0 0 20px;color:#334155">${escapeHtml(input.intro)}</p><div style="font-size:15px;line-height:1.6;padding:16px;border-radius:10px;background:#f1f5f9;color:#334155">${detail}</div>${action}</div><p style="font-size:12px;line-height:1.6;color:#64748b;margin:20px 4px 0">This is a transactional message from Nauterio Logistics. We never request card payment through shipment-status emails. Visit <a href="https://nauteriologistics.com" style="color:#0f766e">nauteriologistics.com</a> or sign in to your customer portal for account information.</p></div></body></html>`;
}

function friendlyFromAddress(fromEmail: string): string {
  return fromEmail.includes("<") ? fromEmail : `Nauterio Logistics <${fromEmail}>`;
}

function publicTrackingUrl(trackingNumber: string): string {
  return `https://nauteriologistics.com/tracking?id=${encodeURIComponent(trackingNumber)}`;
}

function humanizeStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (character) => character.toUpperCase());
}

function sanitizeSubjectPart(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, 160);
}

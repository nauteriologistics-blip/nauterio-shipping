import type { MessagingAdapter, SendEmailInput, SendSmsInput } from "./messaging-adapter";

export interface ResendAdapterConfig { apiKey: string; fromEmail: string }

export class ResendMessagingAdapter implements MessagingAdapter {
  constructor(private readonly config: ResendAdapterConfig) {}
  async sendEmail(input: SendEmailInput): Promise<{ providerMessageId: string }> {
    const rendered = renderTemplate(input.templateCode, input.variables);
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${this.config.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": input.idempotencyKey }, body: JSON.stringify({ from: this.config.fromEmail, to: [input.to], subject: rendered.subject, html: rendered.html }) });
    const body = (await response.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!response.ok || !body.id) throw new Error(`Resend email failed (${response.status}): ${body.message ?? "invalid response"}`);
    return { providerMessageId: body.id };
  }
  async sendSms(_input: SendSmsInput): Promise<{ providerMessageId: string }> { throw new Error("Resend does not support SMS"); }
}

function escapeHtml(value: string): string { return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!); }
function renderTemplate(code: string, variables: Record<string, string>): { subject: string; html: string } {
  const tracking = escapeHtml(variables.trackingNumber ?? "");
  if (code === "verify_email") { const url = escapeHtml(variables.verificationUrl ?? ""); return { subject: "Verify your Nauterio account", html: `<p>Welcome to Nauterio.</p><p><a href="${url}">Verify your email address</a></p><p>This link expires in 24 hours.</p>` }; }
  if (code === "signin_link") { const url = escapeHtml(variables.signInUrl ?? ""); return { subject: "Sign in to Nauterio", html: `<p><a href="${url}">Sign in to your Nauterio account</a></p><p>This single-use link expires in 15 minutes. If you did not request it, you can ignore this email.</p>` }; }
  if (code === "staff_signin_link") { const url = escapeHtml(variables.signInUrl ?? ""); return { subject: "Sign in to Nauterio Admin", html: `<p><a href="${url}">Sign in to Nauterio Admin</a></p><p>This single-use link expires in 15 minutes. If you did not request it, you can ignore this email.</p>` }; }
  if (code === "shipment_created") return { subject: `Shipment ${tracking} approved`, html: `<p>Your shipment <strong>${tracking}</strong> has been approved.</p>` };
  if (code === "shipment_status_updated") return { subject: `${tracking}: shipment update`, html: `<p>Your shipment <strong>${tracking}</strong> is now ${escapeHtml((variables.status ?? "updated").replace(/_/g, " "))}.</p>` };
  if (code === "business_inquiry_created") {
    return {
      subject: `Business inquiry: ${escapeHtml(variables.companyName ?? "New lead")}`,
      html: [
        "<p>A new Nauterio business inquiry was submitted.</p>",
        `<p><strong>Company:</strong> ${escapeHtml(variables.companyName ?? "")}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(variables.workEmail ?? "")}</p>`,
        `<p><strong>Monthly volume:</strong> ${escapeHtml(variables.monthlyVolume ?? "")}</p>`,
        `<p><strong>Requirements:</strong><br>${escapeHtml(variables.message ?? "").replace(/\n/g, "<br>")}</p>`,
      ].join(""),
    };
  }
  throw new Error(`Unknown email template: ${code}`);
}

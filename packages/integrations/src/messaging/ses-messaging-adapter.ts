import { MessagingAdapter, SendEmailInput, SendSmsInput } from "./messaging-adapter";

export interface SesAdapterConfig {
  region?: string;
  fromEmail?: string;
}

export class SesMessagingAdapter implements MessagingAdapter {
  private region: string;
  private fromEmail: string;

  constructor(config: SesAdapterConfig = {}) {
    this.region = config.region || process.env.AWS_REGION || "eu-south-1";
    this.fromEmail = config.fromEmail || process.env.SES_FROM_EMAIL || "notifications@nauterio.com";
  }

  async sendEmail(input: SendEmailInput): Promise<{ providerMessageId: string }> {
    console.log(`[SesMessagingAdapter] Sending email to ${input.to} using template ${input.templateCode}`);
    return {
      providerMessageId: `ses-msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
  }

  async sendSms(input: SendSmsInput): Promise<{ providerMessageId: string }> {
    console.log(`[SesMessagingAdapter] Sending SMS to ${input.to} using template ${input.templateCode}`);
    return {
      providerMessageId: `sms-msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
  }
}

import { randomUUID } from "node:crypto";
import type { MessagingAdapter, SendEmailInput, SendSmsInput } from "./messaging-adapter";

/** Local-dev only - logs instead of sending; never used in production (see ADR 0001 section 11). */
export class LocalMockMessagingAdapter implements MessagingAdapter {
  async sendEmail(input: SendEmailInput): Promise<{ providerMessageId: string }> {
    // eslint-disable-next-line no-console
    console.log(`[local-mock-messaging] email to=${input.to} template=${input.templateCode}`);
    return { providerMessageId: `mock_email_${randomUUID()}` };
  }

  async sendSms(input: SendSmsInput): Promise<{ providerMessageId: string }> {
    // eslint-disable-next-line no-console
    console.log(`[local-mock-messaging] sms to=${input.to} template=${input.templateCode}`);
    return { providerMessageId: `mock_sms_${randomUUID()}` };
  }
}

/**
 * Provider-neutral messaging adapter (SES for email, Twilio for SMS/WhatsApp
 * per ADR 0001 section 9.1). NotificationsModule/apps/worker's
 * notifications-* queues call this, never an SES/Twilio SDK directly.
 */
export interface SendEmailInput {
  to: string;
  templateCode: string;
  variables: Record<string, string>;
  idempotencyKey: string;
}

export interface SendSmsInput {
  to: string;
  templateCode: string;
  variables: Record<string, string>;
  idempotencyKey: string;
}

export interface MessagingAdapter {
  sendEmail(input: SendEmailInput): Promise<{ providerMessageId: string }>;
  sendSms(input: SendSmsInput): Promise<{ providerMessageId: string }>;
}

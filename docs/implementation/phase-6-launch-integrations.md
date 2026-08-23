# Phase 6: launch integrations

## Delivered

- Customer registration writes an email-verification event to the transactional outbox in the same transaction as the user and token.
- The worker routes verification, shipment approval, tracking update, and business-inquiry messages through a real Resend HTTP adapter.
- Provider failures fail the queue message, preserving the existing retry and failed-event handling instead of recording false success.
- Resend requests use the outbox message ID as their idempotency key.
- Production processes refuse to start with the local mock email provider.
- The admin sign-in form now accepts staff email and password and exchanges them server-side with Cognito.
- The Cognito access token remains in an HTTP-only, secure admin cookie and is checked against the Nauterio staff record before access is granted.

## Required account configuration

### Resend

1. Verify the sending domain in Resend.
2. Set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `EMAIL_FROM`, and optionally `BUSINESS_INQUIRY_TO_EMAIL` on the Render service.
3. `EMAIL_FROM` must use the verified domain.

### Cognito

1. Create a public app client with no client secret.
2. Enable `ALLOW_USER_PASSWORD_AUTH` for that client.
3. Set `COGNITO_REGION` and `COGNITO_CLIENT_ID` on the admin Vercel project and the API Render service.
4. Set `COGNITO_USER_POOL_ID` on the API Render service.
5. Each Cognito staff user's `sub` must match an active Nauterio `users.cognito_sub` record with a non-null `staff_role`.

## Current launch note

Secure customer document upload/download is implemented as a fail-closed flow: private object storage, signed URL generation, size/type enforcement, scanner dispatch, scanner callback, staff review, and clean-file download must all be configured before files become usable. If `MALWARE_SCANNER_URL` and `MALWARE_SCANNER_TOKEN` are not set, uploads remain blocked rather than accepting unscanned documents.

Stripe/customer checkout is no longer part of the current operating model. Staff approval creates an invoice for customer review plus the shipment and tracking number; any commercial settlement is handled offline by operations.

# Phase 6: launch integrations

## Delivered

- Customer registration writes an email-verification event to the transactional outbox in the same transaction as the user and token.
- The worker routes verification, shipment approval, and tracking update messages through a real Resend HTTP adapter.
- Provider failures fail the queue message, preserving the existing retry and failed-event handling instead of recording false success.
- Resend requests use the outbox message ID as their idempotency key.
- Production processes refuse to start with the local mock email provider.
- The admin sign-in form now accepts staff email and password and exchanges them server-side with Cognito.
- The Cognito access token remains in an HTTP-only, secure admin cookie and is checked against the Nauterio staff record before access is granted.

## Required account configuration

### Resend

1. Verify the sending domain in Resend.
2. Set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, and `EMAIL_FROM` on both Render services.
3. `EMAIL_FROM` must use the verified domain.

### Cognito

1. Create a public app client with no client secret.
2. Enable `ALLOW_USER_PASSWORD_AUTH` for that client.
3. Set `COGNITO_REGION` and `COGNITO_CLIENT_ID` on the admin Vercel project and the API Render service.
4. Set `COGNITO_USER_POOL_ID` on the API Render service.
5. Each Cognito staff user's `sub` must match an active Nauterio `users.cognito_sub` record with a non-null `staff_role`.

## Remaining launch blocker

Secure customer document upload/download remains intentionally closed until private object storage, signed URL generation, size/type enforcement, and malware scanning are implemented together. Metadata listing is already available; allowing uploads without quarantine and scanning would create a security gap.

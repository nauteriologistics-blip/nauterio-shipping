---
name: nauterio-auth-security
description: Applies Nauterio authentication, authorisation, privacy, audit, application security, and secure coding requirements. Use for Cognito, sessions, MFA, RBAC, permissions, sensitive data, threat modelling, and security review.
compatibility: Amazon Cognito plus PostgreSQL application roles; OWASP ASVS Level 2 baseline.
---

# Nauterio Identity and Security

## Identity

- Amazon Cognito handles authentication, verification, passkeys/MFA, token issuance, and account recovery.
- PostgreSQL holds organisations, membership, application roles, permissions, warehouse scope, assignment scope, approval limits, and audit references.
- Every employee uses an individual account. Staff MFA is mandatory.
- Public tracking remains anonymous for basic status; sensitive details require login or approved secondary verification.

## Authorisation

Evaluate on the server using:

1. Authenticated subject.
2. Active account and organisation membership.
3. Role and explicit permission.
4. Resource ownership or organisational scope.
5. Warehouse, assignment, region, or financial scope.
6. Record state and approval limit.
7. Reauthentication requirement for high-risk actions.

Never rely on hidden buttons as security.

## Security controls

- Least privilege, secure defaults, input validation, output encoding, CSRF/session protection where applicable, rate limits, abuse detection, secure headers, dependency scanning, secret scanning, container and IaC scanning.
- Redact secrets, tokens, identity data, payment details, and document contents from logs.
- Use KMS-backed encryption and TLS.
- Separate production/non-production accounts and credentials.
- Do not expose raw provider errors or internal IDs unnecessarily.
- Threat-model public tracking enumeration, account takeover, webhook forgery, file upload, refund abuse, staff privilege misuse, data export, and supply-chain risk.

## Audit

Record actor, role, action, entity, old/new values, timestamp, correlation ID, IP/device when justified, reason, and approval reference. Audit records are append-only and excluded from ordinary edit flows.

## Privacy

Minimise data, enforce retention, support access/correction/deletion workflows, legal holds, consent versioning, and restricted cross-border processing.

## References

- `docs/sections/29-27-authentication-authorisation-and-audit.md`
- `docs/sections/33-31-security-engineering.md`
- `docs/sections/34-32-privacy-and-retention-engineering.md`
- `docs/sections/46-appendix-e-staff-permission-matrix.md`

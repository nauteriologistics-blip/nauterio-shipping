# 27. Authentication, authorisation and audit

## 27.1 Customer authentication

- Email/password and passkey support; email verification required before sensitive actions.

- Optional authenticator MFA for individuals; mandatory for organisation administrators handling API/credit where configured.

- Password reset uses short-lived single-use tokens and does not reveal account existence unnecessarily.

- Session list and revocation in profile; sensitive changes require recent authentication.

- Public tracking remains available with masked information; sensitive proof requires login or approved secondary verification.

## 27.2 Staff authentication

- Mandatory MFA or passkey; short session; reauthentication for refunds, role changes, exports, identity documents and integration settings.

- Staff user status, role, warehouses, approval limit and effective dates stored in Nauterio database.

- IP/device risk may trigger step-up or block; no permanent broad allow-list that prevents legitimate field work without a fallback process.

- Joiner/mover/leaver workflow requires manager and security/administrator action; access reviewed quarterly.

## 27.3 Permission evaluation

Every server action evaluates identity, account status, global role, organisation membership, warehouse/assignment scope, record relationship, requested operation, approval limit and any separation-of-duties rule. Hiding a button in the interface is not permission enforcement.

## 27.4 Audit event requirements

- Record actor, action, entity, before/after values or safe diff, time, correlation ID, IP/device where appropriate, reason and approval reference.

- Audit login failures, shipment/tracking/address/measurement changes, price overrides, quote approvals, payment/refund/claim decisions, sensitive file access, role changes, exports, retention actions and integration settings.

- Audit data is append-only to application users and separated from ordinary operational editing.

- Sensitive values may be hashed/redacted in the log while preserving evidence of change.

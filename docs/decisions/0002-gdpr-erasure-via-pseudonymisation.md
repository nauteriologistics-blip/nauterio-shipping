# ADR 0002: GDPR erasure implemented as pseudonymisation, never a `DELETE` on `users`

## Status

Accepted.

## Context

`audit_events.actor_user_id` carries `ON DELETE SET NULL`, and `audit_events` is protected by an append-only trigger (`BEFORE UPDATE OR DELETE`). Deleting a `users` row that has ever performed an audited action makes Postgres issue an implicit `UPDATE audit_events SET actor_user_id = NULL ...` to satisfy the FK, which the trigger then rejects — the whole `DELETE` aborts. This was found live during the backend security audit (`docs/audit/security-findings-draft.md`, SEC-011): a test user could not be removed from the dev database by any normal `DELETE FROM users`, and the only escape is disabling the append-only trigger, which defeats the tamper-evidence guarantee it exists to provide.

Two obligations are in tension: CLAUDE.md requires audit history to be append-only and never edited or deleted, and GDPR Article 17 requires that a user be able to have their personal data erased on request. `DELETE FROM users` cannot satisfy both — the first blocks it outright once any audit history exists, which is every real customer who has ever done anything.

## Decision

Implement erasure as **pseudonymisation**, not deletion:

1. The `users` row is never deleted. `AuditEvent.actorUser`'s FK is changed from `ON DELETE SET NULL` to `ON DELETE RESTRICT`, so a future attempt to `DELETE FROM users` fails immediately with a clear foreign-key-violation error instead of the confusing append-only-trigger error — this documents the constraint rather than papering over it.
2. `User` gains an `erasedAt DateTime?` column. A non-null value means the row has been pseudonymised; erasure is a one-way, idempotent operation gated on this field.
3. Erasing a user overwrites the PII columns on `users` (`email`, `fullName`, `phone`, `marketingConsent`) and every `Address`/`Contact` row belonging to that user with deterministic tombstone values, and sets `status` to `CLOSED` (the erased user can no longer authenticate — `LOCAL_AUTH_MODE`'s dev passthrough aside, real Cognito sign-in is a separate system of record and is out of scope for this change; that account must be disabled there independently). `cognitoSub` is left untouched so the row's identity anchor and uniqueness constraint remain intact and the operation is safely repeatable.
4. Every other table — `audit_events`, `shipments`, `quotes`, `bookings`, financial records — is untouched. Their `userId`/`actorUserId` foreign keys keep pointing at the same (now-pseudonymised) row, so historical records remain internally consistent and attributable for compliance and financial-record purposes without carrying the erased person's actual PII.
5. The erasure itself is written as its own audit event (`action: "USER_ERASE"`), in the same transaction as the pseudonymising writes, following the existing `AuditService.record(input, tx)` pattern (ADR 0001 §6.3).
6. Exposed as a staff-only endpoint, `POST /v1/admin/users/:id/erase`, gated by a new `user:erase` permission action restricted to `SUPER_ADMIN` only — the most sensitive action in the catalogue gets the narrowest role.

## Consequences

- Satisfies GDPR Art. 17 for the columns that matter (identifying PII) while preserving the append-only financial/audit history CLAUDE.md requires. This is the reconciliation the two obligations actually admit — not a full physical erasure.
- `erasedAt` must be checked wherever a "still has real PII" assumption would otherwise be made in future code (e.g. an export or a support-ticket lookup surfacing the user's email) — not enforced structurally by this change, and worth a follow-up audit finding if a future feature reads `User.email`/`fullName` without checking it.
- Real Cognito account disablement (so the erased user's credentials stop working) is **not** performed by this change — Cognito is a separate system of record, no real user pool exists in this environment, and the two operations (Nauterio-side pseudonymisation, Cognito-side account disablement) should be coordinated by whatever triggers an erasure request, not assumed to be atomic with each other.
- Address/Contact rows are pseudonymised in place rather than deleted, so a shipment's own address *snapshot* (`Shipment.senderAddressSnapshot`/`receiverAddressSnapshot`, captured at booking time per the append-only-history rule already in place for shipments) is unaffected — those snapshots are historical shipping records, not the live address book, and erasing the address book does not and should not retroactively alter them.
- `user:erase` is intentionally SUPER_ADMIN-only, not exposed as any form of customer self-service, pending a real intake/verification process for erasure requests (identity verification, a cooling-off period, whatever the eventual compliance/legal process specifies) that this ADR does not attempt to design.

## Alternatives considered

- **Change the trigger to allow the FK's `SET NULL` specifically.** Rejected — this would require carving an exception into `reject_update_delete()` for exactly one column, which is fragile (the next FK added to an append-only table would need the same carve-out remembered) and doesn't actually erase anything the user would recognise as "my data" (the audit row itself, including `beforeJson`/`afterJson`, could still contain PII).
- **Physical deletion with audit-row anonymisation first.** Rejected — anonymising an audit row is itself an UPDATE on an append-only table, the exact thing the trigger exists to prevent, and doing it "just this once, right before delete" undermines the guarantee for every other row's history too.

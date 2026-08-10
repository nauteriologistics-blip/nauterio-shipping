# Backend Audit — Remediation Coverage Note

What this remediation pass could and could not verify, in the same spirit as the original audit's own coverage note. The goal is to be explicit about the difference between "fixed and independently verified" and "fixed and only typechecked" — both are legitimate outcomes, but a reader should not have to guess which applies to a given finding.

**Covers the first remediation pass only.** A second pass closed most of the items this document's later sections list as deferred (SEC-011, SEC-012/DATA-014, DATA-011(b), REL-011, REL-013/014's residuals, REL-015) — each with its own live verification, detailed in `BACKEND_AUDIT_VERIFICATION.md`, which is the current source of truth for what's verified and how. This document is retained as an accurate record of what the *first* pass covered, not updated line-by-line for the second.

## Verified by live reproduction against a real Postgres instance and a booted API

These findings were checked by re-running the original audit's own repro steps (or the closest equivalent) against the fixed code, with a real local Postgres database (`nauterio_dev`) and a running `apps/api` process, and confirming the result flipped from failing to passing:

- **DATA-010** — the exact `weightKg: 0.17` under-charge case, plus the `€113`/12kg example, both persisted exact.
- **DATA-008 / DATA-011(a)** — the tracking append-only UPDATE repro and the invalid-`canonical_code` INSERT repro, both now rejected; a legitimate insert confirmed still works.
- **DATA-013 / REL-018** — 20 generated tracking numbers, all well-formed and DB-verified unique.
- **SEC-013** — malformed UUIDs on the three newly-`ParseUUIDPipe`-guarded routes now 400 instead of 500; a well-formed-but-nonexistent ID still correctly 404s.
- **SEC-014** — an attacker-supplied script-tag correlation ID is replaced with a generated UUID; a well-formed partner trace ID is honoured.
- **DATA-016(b)** — all four Prisma error codes mapped to their correct status/retryable combination, verified against real `Prisma.PrismaClientKnownRequestError` instances, including confirming the log-noise side effect (mapped 4xx no longer logs at ERROR level).
- **REL-009 / REL-016** — all five new indexes confirmed present via `pg_indexes`.
- **REL-019** — `pnpm -r lint` confirmed to exit 0 for both backend apps.
- **Worker graceful shutdown** — the refactored `main()` confirmed to still start correctly and exit cleanly on `SIGTERM`.
- **API boot** — confirmed the API still starts and its health endpoint returns 200 after the `main.ts` bootstrap changes.

Earlier in this same session (before a context summarization point; not re-run for this coverage note, but part of the same remediation effort): **SEC-002/SEC-003** (customer token denied on a staff-only route), the follow-on **`warehouse:read`** fix (found only through this live testing, not in the original audit), and a successful `cdk synth` across all 6 stacks after the WAF and RDS-credentials fixes.

## Verified by static analysis (typecheck + existing test suite), not independently re-executed live

Every fix in this pass, without exception, was required to pass `pnpm -r typecheck` (13/13 workspace projects clean) and `pnpm -r test` (all existing Jest/Vitest suites passing) before being considered done. For lower-severity or lower-blast-radius findings, this was the extent of verification — a deliberate choice, not an oversight, since live-reproducing every one of 40 fixes would have meant re-deriving a working exploit/repro for findings whose original reports already did that work once:

- SEC-001, SEC-004, SEC-005, SEC-006, SEC-009, SEC-010 (evaluator-level fixes, verified by reading the corrected `permission-evaluator.ts` and its test suite, not by re-running each of the six original attack transcripts).
- DATA-001 through DATA-005, DATA-012 (already fixed earlier in this session and re-confirmed present by reading current source, not re-exploited).
- REL-001 through REL-008, REL-012, REL-020, REL-021 (CDK-level and worker-level fixes verified via `cdk synth` succeeding, or by reading the corrected source directly).
- The Jest suite for `quotes.service.spec.ts`, `bookings.service.spec.ts`, `claims-returns.service.spec.ts`, `billing.service.spec.ts`, `customers.service.spec.ts`, and `auth.guard.spec.ts` all passing after every change in this pass, confirming no regression in the modules those fixes touched.

## Not verified — infrastructure this environment cannot exercise

No real AWS account exists in this environment (per standing constraint). Every CDK change was verified only via `cdk synth` succeeding (i.e., the CloudFormation template is valid and internally consistent), never via an actual `cdk deploy`. This applies to:

- REL-001 (health-check path wiring), REL-002 (deregistration delay), REL-012 (WAF association), REL-013 (log retention), REL-014 (autoscaling, container env/secrets, RDS Proxy export) — all synth-verified, none deploy-verified. The specific open question REL-014 itself raised — whether Prisma 7's `@prisma/adapter-pg` issues named prepared statements that would defeat RDS Proxy's connection multiplexing — remains genuinely **NOT VERIFIED** and cannot be settled without a real proxy and a real load test.
- The autoscaling policies added (`scaleOnCpuUtilization`) have never seen real traffic; their thresholds are untested defaults, not measured against this workload.

## Not applicable — the code path being audited does not exist

Several findings describe defects in features that are not yet built. These were correctly assessed by the original audit as scope-not-yet-built, and this remediation pass did not change that:

- DATA-004 (producer half), DATA-007, DATA-009, DATA-017, DATA-018, DATA-019, REL-020 — all depend on a shipment-creation endpoint, a payment handler, or a tracking-ingestion adapter that does not exist. The database-side protections these findings evaluate (constraints, indexes, triggers) were checked by direct schema/migration inspection, which is the only form of verification possible for a code path with no caller.

## Deliberately not verified — out of scope for this pass

- SEC-008 / REL-004 (rate-limiting/throttler storage), SEC-011 (GDPR erasure), SEC-012 / DATA-014 (audit trail coverage), SEC-015 (admin token storage), REL-011 (structured logging), REL-015 (quote expiry sweep) — none of these were touched, so there is nothing new to verify. Their pre-existing state was reconfirmed by reading current source (to make sure nothing had silently regressed or been half-implemented) but not otherwise re-tested.

## Residual gap disclosed by this pass's own verification discipline

Applying the same "verify, don't assume" standard to this session's own output rather than only to the original findings: the new migration (`20260809120500_tracking_integrity_and_indexes`) was checked against `pg_constraint`/`pg_indexes` to confirm every object it claims to create actually exists — and that check surfaced that this session's own five new indexes use plain `CREATE INDEX`, not `CREATE INDEX CONCURRENTLY`, which is exactly the rolling-deployment hazard DATA-015 describes for the *original* migration. Recorded honestly in `BACKEND_AUDIT_VERIFICATION.md` (DATA-015) and `BACKEND_AUDIT_FIX_PLAN.md` rather than left for a future reviewer to rediscover.

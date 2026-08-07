---
name: nauterio-code-review
description: Performs an adversarial Nauterio code review against the specification, security, domain invariants, data isolation, reliability, accessibility, tests, and operations. Use before merging or when asked to review a change.
compatibility: Claude Code project skill for pull-request and working-tree review.
---

# Nauterio Code Review

Review the actual diff and surrounding code. Prioritise defects over style commentary.

## Review order

1. Specification mismatch or missing acceptance criteria.
2. Cross-customer/cross-organisation data exposure.
3. Authentication, authorisation, audit, privacy, secrets, file upload, webhook, and payment vulnerabilities.
4. Broken logistics state transitions, duplicate events, incorrect prices, lost financial history, or unsafe customs behaviour.
5. Transaction, concurrency, idempotency, retry, queue, and migration faults.
6. API compatibility and error-contract problems.
7. Missing loading/error/empty/permission/localisation/accessibility states.
8. Performance regressions and unbounded work.
9. Missing or weak tests and missing operational telemetry.
10. Maintainability issues that are likely to cause defects.

## Findings format

For each finding provide:

- Severity: blocker, high, medium, or low.
- File and precise location.
- What fails and under which scenario.
- Why it matters to a Nauterio user or operator.
- Governing specification section.
- Minimal safe correction.
- Test that would catch it.

Do not invent findings. If no material defect is found, say so and list residual risks or untested areas.

## Required checks

- No raw secrets or personal data in logs.
- No client-only authorisation.
- No mutable tracking/audit history.
- No duplicate payment fulfilment.
- No unsafe public document URL.
- No unbounded list/query or queue loop.
- No production action hidden in a “test” path.
- All migrations are rolling-deployment safe.

## References

- `docs/sections/33-31-security-engineering.md`
- `docs/sections/37-35-testing-and-quality-assurance.md`
- `docs/sections/41-39-final-acceptance-criteria.md`

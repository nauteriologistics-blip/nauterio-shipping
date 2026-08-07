---
name: nauterio-release-readiness
description: Runs the Nauterio release and launch readiness process. Invoke before staging, pilot, production release, rollback planning, or public launch.
disable-model-invocation: true
compatibility: Claude Code project skill for controlled release governance.
---

# Nauterio Release Readiness

Only run when explicitly invoked. Do not deploy production merely because checks pass.

## Release packet

Collect:

- Release scope and linked work packages.
- Requirements traceability.
- Pull requests and commits.
- Database and infrastructure changes.
- Feature flags and configuration.
- Test evidence.
- Security and privacy review.
- Performance results.
- Backup/restore status.
- Monitoring and alarm status.
- Runbooks and support briefing.
- Migration, deployment, verification, and rollback steps.
- Known issues and accepted risk owners.

## Gates

Block release for:

- Critical/high unresolved security findings.
- Failing required tests or accessibility blockers.
- Unreviewed destructive migration.
- Missing rollback/recovery path.
- Missing production secrets/accounts/contract evidence.
- Broken audit, payment idempotency, cross-tenant isolation, tracking integrity, or document privacy.
- Unapproved legal/public policy text.
- Incomplete monitoring for a critical new dependency.

## Deployment sequence

1. Confirm approved change window and responsible people.
2. Verify backups and current health.
3. Apply backward-compatible infrastructure/database changes.
4. Deploy workers/API before clients where contract compatibility requires it.
5. Run smoke and synthetic journeys.
6. Observe metrics, logs, queues, payments, carriers, and notifications.
7. Enable feature flags progressively.
8. Record outcome and evidence.
9. Roll back or disable on threshold breach.

## Launch evidence

Use Appendix J. Company-specific evidence must be real: registration, addresses, carrier/broker/insurance contracts, rate cards, vendor ownership, legal approval, hardware, and support readiness.

## References

- `docs/sections/38-36-ci-cd-releases-and-maintenance.md`
- `docs/sections/41-39-final-acceptance-criteria.md`
- `docs/sections/51-appendix-j-final-pre-launch-evidence-checklist.md`

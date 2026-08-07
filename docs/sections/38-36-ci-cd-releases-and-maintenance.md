# 36. CI/CD, releases and maintenance

## 36.1 GitHub workflow

96. Developer creates issue/requirement reference and short-lived branch.

97. Pull request includes change description, screenshots/API changes, tests, data/privacy/security impact and migration notes.

98. CI installs from locked dependencies; checks formatting, lint, type, unit/integration tests, build, dependency/license and secret scan.

99. Docker images are built, scanned, tagged by commit and pushed to company ECR.

100. Staging deploy runs migrations in approved sequence, smoke/end-to-end tests and release review.

101. Production environment requires named approval; deployment health alarms can automatically stop/rollback.

102. Release notes record features, fixes, migrations, configuration, provider changes and rollback.

## 36.2 Database deployment rules

- Expand-and-contract migrations: add compatible columns/tables first, deploy code, backfill, then remove old structure in a later release.

- No manual production schema editing except controlled emergency procedure followed by migration reconciliation.

- Large backfills run as resumable jobs with progress/impact monitoring.

- Migration backup/recovery point and execution owner recorded.

## 36.3 Maintenance cadence

| **Cadence** | **Work**                                                                                                                                  |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Continuous  | Availability, security, queues, provider and backup monitoring.                                                                           |
| Weekly      | Triage incidents/defects, provider failures, dead-letter queues and product metrics.                                                      |
| Monthly     | Dependency patches, cost review, database/index/slow-query review, backup verification and access exceptions.                             |
| Quarterly   | Restore test, access review, carrier/API review, capacity test and disaster-recovery procedure check.                                     |
| Annually    | Independent penetration test, privacy/retention review, business continuity exercise, legal/content review and hardware lifecycle review. |
| Immediate   | Critical security patch, staff departure access removal, compromised key/device revocation and major legal/service alert.                 |

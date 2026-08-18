# Phase 10: controlled pilot

## Delivered

- Production pilot-mode registration allowlist.
- Staff-only pilot control dashboard refreshed every minute.
- Live counts for customers, requests, active/action-required/delivered shipments, scanning, document review, failed events, open issues, and critical issues.
- Oldest-pending-outbox age to expose stalled background processing.
- Persistent pilot issue register with severity, status, shipment linkage, reporter, assignee, resolution, and timestamps.
- Permission-gated issue creation and lifecycle updates for Super Admin, Operations, and Support.
- Same-transaction append-only auditing for issue creation and updates.
- Read-only pilot acceptance check and machine-readable daily report command.

## Pilot operation

Set `PILOT_MODE=true` and `PILOT_ALLOWED_EMAILS` to a comma-separated invitation list. Use dedicated real customer accounts and begin with a small number of shipments. Review the control dashboard and run `pnpm pilot:daily-report` every operating day.

Any critical issue, failed/dead-letter event, unexplained queue age, authentication failure, document-security failure, or tracking inconsistency pauses new pilot shipments until reviewed. The daily report exits with code 2 when critical issues or failed events exist, making it suitable for an operational gate.

## Public-release gate

Disable pilot mode only after the agreed pilot period completes with operational sign-off, no unresolved critical issues, successful recovery rehearsal, acceptable latency/error results, and confirmation that support staff can handle registration, shipment requests, tracking corrections, documents, and customer notifications end to end.

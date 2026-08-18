# Phase 8: document operations

## Delivered

- Admin document-review queue ordered oldest first.
- Dedicated `document:review` permission for Super Admin, Operations, and Customs.
- Identity documents remain hidden from Operations and require the separate restricted identity-document permission.
- Staff can inspect only malware-cleared files through one-minute signed URLs.
- Approve, reject, and replacement-required decisions with mandatory reasons where appropriate.
- Atomic, single-decision state transition to prevent two reviewers deciding the same document.
- Reviewer, review time, and customer-facing review reason are persisted.
- Every review decision is written to the append-only audit trail in the same transaction.
- Customers receive an in-app notification and see the decision and reason in their document centre.
- Replacement uploads create immutable new versions, return the document to processing, and re-enter malware scanning.

## Operational result

The document lifecycle is now complete: customer upload, quarantine, object verification, malware scan, staff inspection, decision, customer notification, and secure replacement. External storage and scanner credentials are still required to activate it in a deployment.

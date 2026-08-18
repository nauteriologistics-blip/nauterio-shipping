# Phase 4: customer communications and supporting documents

## Delivered

- Shipment approval and tracking updates create both email-delivery records and durable in-app notifications.
- Customers have a notification centre with unread highlighting, individual read actions, mark-all-read, and an unread navigation count.
- Notification reads are owner-scoped and cannot modify another customer's records.
- Email and in-app records retain hashes rather than message bodies containing long-lived personal data.
- Customers have a document centre showing document type, shipment association, review status, content type, malware result, and creation time.
- Tracking evidence selectors expose only approved documents attached to the current shipment.

## External dependency retained intentionally

Uploading is not presented as functional until an object-storage service and malware-scanning pipeline are configured. The API deliberately does not accept file bytes into PostgreSQL or mark an unscanned object as safe. The production implementation must provide:

- A private S3-compatible bucket (AWS S3, Cloudflare R2, or equivalent)
- Short-lived signed upload and download URLs
- Quarantine storage and malware scanning
- A trusted callback that changes `malwareScanResult` from `PENDING` to `CLEAN` or `INFECTED`
- Promotion to the protected document bucket only after a clean result

This is the only remaining external dependency for the Phase 4 upload path; document listing, review-state display, access scoping, and evidence consumption are implemented.

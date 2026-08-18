# Phase 7: secure document workflow

## Delivered

- Private S3-compatible object storage support for Cloudflare R2 or AWS S3.
- Five-minute signed PUT URLs; application servers never proxy file bodies.
- Customer ownership checks for shipment-linked documents.
- PDF, JPEG, and PNG allow-list with a 10 MB limit.
- Server-side HEAD verification of the stored object's declared size and media type.
- Quarantine object keys and `PENDING` scan state by default.
- Malware-scanner dispatch using a short-lived signed read URL.
- Authenticated scanner callback accepting only `CLEAN`, `INFECTED`, or `ERROR`.
- Infected and errored files are rejected and never become downloadable.
- Clean downloads use one-minute signed URLs and are scoped to the owning customer.
- Customer upload, scan-state, and clean-download interface.

## Required configuration

Set the object-storage and scanner variables listed in `apps/api/.env.example` on Render. For Cloudflare R2, the endpoint is `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` and the region is `auto`.

The bucket must remain private and its CORS policy must permit `PUT` from the production customer Vercel origin. Do not permit public reads. The scanner must accept JSON containing `versionId`, `downloadUrl`, and `callbackUrl`, scan the file, and call the callback with the shared bearer token and `{ "result": "CLEAN" | "INFECTED" | "ERROR" }`.

## Security behavior

An upload is not considered usable when the browser finishes PUT. It becomes downloadable only after object metadata is independently verified and the configured scanner reports `CLEAN`. Signed URLs expire and do not expose long-lived storage credentials.

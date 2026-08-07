---
name: nauterio-customs-documents
description: Implements customs data, restricted-goods review, secure document handling, labels, barcodes, generated PDFs, and retention. Use for uploads, customs workflows, package declarations, document review, and proof-of-delivery files.
compatibility: EU-origin and US-destination shipping document workflows.
---

# Nauterio Customs and Documents

## Customs data

Capture detailed description, quantity, unit value, total value, currency, country of origin, intended use, HS code, sender, receiver, importer, invoice, packing list, licences, and certificates where required.

- “Gift”, “sample”, or “personal item” is not an adequate goods description.
- Positive answers for batteries, liquids, food, medicine, alcohol, tobacco, chemicals, perishables, high value, or temperature control route to review.
- The platform communicates and assists; it does not guarantee customs release.
- Never invent HS codes, licences, or legal eligibility.

## Upload flow

1. Issue a short-lived authorised upload request.
2. Validate declared file type, size, and category.
3. Upload to private quarantine storage.
4. Verify file signature and scan for malware.
5. Move approved content to protected storage.
6. Record version, hash, uploader, purpose, retention class, and access history.
7. Use short-lived signed downloads with authorisation checked at request time.

## Rules

- Allowed normal customer formats: PDF, JPG, JPEG, PNG.
- No public S3 objects or permanent document URLs.
- Identity documents receive stricter access and shorter retention.
- Support agents do not automatically gain access to customs identity files.
- Generated documents must use controlled templates and preserve source data/version.

## Labels and barcodes

- Default 4 × 6 inch direct-thermal label.
- Code 128 barcode plus a QR code that resolves to a secure tracking link.
- Never encode names, addresses, phone numbers, value, or contents directly in the QR code.
- Audit every label reprint.

## References

- `docs/sections/18-16-customs-restricted-goods-and-documents.md`
- `docs/sections/30-28-files-labels-barcodes-and-generated-documents.md`
- `docs/sections/45-appendix-d-forms-and-required-fields.md`
- `docs/sections/48-appendix-g-retention-schedule.md`

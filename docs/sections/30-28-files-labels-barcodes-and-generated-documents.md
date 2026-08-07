# 28. Files, labels, barcodes and generated documents

## 28.1 Secure upload flow

75. Client asks API for an upload intent with document type, expected size and related shipment/case.

76. API checks permission, allowed type/count and creates a short-lived pre-signed S3 upload.

77. Client uploads directly to private quarantine storage.

78. Worker validates actual file signature, type, size, image/PDF safety and malware result.

79. Safe file moves/logically promotes to protected storage; unsafe file is quarantined and never delivered.

80. Metadata/version and review task are created; user sees Processing, Approved, Rejected or Replacement Required.

81. Downloads use short-lived signed URLs after a fresh permission check; public URLs are prohibited.

## 28.2 Label specification

| **Item**         | **Requirement**                                                                                     |
|------------------|-----------------------------------------------------------------------------------------------------|
| Size             | 4 x 6 inches / approximately 102 x 152 mm; direct thermal.                                          |
| Printer language | ZPL-compatible; PDF fallback for office printing.                                                   |
| Resolution       | 203 dpi baseline; 300 dpi supported.                                                                |
| Identifiers      | Human-readable master/package number, Code 128 barcode and QR tracking link.                        |
| Routing          | Origin/destination/warehouse route codes and service level.                                         |
| Package context  | Sequence such as 2 of 4, weight and handling marks.                                                 |
| Privacy          | Only limited receiver information; no declared value or item detail in QR.                          |
| Reprint          | Reprint reason, staff, time and printer recorded; original identity remains unchanged.              |
| Carrier label    | Stored separately and printed according to carrier API contract; never overwrite Nauterio identity. |

## 28.3 Generated documents

- Quote, booking confirmation, Nauterio label, pickup receipt, invoice, receipt, customs request, proof of delivery, claim acknowledgement, credit note, refund confirmation and return label where applicable.

- Templates are versioned; generated file records template version, locale, source data snapshot, generator and hash.

- Documents use server-side rendering in a worker and are stored privately; emails send secure links or approved attachments.

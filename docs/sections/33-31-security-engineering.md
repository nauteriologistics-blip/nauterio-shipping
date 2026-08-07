# 31. Security engineering

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>Security baseline<br />
</strong>Use OWASP ASVS Level 2 as the development and acceptance baseline [Q2]. A qualified independent penetration test is required before public launch and at least annually or after major security-sensitive changes.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

| **Control area** | **Mandatory approach**                                                                                                                                                                                 |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Threat modelling | Model account takeover, tracking enumeration, address/document exposure, payment fraud, malicious upload, staff misuse, webhook forgery, API abuse, offline device loss and carrier data manipulation. |
| Input/output     | Runtime validation, allow-lists, contextual encoding, safe database parameters and no raw error traces.                                                                                                |
| Authentication   | Cognito, verified email, strong recovery, MFA/passkeys, session revocation and step-up for high-risk actions.                                                                                          |
| Authorisation    | Server-side RBAC/relationship/scope checks on every request and object; deny by default.                                                                                                               |
| Secrets          | AWS Secrets Manager/SSM; rotation; no secrets in repository, client bundles, images or logs.                                                                                                           |
| Encryption       | TLS in transit; KMS-managed encryption for database snapshots, S3, queues where applicable and secrets.                                                                                                |
| File upload      | Private quarantine, signature/type/size validation, malware scan, no executable delivery and short-lived access \[Q3\].                                                                                |
| Payments         | Hosted provider surface; verified webhooks; no full card storage; controlled refund permissions.                                                                                                       |
| Webhooks         | HTTPS, signature/timestamp verification, replay protection, idempotency and endpoint isolation.                                                                                                        |
| Abuse            | WAF, rate limits, bot controls, tracking anti-enumeration, CAPTCHA only where risk justifies it and fraud monitoring.                                                                                  |
| Dependencies     | Lockfile, automated vulnerability/license scanning, SBOM and patch policy.                                                                                                                             |
| Containers       | Minimal non-root images, read-only where practical, image scanning and signed/provenance-aware releases.                                                                                               |
| Audit/monitoring | Append-only business audit, CloudTrail, alerts and incident runbooks.                                                                                                                                  |
| Backups          | Encrypted, separate-region copies, restricted restore and tested recovery.                                                                                                                             |

## 31.1 Data classification

| **Class**         | **Examples**                                                                                    | **Handling**                                                                      |
|-------------------|-------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| Public            | Published service pages, approved alerts and public assets                                      | May be cached and indexed according to page rules.                                |
| Internal          | Operational process notes without sensitive personal data                                       | Authenticated staff; no public sharing.                                           |
| Confidential      | Customer contacts, addresses, shipment details, invoices and support                            | Role/relationship controlled; encrypted; logged where appropriate.                |
| Highly restricted | Identity documents, payment/security information, sensitive customs evidence and access secrets | Small named roles, reauthentication, detailed access logging and short retention. |
| Security secret   | API keys, webhook secrets, private keys and recovery credentials                                | Secrets manager only; never displayed again where avoidable; rotation/revocation. |

## 31.2 Incident response

82. Detect and assign severity.

83. Contain compromised accounts, keys, devices or integration routes.

84. Preserve logs and evidence without altering the source records.

85. Assess affected data, shipments and jurisdictions.

86. Notify management, privacy/legal, providers and authorities/customers where required.

87. Recover from known-good configuration/backups and monitor recurrence.

88. Complete root-cause analysis, actions, owner and deadline; verify remediation.

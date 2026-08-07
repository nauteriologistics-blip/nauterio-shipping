# 21. System architecture

<img src="/mnt/data/Nauterio_Claude_Code_Skills_Kit/docs/spec-media/media/image5.png" style="width:7in;height:4.83333in" alt="Image: image5.png" />

*Figure 5. Production architecture. External providers connect through adapters and signed webhook endpoints.*

## 21.1 Request path

67. The customer resolves the company .com domain through Route 53.

68. CloudFront terminates public delivery, caches safe static content and forwards dynamic traffic through AWS WAF.

69. Application Load Balancer sends requests to healthy ECS Fargate services in private subnets.

70. Cognito authenticates users; the API validates tokens and retrieves Nauterio roles/organisation/warehouse context.

71. NestJS applies validation, permission checks and database transactions.

72. Long-running work is written through the transactional outbox and delivered to SQS workers.

73. Files use pre-signed upload/download flows into private S3 after policy checks.

74. Logs, metrics and traces carry a correlation ID across web, API, worker and provider callback.

## 21.2 Source-of-truth boundaries

| **Information**                                   | **System of record**                                                                                           |
|---------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| Customer/organisation and application permissions | Nauterio PostgreSQL; Cognito stores identity authentication attributes.                                        |
| Shipments, packages and Nauterio tracking events  | Nauterio PostgreSQL.                                                                                           |
| External carrier event                            | Raw provider payload retained securely; mapped public/operational event stored in PostgreSQL.                  |
| Payment transaction                               | Payment provider is authoritative for provider status; Nauterio stores verified event and business allocation. |
| Support conversation                              | Zendesk is conversation record; Nauterio stores ticket ID and operational linkage.                             |
| Uploaded/generated document                       | S3 object; PostgreSQL stores metadata, access and review state.                                                |
| Financial invoice                                 | Nauterio billing record plus approved Italian accounting/e-invoicing provider result.                          |
| Audit/security activity                           | Append-only application audit plus CloudTrail/security logs.                                                   |

# 34. Observability and supportability

## 34.1 Telemetry

- Structured JSON application logs with service, environment, level, timestamp, correlation ID, user/organisation safe ID and event category.

- OpenTelemetry traces across edge request, web/API, database, queue and worker/provider calls.

- Metrics for request rate/error/latency, ECS capacity, RDS, cache, queue age/depth, document scans, provider success, payment state, notification state and business workflows.

- CloudTrail and AWS security service findings into central security monitoring.

- Client real-user performance and JavaScript errors with privacy-safe context.

## 34.2 Required alarms

| **Alarm**                                       | **Response**                                                                         |
|-------------------------------------------------|--------------------------------------------------------------------------------------|
| Public/API high error or latency                | Page on-call; inspect recent release/dependency and capacity; rollback if necessary. |
| Database/storage capacity or health             | Escalate immediately; protect writes and scale/repair.                               |
| Queue oldest-message age/dead-letter growth     | Identify consumer/provider; pause unsafe flow; replay after fix.                     |
| Payment webhook verification/processing failure | Finance/technical alert; reconcile provider state before fulfilment.                 |
| Carrier event backlog                           | Operations/technical alert; activate polling/manual communication.                   |
| Notification bounce/complaint spike             | Messaging/support review; protect sender reputation.                                 |
| Large export/unusual sensitive download         | Security review and possible account/session suspension.                             |
| Backup/replication failure                      | Critical operational alert; restore protection immediately.                          |
| Certificate/domain expiry risk                  | Alert at least 60/30/14/7 days with ownership.                                       |
| Cost anomaly                                    | Technical/product review for abuse, configuration error or unexpected growth.        |

## 34.3 Runbooks

- Public site/API outage; database saturation; queue backlog; S3 upload failure; carrier outage; payment outage; messaging outage; address provider outage; Zendesk outage; compromised staff account; lost warehouse/driver device; malicious upload; backup restore; regional recovery and data-rights request.

- Each runbook has trigger, severity, owner, diagnosis, containment, workaround, recovery, customer communication and closure checklist.

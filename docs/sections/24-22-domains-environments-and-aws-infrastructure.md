# 22. Domains, environments and AWS infrastructure

## 22.1 Domain and subdomains

| **Address**            | **Purpose**                                                | **Indexing**                                   |
|------------------------|------------------------------------------------------------|------------------------------------------------|
| www.\<company\>.com    | Public marketing, quote, booking, tracking, help and legal | Public pages indexed; tracking results noindex |
| app.\<company\>.com    | Customer and business portal                               | Noindex; authenticated                         |
| admin.\<company\>.com  | Administration dashboard                                   | Noindex; staff only                            |
| api.\<company\>.com    | REST API and provider callbacks                            | Noindex; API controls                          |
| docs.\<company\>.com   | Approved API reference and integration guides              | Public or partner-restricted according to page |
| status.\<company\>.com | Independently hosted status page                           | Public                                         |
| assets.\<company\>.com | Approved public assets only                                | Controlled caching; never private files        |

## 22.2 AWS organisation and accounts

- Company-owned AWS Organisation with separate management, security/log archive, shared services, non-production and production accounts.

- AWS root users protected by hardware/passkey MFA, recovery controls and no daily use.

- Least-privilege IAM roles with identity federation for developers and operators; no long-lived personal access keys where avoidable.

- AWS CloudTrail organisation trail, AWS Config, GuardDuty and Security Hub aggregated into the security account.

- Budgets and anomaly alerts by account, environment and major service.

## 22.3 Network design

- Production VPC spans at least three Availability Zones in Milan where supported.

- Public subnets contain only load-balancing/NAT components; ECS tasks, database, cache and internal services use private subnets.

- RDS and ElastiCache are not publicly reachable.

- Security groups allow only required service-to-service flows.

- VPC endpoints for S3, SQS, ECR, CloudWatch and other justified AWS services reduce public network exposure.

- Outbound internet from workers/API is controlled for approved provider endpoints and monitored.

## 22.4 Environments

| **Environment** | **Purpose**                                            | **Data**                               | **Deployment**                                                   |
|-----------------|--------------------------------------------------------|----------------------------------------|------------------------------------------------------------------|
| Local           | Developer feature work and tests                       | Synthetic fixtures only                | Developer-controlled containers/tools                            |
| Development     | Shared integration and early QA                        | Generated data; provider sandboxes     | Automatic from approved development branch or ephemeral workflow |
| Preview         | Optional pull-request interface review                 | Generated minimal data                 | Temporary, no production secrets                                 |
| Test            | Automated end-to-end and integration                   | Repeatable fixtures                    | CI-managed                                                       |
| Staging         | Production-like acceptance, load and release rehearsal | Synthetic/anonymised; provider sandbox | Same infrastructure pattern as production                        |
| Production      | Live company operations                                | Real controlled data                   | Protected approval and release process                           |

## 22.5 Compute and scaling

- ECS Fargate services: web, admin, API and worker. Each has independent CPU, memory, scaling and deployment.

- Minimum two running tasks for critical web/API services across Availability Zones after pilot.

- Auto-scale on CPU/memory, request count/latency and SQS queue depth as appropriate.

- Use blue/green or rolling deployment with health checks and automatic rollback on failed alarms.

- Scheduled jobs run as controlled ECS tasks or event-triggered workers; avoid an unmanaged cron server.

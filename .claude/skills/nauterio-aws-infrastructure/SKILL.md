---
name: nauterio-aws-infrastructure
description: Designs and implements Nauterio AWS infrastructure with CDK. Use for accounts, regions, networking, ECS Fargate, RDS PostgreSQL, S3, SQS, CloudFront, WAF, Cognito, SES, observability, backups, and disaster recovery.
compatibility: AWS CDK in TypeScript; primary region eu-south-1 and recovery region eu-central-1.
---

# Nauterio AWS Infrastructure

## Approved architecture

- Route 53 and ACM for domains/certificates.
- CloudFront and AWS WAF at the public edge.
- Application Load Balancer to ECS services on Fargate.
- Separate web, admin, API, and worker services.
- RDS PostgreSQL in private subnets with Multi-AZ production configuration and point-in-time recovery.
- Private S3 buckets with KMS, versioning, lifecycle, and selected cross-region replication.
- SQS queues and dead-letter queues.
- Cognito for identity and SES for transactional email.
- CloudWatch, CloudTrail, GuardDuty, Security Hub, WAF logs, and OpenTelemetry.

## Account and environment rules

- Separate AWS accounts for production and non-production.
- Primary production data in Milan `eu-south-1`; encrypted recovery copies in Frankfurt `eu-central-1`.
- Infrastructure is defined in AWS CDK TypeScript and deployed through reviewed pipelines.
- No public database, no public private-document bucket, no long-lived developer access keys.
- Secrets live in Secrets Manager or Parameter Store with KMS, not source code or plain environment files.

## CDK rules

- Use composable constructs and environment-specific stacks.
- Apply tags, ownership, cost allocation, deletion protection, backups, alarms, log retention, encryption, and least-privilege IAM explicitly.
- Run `cdk synth`, unit assertions, policy/security scans, and change review before deployment.
- Avoid wildcard IAM. Explain every unavoidable wildcard.
- Do not deploy production automatically from unreviewed branches.

## Reliability

- Scale stateless services horizontally.
- Define health checks, circuit-breaking behaviour, deployment rollback, queue alarms, database alarms, and runbooks.
- Target RPO no greater than 15 minutes and RTO within four hours for critical operations.
- Test restoration and recovery, not only backup creation.

## References

- `docs/sections/23-21-system-architecture.md`
- `docs/sections/24-22-domains-environments-and-aws-infrastructure.md`
- `docs/sections/35-33-performance-scale-and-reliability.md`
- `docs/sections/36-34-observability-and-supportability.md`

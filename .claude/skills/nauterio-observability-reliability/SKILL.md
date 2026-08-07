---
name: nauterio-observability-reliability
description: Implements Nauterio logs, metrics, traces, alarms, runbooks, performance targets, backups, incident response, and disaster recovery. Use when operating, troubleshooting, scaling, or hardening the platform.
compatibility: OpenTelemetry and AWS CloudWatch-based operations.
---

# Nauterio Observability and Reliability

## Telemetry

- Structured JSON logs with timestamp, severity, service, environment, correlation ID, trace ID, request ID, actor ID where safe, operation, outcome, duration, and error code.
- Distributed traces across edge, API, database, queues, workers, and external adapters.
- Metrics for traffic, latency, errors, saturation, queue depth/age, dead-letter counts, database connections/replication, document scan failures, webhook failures, carrier lag, payment failures, notification delivery, and business workflow health.
- Never log secrets, passwords, access tokens, full identity documents, full payment data, or unnecessary personal data.

## Service targets

Monitor the specification's SLOs for availability, public tracking latency, shipment lists, quote calculation, search, PDF generation, and recovery.

## Alarms

Every critical alarm needs owner, severity, threshold, evaluation window, notification target, runbook, and suppression/maintenance behaviour. Alert on user impact and actionable conditions rather than noise.

## Incident workflow

1. Detect and classify.
2. Protect customers and data.
3. Establish incident lead and communication channel.
4. Mitigate and preserve evidence.
5. Recover and verify.
6. Communicate status.
7. Produce a blameless review with actions and owners.

## Backups and recovery

- RDS point-in-time recovery and snapshots.
- S3 versioning/replication for selected records.
- Infrastructure reproducible from CDK.
- Quarterly restore tests and recovery exercises.
- Record actual RPO/RTO evidence.

## References

- `docs/sections/35-33-performance-scale-and-reliability.md`
- `docs/sections/36-34-observability-and-supportability.md`
- `docs/sections/33-31-security-engineering.md`

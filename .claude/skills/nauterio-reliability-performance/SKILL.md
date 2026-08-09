---
name: nauterio-reliability-performance
description: Use to assess Nauterio backend production readiness for reliability, performance, AWS operations, graceful shutdown, timeouts, retries, circuit breaking, connection pools, SQS/ECS/RDS behavior, indexing/query efficiency, memory/event-loop risks, caching, health checks, autoscaling, logging, metrics, tracing, alerting, backups, disaster recovery, and cost-amplification failure modes.
---

# Nauterio Reliability, Performance, and Operations Audit

Review the backend as a production distributed system, not merely as code that passes tests.

## Core principle
Every remote dependency will eventually become slow, fail, throttle, return malformed data, or respond after the caller has given up. Every process will eventually restart during work. Every queue will eventually contain duplicates. Every table that matters will grow.

## Method

1. Map synchronous dependency graph and asynchronous jobs.
2. For each external dependency, identify timeout, retry, backoff, circuit/isolation, concurrency, and fallback behavior.
3. Inspect DB queries/indexes/pagination and connection-pool assumptions against expected growth.
4. Trace startup, readiness, liveness, SIGTERM, deployment, and shutdown behavior.
5. Inspect SQS worker semantics and load shedding.
6. Inspect observability: structured logs, correlation IDs, metrics, traces, dashboards, alarms.
7. Inspect RDS/S3/ECS backup/recovery/deployment configuration if infrastructure code exists.
8. Apply `references/reliability-checklist.md`.

## Do not over-report
A theoretical micro-optimization is not a finding. Report performance issues when they can plausibly cause latency, saturation, cost amplification, or an operational incident at expected scale.

## Required evidence
For DB performance findings, show query pattern, missing/incorrect index or unbounded result, and expected growth path. Use EXPLAIN only against a safe non-production environment. For reliability findings, show the failure path and what happens on timeout/crash/retry.

## References
- `references/reliability-checklist.md`
- `../_nauterio-backend-common/references/stack-checklist.md`
- `../_nauterio-backend-common/references/business-invariants.md`
- `../_nauterio-backend-common/references/finding-schema.md`

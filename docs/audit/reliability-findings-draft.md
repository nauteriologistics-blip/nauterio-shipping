# Nauterio Logistics — Reliability, Performance & Operations Audit (draft)

**Scope:** `apps/api`, `apps/worker`, `packages/database`, `packages/observability`, `infra/cdk`
**Date:** 2026-08-07
**Method:** static read-only review of source, Prisma schema + SQL migrations, and CDK stacks. Nothing was deployed, no migration was applied, no load test was run. Where a claim could only be settled by running the system, it is marked NOT VERIFIED rather than asserted.
**Calibration target:** a mid-size Italy→US parcel shipper, thousands to tens of thousands of shipments/month, 4 ECS Fargate services behind one ALB, single RDS PostgreSQL instance.

---

## REL-001 — ALB health check for the API points at a route that returns 404 and queries Postgres

- **Severity:** Critical
- **Confidence:** High
- **File:line:** `infra/cdk/lib/compute-stack.ts:71`, `infra/cdk/lib/compute-stack.ts:118`; `apps/api/src/modules/content/content.module.ts:14-32`; `apps/api/src/main.ts` (whole file)

**Evidence.** The API target group is registered with `healthCheckPath = "/v1/content/pages/health"`. That path is not a health endpoint — it resolves to `ContentController.getBySlug(":slug")` with `slug = "health"`, which executes `prisma.contentPage.findUnique({ where: { slug: "health" }, include: { policyVersions: ... } })` and, when no such row exists, throws `NotFoundException`. `packages/database/prisma/seed.ts` creates no `ContentPage` rows (grep for `slug` in the seed returns nothing), so the response is HTTP 404. `elbv2` target groups default to `healthyHttpCodes: "200"`. Separately, grep for `health` across `apps/api/src`, `apps/worker/src` and `packages/*/src` returns **zero** hits — there is no liveness or readiness endpoint anywhere in the codebase.

**Failure path.** Task starts → ALB health check hits `/v1/content/pages/health` every 30s → 404 → after the default unhealthy threshold the target is deregistered → ECS replaces the task → the replacement fails identically → `circuitBreaker: { rollback: true }` (line 109) trips and rolls the deployment back. The API service can never reach a steady healthy state. Compounding this, `taskDefinition.addContainer` (lines 94-101) sets neither `environment` nor `secrets`, so `DATABASE_URL` is absent and `loadApiConfig()` throws at boot before `listen()` is ever reached — the comment at lines 98-100 describes an injection mechanism that no code in this repository implements.

**Impact.** The compute stack as written cannot bring the API up at all. Even with the container env fixed, the health check would still fail. And a health check that *did* return 200 from this path would be a database-dependent check running one indexed query per task every 30s — coupling ALB liveness to RDS availability, which turns a transient DB blip into a fleet-wide task replacement storm.

**Recommended fix.** Add a dedicated `GET /v1/health` (liveness: process is up, no I/O) and `GET /v1/health/ready` (readiness: `SELECT 1` with a short timeout, used for deployment gating only, never for ALB liveness). Point the target group's `healthCheck.path` at the liveness route, set `healthyHttpCodes` explicitly, and set `healthCheckGracePeriod` on the Fargate service to cover NestJS + Prisma boot. Wire `DATABASE_URL` and the Cognito values into the task definition via `ecs.Secret.fromSecretsManager`.

---

## REL-002 — API has no SIGTERM handling and no `enableShutdownHooks()`; in-flight requests are hard-killed on every deploy

- **Severity:** High
- **Confidence:** High
- **File:line:** `apps/api/src/main.ts:20-55` (absent); compare `apps/worker/src/main.ts:39-46`

**Evidence.** Grep for `SIGTERM|SIGINT|enableShutdownHooks|onModuleDestroy|OnApplicationShutdown|beforeExit` across `apps/api/src` returns nothing. The worker, by contrast, registers `process.on("SIGTERM", shutdown)` / `SIGINT` at `apps/worker/src/main.ts:45-46` and its handler stops the relay interval, clears the retention interval, and awaits `disconnectPrisma()` (which calls both `client.$disconnect()` and `pool.end()`, `packages/database/src/index.ts:44-49`). None of that exists in the API.

**Failure path.** ECS task stop (rolling deploy, scale-in, AZ rebalance, task failure) sends SIGTERM. Node's default disposition for SIGTERM with no registered listener is immediate process termination — no `server.close()`, no draining. Every request currently executing dies mid-flight: the client sees a TCP reset or a truncated response rather than a clean 5xx, and any request that had already committed a write but not yet returned leaves the caller unable to distinguish "committed" from "failed". The `pg` pool's ~10 sockets are abandoned rather than closed, so RDS (and RDS Proxy, if it were wired) holds those backends until TCP keepalive/`idle_in_transaction_session_timeout` reaps them. There is also no `deregistration_delay` configured on the target group (`compute-stack.ts:112-119`), so the ALB may still be routing new requests to the task at the moment SIGTERM lands.

**Impact.** Every deployment, every scale-in event, and every Fargate task recycle produces a burst of failed requests. For write endpoints under `IdempotencyInterceptor`, this is worse than a plain 5xx: see REL-010 — the claimed idempotency record is left `IN_PROGRESS` forever, so the client's retry with the same key gets a permanent 409.

**Recommended fix.** In `bootstrap()`: `app.enableShutdownHooks()`, and a signal handler that calls `await app.close()` (which drains the HTTP server and runs `onModuleDestroy`/`onApplicationShutdown`) then `await disconnectPrisma()`, with a hard-exit timer as a backstop. Add an `OnApplicationShutdown` provider in the database package so the pool is closed via the Nest lifecycle rather than by hand. Set `deregistrationDelay` on the target group and `stopTimeout` on the container so ECS allows the drain to finish.

---

## REL-003 — Public tracking lookup cannot use any index; it sequentially scans `shipments` on every anonymous request

- **Severity:** High
- **Confidence:** High
- **File:line:** `apps/api/src/modules/tracking/tracking.service.ts:42-50`

**Evidence.**

```ts
const clean = trackingNumber.trim().toUpperCase();
const shipment = await prisma.shipment.findFirst({
  where: { trackingNumber: { equals: clean, mode: "insensitive" } },
  include: { trackingEvents: { orderBy: { eventTime: "desc" } }, service: true },
});
```

Prisma compiles `mode: "insensitive"` on PostgreSQL to `ILIKE`, i.e. `WHERE "tracking_number" ILIKE $1 LIMIT 1`. Two perfectly good indexes exist and **neither is usable by that predicate**:

- `shipments_tracking_number_key` — plain B-tree on `tracking_number` (`migrations/20260807023945_init/migration.sql:843`). `ILIKE` uses a case-insensitive collation-dependent operator, not `=`; the B-tree is not applicable.
- `shipments_tracking_number_normalised_idx` — `UNIQUE INDEX ON shipments (UPPER("tracking_number"))` (`migrations/20260807024500_constraints_and_triggers/migration.sql`, final statement). A functional index is only used when the query's expression matches; `tracking_number ILIKE $1` does not match `UPPER(tracking_number) = $1`.

The `.toUpperCase()` on line 42 already normalises the input, which makes `mode: "insensitive"` redundant — the code pays for a sequential scan to do something it has already done in JavaScript.

**Failure path.** Cost grows linearly with `shipments` row count. The unauthenticated miss case — which is exactly the attacker/enumeration case, and also the common "customer typo" case — is the worst one, because `LIMIT 1` cannot short-circuit a scan that finds nothing. As the table grows, each request holds a pool connection for longer; the pool is `max: 10` per process (`packages/database/src/index.ts:23`) and shared with every other endpoint in that task. Once concurrent tracking lookups exceed 10, other requests queue on `connectionTimeoutMillis: 5_000` and then throw "timeout exceeded when trying to connect" — surfaced by `AllExceptionsFilter` as a 500 with `retryable: true`, which well-behaved clients will retry, deepening the saturation. Beyond ~15s per scan, `statement_timeout: 15_000` starts killing the queries outright.

**Impact.** The single most-hit public endpoint on the platform degrades from O(1) to O(table). It is unauthenticated, and its rate limit does not hold at fleet scale (REL-004), so this is a cheap denial-of-service path against the primary database that takes the authenticated portal and admin down with it.

**Recommended fix.** Replace with `prisma.shipment.findUnique({ where: { trackingNumber: clean } })` — the input is already uppercased and the unique B-tree serves it directly. If genuine case-insensitive matching is required for legacy data, use `$queryRaw` with `WHERE UPPER(tracking_number) = $1` so the existing functional index is used, or migrate the column to `citext`. Add a regression test that asserts the query plan is an index scan.

---

## REL-004 — Throttler uses default in-memory storage; the anti-enumeration limit multiplies by task count

- **Severity:** High
- **Confidence:** High
- **File:line:** `apps/api/src/app.module.ts:37`, `apps/api/src/app.module.ts:60`; `apps/api/src/modules/tracking/tracking.controller.ts:17`; `apps/api/src/modules/quotes/quotes.controller.ts:17`

**Evidence.** `ThrottlerModule.forRoot([{ name: "default", ttl: 60_000, limit: 120 }])` is registered with no `storage` option. `@nestjs/throttler`'s default is `ThrottlerStorageService`, a per-process in-memory `Map` — confirmed reading: there is no shared store configured anywhere, and ElastiCache/Valkey is provisioned in `infra/cdk/lib/data-stack.ts:102-107` but nothing in `apps/api` connects to it (no client, no env var, no dependency).

**Failure path.** Behind an ALB with N tasks, each task keeps an independent counter and requests are distributed round-robin. A caller therefore gets up to `N × limit` requests per window. The two limits this matters most for are both public and both explicitly justified in comments as security controls:

- tracking: `@Throttle({ default: { limit: 10, ttl: 60_000 } })` — the comment at `tracking.controller.ts:11-15` names spec section 31's "tracking enumeration" threat as the reason it exists.
- quotes: `limit: 30` — the comment at `quotes.controller.ts:12-15` notes it "writes a row per call".

**Impact.** The control gets *weaker precisely as the fleet scales up under load* — the inverse of what you want. At 4 API tasks the effective tracking limit is 40/min per IP, not 10. The comments defer to "a production WAF-layer limit (ADR 0001 section 5.3)" as defence in depth, but that layer does not exist in a deployable form either (REL-012), so today the 10/min figure is the only claimed control and it does not hold.

**Recommended fix.** Configure a shared storage adapter (`@nest-lab/throttler-storage-redis` or equivalent) pointed at the already-provisioned Valkey serverless cache, and wire its endpoint into the API task definition. Until that exists, do not describe the per-route limits as anti-enumeration controls in documentation or the traceability ledger. Add a Valkey-unavailable fallback decision (fail-closed for public endpoints is the right default here).

---

## REL-005 — Outbox relay has no attempt cap, no backoff, and no DLQ; a single poison event blocks the queue permanently

- **Severity:** High
- **Confidence:** High
- **File:line:** `apps/worker/src/outbox-relay.ts:43-86` (specifically 45-49 and 75-82)

**Evidence.** `pollOnce()` selects `where: { status: "PENDING" }, orderBy: { createdAt: "asc" }, take: 25`. On publish failure (lines 75-82) the handler logs and does `attempts: { increment: 1 }` — and nothing else. `status` stays `PENDING`, `attempts` is never compared to a maximum, there is no delay before the next attempt, and there is no dead-letter destination. The only path that ever sets `FAILED` is an unroutable `eventType` (lines 53-61).

**Failure path.** An event whose publish keeps throwing — a malformed payload the SQS adapter rejects, an oversized message body, a queue-name typo, a permissions error — remains `PENDING` at the head of the `createdAt asc` ordering forever. Because the batch is a fixed `take: 25` of the *oldest* pending rows, 25 such rows permanently occupy every batch. Every subsequent event ever written to the outbox is behind them and is never published. There is no alarm on outbox depth or oldest-pending age (`infra/cdk/lib/observability-stack.ts` has three alarms, all RDS metrics), so this is silent: quotes, shipments and claims stop producing notifications and nobody is paged. Meanwhile the relay retries the same 25 rows every 2 seconds indefinitely — 43,200 futile publish attempts per row per day.

**Impact.** Complete, silent loss of the asynchronous notification path, with unbounded `PENDING` backlog growth behind it. The `outbox_events_append_only` trigger (`migrations/…_constraints_and_triggers/migration.sql`) blocks `DELETE`, so the backlog cannot be cleared operationally without a superuser bypassing the trigger.

**Recommended fix.** Add `maxAttempts` (e.g. 8): on exceeding it, set `status = "FAILED"` and record the last error, which removes the row from the `PENDING` head. Add exponential backoff with jitter via a `nextAttemptAt` column filtered in the `where` clause. Add a CloudWatch alarm on both `count(status='PENDING')` and `max(now() - created_at) WHERE status='PENDING'`. Distinguish transient failures (retry) from permanent ones (fail immediately) rather than treating every throw as retryable.

---

## REL-006 — Outbox relay claims no rows; overlapping polls duplicate publishes even on a single instance

- **Severity:** High
- **Confidence:** High
- **File:line:** `apps/worker/src/outbox-relay.ts:30-37`, `apps/worker/src/outbox-relay.ts:45-74`

**Evidence.** The read is a plain `findMany` with no `FOR UPDATE SKIP LOCKED` and no claim column; the row is only mutated *after* the publish succeeds (lines 71-74). Between the `findMany` and the `update`, the row is still `PENDING` and visible to any other reader. Two separate mechanisms cause a second reader:

1. **Horizontal scale.** `compute-stack.ts:135-136` states the intended production shape is "scale this on SQS queue depth". Two worker tasks polling on the same 2s cadence will select overlapping batches and both publish.
2. **Overlapping polls within one process.** `start()` uses `setInterval(() => { this.pollOnce().catch(...) }, 2000)` — the interval fires unconditionally; it does not wait for the previous `pollOnce()` to settle. A batch that takes longer than 2s (25 sequential `await` round-trips to Postgres plus 25 publishes, all serial — trivially achievable under RDS load or a slow provider) means two `pollOnce()` calls are in flight in the *same* process, reading the same `PENDING` rows. Duplicate publishes therefore occur at `desiredCount: 1`, not only at scale-out.

**Failure path.** Each duplicated publish emits the same `messageId` (the outbox row id) twice. The consumer-side dedupe (`local-queue-adapter.ts:30-33`) is itself a non-atomic check-then-act (REL-008), so under concurrency both copies can pass it. Result: two emails sent, two `Notification` rows, two `DeliveryAttempt` rows. Throughput is also capped at 25 events per poll processed strictly serially, which is a hard ceiling of roughly 12 events/sec even with zero latency and far less in practice.

**Impact.** Duplicate customer notifications, duplicate financial-adjacent side effects when real payment/carrier events flow through this path, and a relay that cannot be scaled to relieve backlog. The comment at `outbox-relay.ts:5-14` describes this as "what makes shipment created → notification queued reliable"; the claim does not hold at either concurrency level.

**Recommended fix.** Claim rows atomically before publishing: `UPDATE outbox_events SET status='CLAIMED', claimed_at=now(), claimed_by=$worker WHERE id IN (SELECT id FROM outbox_events WHERE status='PENDING' AND next_attempt_at <= now() ORDER BY created_at LIMIT 25 FOR UPDATE SKIP LOCKED) RETURNING *` — one statement, safe under any number of workers. Reclaim rows stuck in `CLAIMED` past a lease timeout (this is what makes worker crashes recoverable). Replace the naked `setInterval` with a self-rescheduling loop (`setTimeout` after the previous run settles) so polls cannot overlap. Publish the batch with bounded concurrency rather than strictly serially.

---

## REL-007 — Retention sweep runs an unbounded, unindexed `updateMany` every 60 seconds and will permanently fail once the backlog exceeds the statement timeout

- **Severity:** High
- **Confidence:** High
- **File:line:** `apps/worker/src/jobs/retention.job.ts:14-27`; `apps/worker/src/main.ts:25-34`; `packages/database/prisma/schema.prisma:442` (`@@index([lifecycleStatus])`), `packages/database/src/index.ts:26-27`

**Evidence.**

```ts
const result = await prisma.shipment.updateMany({
  where: { lifecycleStatus: "DELIVERED", deliveredAt: { lt: cutoff }, legalHold: false },
  data: { lifecycleStatus: "ARCHIVED" },
});
```

Invoked by `setInterval(..., 60_000)`. Available indexes on `shipments` are `lifecycle_status`, `organisation_id`, `owner_user_id`, `current_tracking_code` (single-column each) plus the tracking-number uniques. There is **no index on `delivered_at`** and no composite covering this predicate. `lifecycle_status` alone is extremely low-selectivity by construction: in steady state the overwhelming majority of shipments are `DELIVERED` or `ARCHIVED`, so an index scan on `lifecycle_status = 'DELIVERED'` reads a large fraction of the table and then filters `delivered_at < cutoff` and `legal_hold = false` on the heap.

**Failure path.** Three compounding problems:

1. **No batch limit.** The first successful run must update the entire eligible backlog in one statement — one transaction, one row lock per row, `updated_at @updatedAt` rewriting every row (so every archived row is a heap write plus index maintenance on `lifecycle_status`), and a correspondingly large WAL burst that RDS must ship to the Multi-AZ standby.
2. **`statement_timeout: 15_000` on the shared pool.** The worker uses the same `getPrismaClient()` singleton as everything else, so this statement is capped at 15 seconds. Once the backlog is large enough that the scan-plus-update exceeds 15s, Postgres cancels it, the whole `updateMany` rolls back, zero rows are archived — and the interval fires again 45 seconds later and repeats. The sweep enters a state where it **can never succeed**, burning a full table scan plus a large aborted write every 60 seconds forever, 1,440 times a day. `main.ts:33` catches the rejection and logs it; there is no alarm, so this is silent.
3. **No-op runs are not cheap.** Even in the healthy case where nothing is eligible, every one of the 1,440 daily runs still scans the `DELIVERED` index entries to prove it. That is a constant background load on the primary for zero work.

**Impact.** Either a large, unthrottled write storm on the primary during a period of normal traffic, or (more likely at scale) a retention control that permanently fails while continuously consuming database CPU and I/O. The comment in `main.ts:22-24` acknowledges the in-process `setInterval` is not the production shape; the query itself is not production-shaped either.

**Recommended fix.** Add `CREATE INDEX CONCURRENTLY shipments_retention_idx ON shipments (delivered_at) WHERE lifecycle_status = 'DELIVERED' AND legal_hold = false;` — a partial index sized to exactly the sweep's working set. Batch the update (`... WHERE id IN (SELECT id ... LIMIT 500)` in a loop with a bounded total per run) so no single statement can exceed the timeout. Move it to a daily EventBridge-scheduled task as the code comment already intends, on a connection with its own longer `statement_timeout` rather than the request-path pool's. Emit a metric for rows archived per run and alarm on consecutive failures.

**Related correctness note (not a separate finding):** the sweep sets `lifecycleStatus = "ARCHIVED"`, but `tracking.service.ts` does not exclude `ARCHIVED` shipments — `deriveStatusCategory` (line 92) explicitly treats `ARCHIVED` the same as `DELIVERED` and returns the full event history publicly. The 180-day public-tracking retention rule the job exists to enforce is therefore not actually enforced against the public endpoint.

---

## REL-008 — Consumer idempotency is a non-atomic check-then-act; the handler assumes exactly-once delivery

- **Severity:** High
- **Confidence:** High
- **File:line:** `apps/worker/src/queue/local-queue-adapter.ts:27-47`; `apps/worker/src/jobs/notifications-email.job.ts:20-45`

**Evidence.** The dedupe is three separate, unsynchronised statements:

```ts
const already = await prisma.inboxEvent.findUnique({ where: { source_messageId: {...} } });
if (already) return;
try { await handler(message); await prisma.inboxEvent.create({ ... }); } catch { console.error(...) }
```

The `InboxEvent` row is written *after* the handler's side effects, in a separate transaction, and the read that gates it is a plain lookup with no lock. The handler then performs two unrelated writes — `prisma.notification.create` (line 30) and `prisma.deliveryAttempt.create` (line 38) — with no enclosing `$transaction`, and neither table has a unique key that would reject a duplicate (`Notification` has only `@@index([userId])`; `DeliveryAttempt` has no unique constraint at all).

**Why this does not transfer to SQS.** The brief asks specifically whether the consumer assumes guarantees the local adapter doesn't provide. It does, in three ways that are invisible in local dev because the local adapter is single-process, single-threaded, and never redelivers:

- **At-least-once redelivery.** SQS redelivers when the visibility timeout expires. If the process is killed after `handler()` succeeds but before `inboxEvent.create` — an ordinary ECS task stop, which the worker's SIGTERM handler does *not* protect against because `shutdown()` at `main.ts:39-44` does not wait for in-flight handlers — the message is redelivered, the inbox check finds nothing, and the handler runs again: a second email and a second `Notification` + `DeliveryAttempt` pair. Locally this window is invisible because there is no redelivery mechanism at all.
- **Concurrent delivery.** SQS standard queues can deliver the same message to two consumers, and any of the duplicate-publish paths in REL-006 produces two copies of the same `messageId`. Both readers execute `findUnique` before either executes `create`; both see "not processed"; both run the handler. The unique constraint on `(source, message_id)` catches only the *second* `create`, by which time both side effects have already happened — and the resulting `P2002` is swallowed by the `catch` at line 39, so it does not even surface.
- **Out-of-order delivery.** The handler is stateless per message so ordering is not currently a correctness issue, but nothing in the design records it as an assumption, and it will become one as soon as status-transition events flow through the same path.

The `idempotencyKey: message.messageId` passed to the messaging adapter (line 24) would let a real SES/Twilio adapter suppress the duplicate *send* — but the mock ignores it (`local-mock-messaging-adapter.ts` returns a fresh `randomUUID()` each call), and it does nothing about the duplicate database rows.

**Failure path.** Customer receives the same email twice; the notification centre (`notifications.module.ts:21-27`) shows two identical entries; `DeliveryAttempt` rows both claim `attemptNumber: 1`, so any future bounce-rate or delivery-success metric computed from this table is wrong. If the handler is killed between its two writes, an orphan `Notification` exists with no `DeliveryAttempt` — a notification that was sent but has no delivery record.

**Impact.** The `InboxEvent` table and the "consumers are idempotent" claim in the spec traceability are not actually delivering idempotency. This is the class of defect that passes every local test and only appears in production, which is exactly why it deserves a fix before SQS is wired rather than after.

**Recommended fix.** Invert to claim-first and make it atomic: inside one `prisma.$transaction`, `INSERT INTO inbox_events (source, message_id) ...` first — a unique-violation means another consumer already owns the message, so return without side effects — then perform the handler's writes in the same transaction, and only acknowledge/delete the SQS message after the transaction commits. That makes the whole unit exactly-once *with respect to the database*, and at-least-once with respect to the external provider (which is the strongest guarantee available, and is why the provider-side `idempotencyKey` must be honoured by the real adapter). Wrap `notification.create` + `deliveryAttempt.create` in that same transaction. Document at the `QueueAdapter` interface (`queue-adapter.ts:35-38`) that handlers must be safe under at-least-once and out-of-order delivery, so the contract is explicit rather than accidental.

---

## REL-009 — `delivery_attempts` has no index on its foreign key; the notification centre sequentially scans it on every page load

- **Severity:** High
- **Confidence:** High
- **File:line:** `apps/api/src/modules/notifications/notifications.module.ts:19-28`; `packages/database/prisma/schema.prisma:1078-1088`; `migrations/20260807023945_init/migration.sql` (no `delivery_attempts` index is created)

**Evidence.** The read path is:

```ts
prisma.notification.findMany({ where: { userId }, include: { deliveryAttempts: true }, orderBy: { id: "desc" }, ...page })
```

Prisma resolves `include` on a to-many relation with a second query: `SELECT * FROM delivery_attempts WHERE notification_id IN ($1..$26)`. The `DeliveryAttempt` model declares no `@@index`, and the init migration creates no index on `delivery_attempts` at all — PostgreSQL does not create indexes for foreign keys automatically, and Prisma does not add them for PostgreSQL either. There is no index to serve that `IN` predicate.

**Failure path.** Every page of every user's notification list triggers a full sequential scan of `delivery_attempts`. That table is one of the fastest-growing in the schema: one row per send attempt, multiplied by retries, across every channel (EMAIL/SMS/WHATSAPP/IN_APP) for every customer-facing status transition on every shipment. At tens of thousands of shipments a month with multiple notifications each and retries on top, it reaches millions of rows well within year one, while `notifications` itself stays comparatively small. A cursor-paginated endpoint that reads 25 parent rows ends up scanning millions of child rows to do it.

**Impact.** Authenticated portal latency degrades continuously; the query holds a pool connection (max 10 per task) for the duration, so this competes directly with every other endpoint including the already-scanning tracking lookup (REL-003). This is the clearest missing-index defect in the schema because the query pattern exists in shipped code today.

**Recommended fix.** `@@index([notificationId])` on `DeliveryAttempt` (ideally `@@index([notificationId, attemptedAt])` since attempts are read in order). Then audit the remaining child tables the same way — `invoice_lines`, `quote_lines`, `payment_allocations`, `claim_evidence`, `claim_decisions` similarly have no FK index; they are not on a hot read path *yet*, but they will be as those modules gain read endpoints.

---

## REL-010 — `IdempotencyRecord` grows without bound, and a crashed or failed completion leaves the key permanently 409-ing

- **Severity:** Medium
- **Confidence:** High
- **File:line:** `apps/api/src/common/interceptors/idempotency.interceptor.ts:56-108`; `packages/database/prisma/schema.prisma:1203-1218`

**Evidence.** Two related problems.

*Growth.* The model has `@@index([expiresAt])` and a `RECORD_TTL_HOURS = 24` constant used to populate `expiresAt` — but grep across `apps/worker/src` confirms **no job reads that index or deletes expired rows**, and nothing in the interceptor checks `expiresAt` on the replay path either (line 86 returns `existing.responseBodyJson` regardless of whether the record has expired, so the "24 hour TTL" is currently unenforced in both directions). The table stores a full serialized response body per record (`responseBodyJson JSONB`, line 95) and accumulates forever. The index exists purely as an unused artefact of an intended cleanup job.

*Stuck claims.* The record is claimed with `status: IN_PROGRESS` before the handler runs (lines 58-67). Completion and release are both **fire-and-forget** inside `tap` — `prisma.idempotencyRecord.update(...).catch(e => this.logger.error(...))` (lines 92-97) and `.delete(...).catch(...)` (lines 102-105). Neither is awaited, and the response is returned to the client without waiting for either.

**Failure path.** If the process dies between the claim and the completion write — which happens on every ECS task stop, because the API has no graceful shutdown (REL-002) — or if the completion `update` itself fails (pool exhausted, statement timeout), the record stays `IN_PROGRESS` forever. Every subsequent retry with that same Idempotency-Key hits line 81-84 and gets a permanent `409 A request with this Idempotency-Key is already being processed.` There is no expiry sweep and no lease timeout, so nothing ever clears it. A client that correctly retries a booking or payment request with a stable key is locked out of that operation permanently and can only recover by generating a new key — which defeats the point of the header. There is also a narrower race: because the completion write is not awaited, a fast client retry can arrive, read the still-`IN_PROGRESS` record, and get a 409 for a request that actually succeeded.

**Impact.** Unbounded storage growth on a table holding full API response payloads, plus a user-visible failure mode on exactly the create/financial/booking operations the interceptor exists to protect.

**Recommended fix.** Add a retention job that deletes `WHERE expires_at < now()` in bounded batches (this finally uses the existing index), scheduled daily. Treat `IN_PROGRESS` records older than a short lease (say 60s) as reclaimable rather than as a permanent conflict. Await the completion write before returning the response, or move it into the same transaction as the handler's business writes. Also populate `responseStatus` — it is declared on the model but never written, so the replay path always returns the default status code regardless of what the original response was.

---

## REL-011 — Structured logging is not actually wired; two disconnected logging systems, no metrics, no traces, no application-level alarms

- **Severity:** Medium
- **Confidence:** High
- **File:line:** `packages/observability/src/index.ts:16-24`; `apps/api/src/common/filters/http-exception.filter.ts:20,36-42`; `apps/api/src/common/interceptors/correlation-id.interceptor.ts:4,21-25`; `infra/cdk/lib/observability-stack.ts:31-71`

**Evidence — confirming the parent agent's reading, which is correct.**

- `createLogger()` — the Pino factory with `base` fields and a `redact` list — is **never called anywhere**. Grep across `apps/api/src`, `apps/worker/src` and `packages/*/src` finds exactly one import of `@nauterio/observability`, at `correlation-id.interceptor.ts:4`, and it imports only `newCorrelationId`. The Pino logger is dead code.
- `AllExceptionsFilter` uses NestJS's built-in `Logger` (`http-exception.filter.ts:20`) and logs 5xx as an interpolated string: `` `Unhandled exception [correlationId=${correlationId}]: ${stack}` ``. NestJS's default logger writes coloured, human-formatted plain text to stdout. In CloudWatch that arrives as an unparsed string: there is no `correlationId` *field* to filter on, no `level` field, no service field, and a multi-line stack trace becomes multiple unrelated log events. `IdempotencyInterceptor` (line 35) uses the same built-in logger. The worker uses bare `console.log`/`console.error` throughout (`main.ts:30,33,37,50`, `outbox-relay.ts:34,77`, `local-queue-adapter.ts:40`, and the mock adapters).
- **So the two systems never meet:** the redaction rules in `packages/observability` (`req.headers.authorization`, `*.password`, `*.token`, `*.secret`) protect nothing, because no log line goes through Pino.
- The correlation ID reaches the response header and the exception filter's message string, but nothing else: it is not attached to a request-scoped logger, not propagated into Prisma queries, and although `OutboxEvent.correlationId` is carried into `QueueMessage.correlationId` (`outbox-relay.ts:68`), the worker never logs it. An incident cannot be traced from an API request through to its asynchronous side effect.
- **No OpenTelemetry.** Confirmed: grep for `opentelemetry|otel` across `apps/*/src`, `packages/*/src` and `infra/cdk/lib` returns zero hits; the only match in the entire repository is a transitive entry in `pnpm-lock.yaml`. No tracing, no spans, no RED metrics, no custom CloudWatch metrics emitted by either process.
- **Alarms.** `ObservabilityStack` creates exactly three alarms, all RDS metrics (CPU, free storage, freeable memory), plus a two-widget dashboard. The SNS topic has no subscriptions (acknowledged at lines 28-29).

**Assessment of what is and is not a fair finding here.** The stack's own comment (lines 14-19) correctly reasons that queue-oldest-message-age, SES bounce-rate, payment-webhook-failure and certificate-expiry alarms cannot be created because SQS queues, SES identities and a domain do not exist — that judgement is sound and those are **NOT APPLICABLE**, not failures. But two applicable gaps remain: the ALB **is** created in `ComputeStack`, so `HTTPCode_ELB_5XX_Count`, `TargetResponseTime` and `UnHealthyHostCount` alarms are constructible today and are absent; and the outbox backlog (REL-005) is a plain SQL metric on a table that exists today, needing no AWS resource at all.

**Failure path.** During an incident, the on-call operator has: unparseable plain-text stdout, no request-rate/error-rate/latency metrics, no traces, and alarms only for RDS resource exhaustion. The failures described in REL-001, REL-005, REL-007 and REL-008 are all *silent* under this configuration — the outbox stopping entirely, the retention sweep failing 1,440 times a day, duplicate notifications going out. Every one would be discovered by a customer, not by the platform.

**Recommended fix.** Replace the built-in Nest logger with `nestjs-pino` (or `app.useLogger(...)` fed by `createLogger`) so every line is JSON with `correlationId`, `service`, `environment` and `level` as fields, and route the worker's `console.*` calls through the same logger. Use `AsyncLocalStorage` to make the correlation ID ambient so it lands on every line without manual threading, and propagate it into the worker via the queue message it already carries. Add ALB 5xx / p99 latency / unhealthy-host alarms now, and an outbox-depth alarm sourced from a SQL metric. Add OpenTelemetry auto-instrumentation for HTTP and `pg` when tracing is genuinely needed — but the structured-logging gap is the one that matters first, because it is cheap and currently at zero.

---

## REL-012 — WAF WebACL is never associated with anything, uses the wrong scope for the region it deploys to, and the ALB is internet-facing on plain HTTP

- **Severity:** Medium
- **Confidence:** High
- **File:line:** `infra/cdk/lib/edge-stack.ts:23-57`; `infra/cdk/bin/app.ts:34`; `infra/cdk/lib/compute-stack.ts:49-62`

**Evidence.** `EdgeStack` creates a `CfnWebACL` with `scope: "CLOUDFRONT"` including a `RateLimitPerIp` rule at 2000 req/IP. Three problems:

1. **No association.** There is no `CfnWebACLAssociation` anywhere in `infra/cdk`, and the file's own comment (lines 8-15) explains that no CloudFront distribution is created because no domain exists. So the WebACL is an orphan resource protecting nothing.
2. **Wrong scope for the target.** A `CLOUDFRONT`-scoped WebACL cannot be associated with an ALB — that requires `scope: "REGIONAL"`. Even if an association were added, this object could not be attached to the load balancer that actually serves traffic.
3. **Wrong region.** `CLOUDFRONT`-scoped WebACLs must be created in `us-east-1`. `bin/app.ts:34` deploys `EdgeStack` with the same `env` as everything else, resolving to `eu-south-1` (line 24). `cdk deploy` of this stack would fail.

Meanwhile `ComputeStack` creates an `internetFacing: true` ALB with a single **HTTP:80** listener and no HTTPS listener, no ACM certificate, and no HTTP→HTTPS redirect (acknowledged in the class comment at lines 29-31).

**Impact.** Two other findings lean on this layer as mitigation and cannot: `app.module.ts:34-36` describes the WAF as "the production WAF layer this complements rather than replaces", and `tracking.controller.ts:14-15` calls it "defense in depth on top of this". Neither is deployable as written, so the per-task in-memory throttler (REL-004) is the *only* rate-limiting control, and it does not hold at fleet scale. Separately, an internet-facing HTTP-only ALB terminates bearer tokens in cleartext.

**Recommended fix.** Split the WebACLs: a `REGIONAL` ACL created in the application region and explicitly associated with the ALB via `CfnWebACLAssociation`, plus (later, when a domain exists) a `CLOUDFRONT` ACL in a `us-east-1`-pinned stack. Add the HTTPS listener, certificate and redirect as a hard prerequisite before any real traffic. Note in the traceability ledger that the rate-limit claims in the API comments are currently unbacked.

---

## REL-013 — No log retention configured anywhere; CloudWatch Logs cost grows monotonically forever

- **Severity:** Medium
- **Confidence:** High
- **File:line:** `infra/cdk/lib/compute-stack.ts:97`, `infra/cdk/lib/compute-stack.ts:131`; `infra/cdk/lib/data-stack.ts:83`

**Evidence.** All four services use `ecs.LogDrivers.awsLogs({ streamPrefix: id })` with no `logRetention` property. CDK's default for an auto-created log group is **never expire**. `DataStack` sets `cloudwatchLogsExports: ["postgresql"]` (line 83) with no retention on the resulting `/aws/rds/instance/.../postgresql` group either. Grep for `logRetention|retention` across `infra/cdk/lib` returns only the RDS `backupRetention` line and comment text.

**Failure path.** Four services logging continuously, plus RDS PostgreSQL logs, accumulate indefinitely at CloudWatch's storage rate. This is not dramatic per-day, but it is monotonic and never self-corrects, and it interacts badly with the noisy paths in this codebase: REL-005's relay retries a poison batch every 2 seconds and `console.error`s each failure (43,200 log lines/day/event), and REL-007's retention sweep logs a failure every 60 seconds. A single unresolved incident becomes a permanent, growing line item.

**Impact.** Cost amplification with no ceiling and no anomaly alarm (there is no AWS Budgets or Cost Anomaly Detection construct in the CDK app). Also a compliance exposure: logs containing operational detail are retained forever with no defined retention period, which conflicts with the project's own retention-schedule discipline.

**Recommended fix.** Set explicit `logRetention` on every log driver (30 days for application logs, longer only where a compliance requirement is documented). Set retention on the RDS log group via a `logs.LogRetention` construct. Add an AWS Budgets alarm to the observability stack — it depends on no application resource and can be added today.

---

## REL-014 — Compute stack has no container environment wiring, no autoscaling, `desiredCount: 1`, and provisions an RDS Proxy nothing points at

- **Severity:** Medium
- **Confidence:** High
- **File:line:** `infra/cdk/lib/compute-stack.ts:71-74`, `94-101`, `103-110`, `137-143`; `infra/cdk/lib/data-stack.ts:87-94`; `packages/database/src/index.ts:21-28`

**Evidence.**

- **No env/secrets.** `addContainer` sets neither `environment` nor `secrets`. `DATABASE_URL`, `DATABASE_POOL_MAX`, `NODE_ENV`, `PORT` and the Cognito values are all absent, so `loadApiConfig()` (`packages/configuration/src/index.ts:22-29`) throws at boot. The comment at lines 98-100 asserts these are "injected via Secrets Manager/SSM references at deploy time" — nothing in the repository does that injection.
- **No autoscaling.** Grep for `autoScale` across `infra/cdk/lib` returns nothing. All three HTTP services and the worker are fixed at `desiredCount: 1`. There is no `scaleOnCpuUtilization`, no request-count scaling, and the worker's SQS-depth step-scaling is only a comment (lines 135-136).
- **No health check grace period.** `FargateService` is created without `healthCheckGracePeriod`, so ELB health checking begins immediately on task start — NestJS boot plus Prisma client init plus the first pool connection is not instantaneous.
- **RDS Proxy is orphaned.** `DataStack` creates `NauterioDatabaseProxy` (lines 87-94) but exports nothing — `this.database` is exported, the proxy is not — and no `CfnOutput`, SSM parameter, or task environment references its endpoint. Since `DATABASE_URL` is never set at all, nothing can be pointing at the proxy.

**Why the pool-sizing question resolves to "not yet a problem, but the reasoning is untested."** `DATABASE_POOL_MAX ?? 10` per process against a single `t4g.medium` (2 vCPU, 4 GiB) gives roughly 450 available `max_connections`. At the deployed shape (1 API task + 1 worker) that is 20 connections — trivially fine. The pool default is not the risk. The risk is that the *justification* for it — `packages/database/src/index.ts:11-14`: "In production this pool sits behind RDS Proxy… so that N horizontally-scaled ECS Fargate tasks do not each hold their own large connection pool" — describes an architecture that is not wired, and the connection budget has never been validated against any real task count because no autoscaling policy defines one. A `t4g.medium` also has ~2 GiB of usable shared buffers for a workload that currently performs sequential scans on its hottest endpoint (REL-003).

**One item to verify before relying on the proxy** (NOT VERIFIED, cannot be settled statically): RDS Proxy for PostgreSQL pins a session — disabling the multiplexing that is the entire reason for the proxy — when it observes certain statements, including named prepared statements. Whether Prisma 7's `@prisma/adapter-pg` issues named or unnamed prepared statements determines whether the proxy actually multiplexes here. Measure `DatabaseConnectionsBorrowLatency` and the proxy's pinning CloudWatch metric under load before treating the proxy as a scaling solution.

**Failure path.** As written the stack cannot start the API (REL-001 plus missing env). Once fixed, a fixed count of 1 means any task-level failure is a total outage for that service, and there is no capacity response to a traffic spike — the first spike saturates the 10-connection pool and returns 500s rather than scaling out.

**Recommended fix.** Wire `ecs.Secret.fromSecretsManager` for `DATABASE_URL` pointing at the **proxy** endpoint (export it from `DataStack`). Add `scaleOnCpuUtilization` / `scaleOnRequestCount` with sane min/max, and a `healthCheckGracePeriod`. Raise `desiredCount` to ≥2 for the API before real traffic, per the spec's own "≥2 for critical services" requirement. Re-derive `DATABASE_POOL_MAX` from `max_tasks × pool_max ≤ proxy MaxConnectionsPercent × instance max_connections`, and set it explicitly rather than relying on the code default.

---

## REL-015 — Anonymous quote endpoint writes 5 rows per unauthenticated request with no expiry job

- **Severity:** Medium
- **Confidence:** High
- **File:line:** `apps/api/src/modules/quotes/quotes.controller.ts:16-20`; `apps/api/src/modules/quotes/quotes.service.ts:69-91`

**Evidence.** `POST /v1/quotes` is public (no `AuthGuard`, correctly so per the spec's anonymous-quote requirement) and every call performs `prisma.quote.create` with a nested `lines: { create: [...] }` of one to four `QuoteLine` rows — up to 5 inserts per anonymous request, including a full `inputSnapshotJson` copy of the request body. The controller's own comment (lines 12-15) notes it "writes a row per call". The record sets `expiresAt: now + 7 days` (line 81), but grep confirms **nothing ever reads `Quote.expiresAt`** — there is no expiry sweep, no status transition to EXPIRED, and no cleanup job in `apps/worker/src`. `Quote` has indexes on `userId` and `organisationId`, both of which are `NULL` for anonymous quotes.

**Failure path.** The only control is `@Throttle({ limit: 30, ttl: 60_000 })`, which is per-IP *and per-task* (REL-004), so the real ceiling is `30 × N_tasks` per IP per minute and there is no cap across IPs at all. A crawler or a competitor's price-scraper — an entirely ordinary thing to encounter on a public freight-quote form — turns into sustained write traffic against the primary database and permanent storage growth on a table whose rows have a declared 7-day useful life and an infinite actual one.

**Impact.** Write amplification on the primary (competing for the same 10-connection pool as REL-003 and REL-009), unbounded growth of a table that is mostly abandoned anonymous drafts, and a distorted denominator for the conversion metric the persistence exists to enable (lines 66-68).

**Recommended fix.** Add a retention job that deletes or archives `DRAFT` quotes past `expiresAt` with no linked booking, in bounded batches, with a supporting `@@index([status, expiresAt])`. Consider computing the quote without persisting when the caller is anonymous, and persisting only on an explicit "save/accept" action — the conversion metric can be derived from request telemetry rather than from a durable row per keystroke-driven recalculation. Add a WAF rate-based rule once REL-012 is fixed.

---

## REL-016 — List endpoints filter on one column and sort on another with no composite index

- **Severity:** Medium
- **Confidence:** Medium
- **File:line:** `apps/api/src/modules/shipments/shipments.service.ts:34-49`; `apps/api/src/modules/notifications/notifications.module.ts:19-28`; `packages/database/prisma/schema.prisma:443-444`, `1074`

**Evidence.** Both paginated list endpoints follow the same shape: `where: { organisationId }` (or `{ ownerUserId }`, or `{ userId }`) with `orderBy: { id: "desc" }` and a cursor on `id`. The available indexes are single-column on the filter (`shipments_organisation_id_idx`, `shipments_owner_user_id_idx`, `notifications_user_id_idx`); none includes `id`.

**Failure path.** Postgres can use the single-column index to find matching rows, but it cannot walk them in `id desc` order — it must fetch the full matching set and sort. Cursor pagination does not rescue this: the cursor becomes an additional filter, not an index seek, so page N costs the same as page 1. For a business customer with tens of thousands of shipments — plausible for the org-account segment this platform targets — every page load of the portal shipment list re-reads and re-sorts that customer's entire history. The staff path (`where: {}`, line 36) is fine on the PK index, but offers no status or date filtering at all, so the admin UI can only paginate the whole table linearly.

**Impact.** Latency proportional to a customer's total shipment count on the primary portal screen, growing over the account's lifetime. This is a real but bounded cost at the stated scale — it is Medium rather than High because the per-customer working set is much smaller than the whole-table scans in REL-003 and REL-009.

**Recommended fix.** `@@index([organisationId, id])` and `@@index([ownerUserId, id])` on `Shipment`; `@@index([userId, id])` on `Notification`. Because primary keys are UUIDv7 (time-ordered), these composites serve both the filter and the ordering in a single index scan. Add status/date filter parameters to the staff list before the shipment table reaches six figures.

---

## REL-017 — Nested `trackingEvents` reads are unbounded, and internal events are loaded then discarded in application code

- **Severity:** Medium
- **Confidence:** High
- **File:line:** `apps/api/src/modules/tracking/tracking.service.ts:47,59`; `apps/api/src/modules/shipments/shipments.service.ts:56`

**Evidence.** Both reads use `trackingEvents: { orderBy: { eventTime: "desc" } }` with **no `take`**. In `tracking.service.ts` the result is then filtered in JavaScript: `shipment.trackingEvents.filter(e => e.visibility !== "INTERNAL")` (line 59) — so every internal-only event is transferred from Postgres to the API process and discarded, and `shipments.service.ts:56` returns the entire unfiltered set including `INTERNAL` events and `internalDescription` text to any caller holding `shipment:read`.

**Failure path.** Event count per shipment is driven by carrier webhooks, warehouse scans, customs milestones and correction rows (the `correctionOf` self-relation means corrections *add* rows rather than replacing them, by design). A long-running ocean-freight shipment with an exception history can accumulate a large event list; there is no cap on how large. Every public tracking request materialises all of it, serialises it to JSON, and returns it. The `@@index([shipmentId, eventTime])` composite correctly serves the ordering, so this is a payload/memory issue rather than an index one.

**Impact.** Unbounded response size and memory per request on the public endpoint; the `visibility` filter being applied in application code rather than in the `where` clause means the database work scales with total events rather than public events. The `shipments.service.ts` path additionally leaks `INTERNAL` events and `internalDescription` to every reader — worth flagging to the security review even though the reliability impact is the payload size.

**Recommended fix.** Push the filter into the query (`where: { visibility: { not: "INTERNAL" } }`) and add `take` with a documented cap (e.g. 100 most recent, with a separate paginated history endpoint if more is needed). Apply the same `take` to `shipments.service.ts:56`, and scope `visibility` there by caller role.

---

## REL-018 — Tracking number generator has ~24 bits of entropy; collisions become near-certain within the first few thousand shipments

- **Severity:** Medium
- **Confidence:** High
- **File:line:** `apps/api/src/modules/shipments/shipments.service.ts:64-68`; `packages/database/prisma/schema.prisma:374`

**Evidence.**

```ts
const digits = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
return `NT-${digits}-US`;
```

Six hex characters = 24 bits = 16,777,216 distinct values. `Shipment.trackingNumber` is `@unique`, and the constraints migration adds a second unique index on `UPPER(tracking_number)`.

**Failure path.** By the birthday bound, the probability of at least one collision reaches ~50% at roughly 4,800 generated numbers and is effectively certain by ~20,000. At the stated scale of thousands to tens of thousands of shipments per month, the first collision occurs within weeks of launch and they become routine within months. A collision raises `P2002` on insert; there is no retry loop and no collision handling anywhere — shipment creation simply fails, and the failure rate grows with the table.

The comment at `tracking.service.ts:32-36` and `tracking.controller.ts:12-14` both assert tracking numbers are "opaque… but guessable by brute force" and rely on rate limiting for enumeration defence. With a 16.7M keyspace and a rate limit that does not hold across tasks (REL-004), the entire namespace is enumerable at modest cost.

**Mitigating context.** `generateTrackingNumber()` is currently **unreferenced** — grep finds only its definition; no create endpoint exists yet. That is why this is Medium rather than High. But it is the designated generator and will be wired up by the next feature slice, so fixing it now is far cheaper than migrating issued tracking numbers later (they appear on labels, customs paperwork and customer emails, and the tracking history is append-only).

**Recommended fix.** Use at least 64 bits of the random source (e.g. base32-encode 10+ random bytes, Crockford alphabet to avoid confusable characters), keep the `NT-…-US` shape, and add a check-digit so typos are rejected client-side rather than becoming enumeration probes. Regardless of entropy, wrap the insert in a bounded retry on `P2002` — uniqueness should be guaranteed by the database, not by probability alone.

---

## REL-019 — Neither `apps/api` nor `apps/worker` has an ESLint config; the CI lint gate cannot have passed

- **Severity:** Medium
- **Confidence:** High
- **File:line:** `apps/api/package.json:10`, `apps/worker/package.json:10`; `.github/workflows/ci.yml` (`lint-and-typecheck` job); absent `apps/api/eslint.config.*`, `apps/worker/eslint.config.*`

**Evidence.** `find` for `eslint.config.*` / `.eslintrc*` across the repository returns exactly two files: `apps/web/eslint.config.mjs` and `apps/admin/eslint.config.mjs`. Both backend apps declare a `lint` script (`eslint "{src,test}/**/*.ts"` and `eslint "src/**/*.ts"`), and neither declares `eslint` as a devDependency. ESLint 9 exits non-zero with "couldn't find an eslint.config file" — matching the baseline observation. CI runs `pnpm -r lint` in the `lint-and-typecheck` job, so that job fails; the backend has never been linted.

**Why this is a reliability finding, not a style one.** The specific rules that are missing are the ones that catch this exact class of defect. `@typescript-eslint/no-floating-promises` would have flagged the fire-and-forget `.catch()` writes in `IdempotencyInterceptor` (REL-010) and the unawaited `pollOnce()` inside `setInterval` (REL-006). `no-misused-promises` would have flagged the `async` callback passed to `emitter.on()` in `LocalQueueAdapter` (whose rejections cannot be observed by the emitter). `require-await` and `no-return-await` would have caught several others. Additionally, the codebase contains numerous `// eslint-disable-next-line no-console` comments (`main.ts:51`, `outbox-relay.ts:33`, `local-queue-adapter.ts:39`, and more) suppressing a rule that was never enforced — which is also why REL-011's `console.*` sprawl went unnoticed.

**Recommended fix.** Add a shared `eslint.config.mjs` at the repo root extending `typescript-eslint`'s `recommendedTypeChecked` with `no-floating-promises` and `no-misused-promises` as errors, referenced by both backend apps. Fix the resulting findings before adding new features — several will overlap with the reliability findings above. Confirm the CI job goes green rather than being tolerated as a known-red check.

---

## REL-020 — Nothing writes to `OutboxEvent`; the entire async pipeline has never carried a message

- **Severity:** Low
- **Confidence:** High
- **File:line:** `apps/worker/src/outbox-relay.ts:45-49`; absent producer in `apps/api/src`

**Evidence.** Grep for `outboxEvent` across `apps/api/src` and `packages/*/src` returns **zero** hits. No service writes an outbox row in any transaction. `ShipmentsService`'s own comment (`shipments.service.ts:11-14`) states the `ShipmentCreated` outbox event is "follow-up work". The relay's routing table (`outbox-relay.ts:16-20`) maps three event types that no code emits.

**Impact.** Two things follow. Operationally, the relay issues an indexed query against an always-empty table every 2 seconds — 43,200 pointless round-trips per worker per day, with no idle backoff. That is minor. More importantly for this audit: **the outbox → relay → queue → consumer → inbox chain has never executed end to end**, so none of the guarantees it is credited with in the traceability ledger are demonstrated. Findings REL-005, REL-006 and REL-008 are all read from the code rather than observed, and the reciprocal is also true — there may be further defects in that path that only appear once a real producer exists.

**Recommended fix.** Before wiring SQS, land one real producer (shipment creation writing its outbox row inside the same `$transaction` as the `Shipment` insert, following the pattern `ClaimsReturnsService.submit` already uses correctly at `claims-returns.module.ts:34-56`) and one integration test that asserts the full chain, including duplicate-delivery and mid-handler-crash cases. Add idle backoff to the relay poll (grow the interval when a poll returns zero rows, reset on work).

---

## REL-021 — Supply-chain: `@nestjs/swagger` is a runtime dependency loaded unconditionally in production

- **Severity:** Low
- **Confidence:** Medium
- **File:line:** `apps/api/src/main.ts:5,39-48`; `apps/api/package.json` (dependencies)

**Evidence.** The baseline `pnpm audit --audit-level=high` reported 12 vulnerabilities: 1 critical in `vitest` (via `vite`) and the remainder in `@nestjs/swagger`'s `lodash`/`js-yaml` and `vitest`'s `vite`. Assessing runtime reachability in the shipped container:

- **`vitest` / `vite` — not reachable.** `vitest` appears only in `packages/validation/package.json` as a devDependency. Both backend apps start from compiled `dist` output (`start:prod`: `node dist/main.js`), so no test tooling is loaded in the running process. The critical finding is build/CI-surface only.
- **`@nestjs/swagger` — loaded, but not on an attacker-reachable path.** It is a production `dependency`, and `main.ts:5` imports `DocumentBuilder`/`SwaggerModule` at module top level, *unconditionally*. The `NODE_ENV !== "production"` guard at line 39 gates only `SwaggerModule.setup()`, not the import — so `@nestjs/swagger` and its transitive `lodash`/`js-yaml` are resolved and evaluated in every production process. The route is not served in production, so the vulnerable code paths are not reached by request input; the exposure is the presence of the code, not an exploitable path.

**Recommended fix.** Move the Swagger import behind the environment guard with a dynamic `await import("@nestjs/swagger")` so it is not loaded in production at all, or generate the OpenAPI document at build time and serve it statically. Add `pnpm audit` (or Dependabot/Renovate with a security policy) to the CI pipeline so this is enforced rather than periodically discovered — the CI workflow's own header comment claims a "dependency/license and secret scan" that the workflow does not currently implement.

---

## Summary

The backend's *design* documents are consistently better than its wiring. The transactional-outbox pattern, the inbox idempotency table, cursor pagination, the money-as-BigInt discipline, the append-only triggers, the check constraints, the audit-in-the-same-transaction rule, and the case-insensitive functional index on tracking numbers are all correct choices, several of them better than what a typical codebase at this stage has. The failures are almost entirely at the seams: where a correct design meets the code that is supposed to use it, or meets the infrastructure that is supposed to run it.

Three patterns account for most of the findings. **First, controls exist but are not connected.** A functional index on `UPPER(tracking_number)` exists and the query uses `ILIKE`, so the hottest public endpoint sequentially scans the largest table. An `expiresAt` index exists on `IdempotencyRecord` and nothing reads it. A Pino logger with redaction rules exists and is never called. An RDS Proxy is provisioned and nothing points at it. A WAF is created and associated with nothing. In each case the artefact's presence has been mistaken for the control being in force, including in the code comments and, presumably, in the traceability ledger — which is the more serious problem, because it means the gap is invisible to anyone reading the documentation rather than the wiring.

**Second, the concurrency assumptions are single-process assumptions.** The throttler counts in local memory, the outbox relay claims no rows, the consumer dedupes with a check-then-act, and the retention job runs on an in-process interval. Every one of these is correct at `desiredCount: 1` on a developer's laptop and wrong on the ECS fleet the CDK describes — and two of them (the overlapping `setInterval` polls, the non-atomic inbox check) are wrong even at one instance. The move to real SQS is emphatically not a drop-in adapter swap: `LocalQueueAdapter` does not merely lack a DLQ and backoff, it lacks redelivery entirely, which is precisely what hides the consumer's exactly-once assumption. The fix is a claim-first, single-transaction consumer, and it should land before SQS, not after.

**Third, nothing is bounded.** The retention sweep updates an unbounded set under a 15-second statement timeout, so it will eventually fail permanently and silently. The outbox retries forever with no attempt cap, so one poison event stops all asynchronous work forever and silently. Nested `trackingEvents` reads have no `take`. `IdempotencyRecord`, `Quote`, `OutboxEvent` and CloudWatch Logs all grow without any cleanup path. And because there are exactly three alarms — all RDS resource metrics — and no structured logs, no metrics and no traces, every one of these failures reaches a customer before it reaches an operator.

If only three things are fixed before anything else ships: correct the ALB health check and add real health endpoints (REL-001), add graceful shutdown to the API (REL-002), and fix the tracking query to use the index that already exists (REL-003). Those are all small, and they are the difference between a service that cannot start and one that can.

---

## Coverage

| Area | Verdict | Basis |
|---|---|---|
| **Dependency timeout / retry / backoff** | **PARTIAL** | Postgres — the only real synchronous dependency — is correctly bounded: `connectionTimeoutMillis: 5s`, `statement_timeout`/`query_timeout: 15s`, explicitly set because Prisma 7's driver adapter has no defaults (`packages/database/src/index.ts:21-28`). That is genuinely well done. But there is no retry, backoff or circuit-breaking anywhere: the outbox relay retries unboundedly with no delay and no cap (REL-005), and the consumer has no retry at all (REL-008). No real external provider is wired — carrier, messaging and payment are local mocks with no network calls — so provider-facing timeout/circuit-breaker behaviour is **NOT VERIFIED** and cannot be, and the mock adapters set no precedent (they take no timeout parameter and the `MessagingAdapter`/`CarrierAdapter` interfaces do not require one, which should be fixed in the interface before the first real adapter is written). |
| **DB indexing & growth** | **FAIL** | Three concrete missing/unusable-index defects on live query paths: the public tracking lookup cannot use either of its two available indexes (REL-003), `delivery_attempts` has no FK index at all (REL-009), and the retention sweep has no composite for its predicate (REL-007). Two list endpoints filter and sort on different columns with no composite (REL-016). Unbounded growth with no cleanup on `IdempotencyRecord` (REL-010), `Quote` (REL-015), `OutboxEvent` (append-only by trigger, `PUBLISHED` rows never removed), `InboxEvent` and `AuditEvent`. Positives: `TrackingEvent`'s `@@index([shipmentId, eventTime])` and `OutboxEvent`'s `@@index([status, createdAt])` are both correct and genuinely match their queries. |
| **Startup / readiness / liveness / shutdown** | **FAIL** | No health endpoint exists anywhere (REL-001); the ALB health check points at a content route that 404s and queries Postgres. The API has no SIGTERM handling and no `enableShutdownHooks()` (REL-002). Config validation via `loadApiConfig()` fails fast, which is correct — but the container is given no environment to validate (REL-014). The worker's shutdown handler is present and structurally correct, though it does not wait for in-flight message handlers to finish, which is what opens the redelivery-duplication window in REL-008. |
| **Queue semantics** | **FAIL** | The relay claims no rows and can duplicate publishes both at scale-out and via overlapping polls in a single process (REL-006); it has no attempt cap, no backoff and no DLQ, so one poison event blocks the queue permanently and silently (REL-005); the consumer's idempotency is a non-atomic check-then-act that assumes exactly-once (REL-008). To answer the brief's question directly: **the current assumptions do not transfer to SQS, and this needs real changes rather than an adapter swap.** Additionally the whole chain is **NOT VERIFIED end to end** — no producer writes an outbox row (REL-020), so it has never actually carried a message. |
| **Observability** | **FAIL** | `createLogger` is never called; all logging is NestJS's plain-text built-in logger or bare `console.*`, so nothing is structured, the redaction rules protect nothing, and correlation IDs exist only inside interpolated message strings (REL-011). Zero OpenTelemetry (confirmed: only a transitive `pnpm-lock.yaml` hit). No application metrics. Three alarms, all RDS. ALB 5xx / latency / unhealthy-host alarms are constructible today and absent; an outbox-depth alarm needs no AWS resource and is absent. Queue-age, SES bounce-rate, payment-webhook and certificate-expiry alarms are **NOT APPLICABLE** — the underlying resources genuinely do not exist and the stack's comment correctly says so. |
| **Infra backup / recovery** | **PASS (with caveats)** | The strongest area of the CDK. RDS: `multiAz: true`, `backupRetention: 35 days` matching the spec's PITR target, `deletionProtection: true`, `RemovalPolicy.RETAIN`, customer-managed KMS key with rotation, private-isolated subnets, `publiclyAccessible: false`. S3: both buckets KMS-encrypted, `BLOCK_ALL` public access, versioned, `RETAIN`, with a 7-day expiry lifecycle on the quarantine bucket. Caveats, none of which undermine recoverability: no restore has ever been exercised (**NOT VERIFIED** — nothing is deployed, and an untested restore is not a proven restore); there is no documented RTO/RPO or restore runbook in `docs/runbooks/`; and single-region only, with no cross-region snapshot copy to the Frankfurt recovery region the project's architecture names. |
| **Cost amplification** | **PARTIAL** | Real, identified risks: CloudWatch Logs with no retention on any of the five log groups, permanently (REL-013), amplified by the two hot failure loops that log every 2s and every 60s; the anonymous quote endpoint writing 5 rows per unauthenticated request with no expiry job and a rate limit that does not hold at fleet scale (REL-015); the retention sweep burning a large table scan 1,440 times a day for zero work (REL-007); the relay polling an empty table 43,200 times a day (REL-020). No AWS Budgets or Cost Anomaly Detection construct exists. Structurally the stack is cost-modest — 2 NAT gateways, `t4g.medium` RDS, `desiredCount: 1` throughout — so there is no runaway-scaling exposure today, largely because there is no autoscaling at all (REL-014). |

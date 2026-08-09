# Data-integrity and concurrency audit — findings (draft)

**Scope:** `packages/database/prisma/**`, `apps/api/src/**`, `apps/worker/src/**`
**Date:** 2026-08-07
**Method:** full read of `schema.prisma` (1261 lines, 49 models) and all three migrations; call-graph trace of every write path in the API and worker; live verification against the local PostgreSQL 18.4 dev database (`nauterio_dev`) and a booted dev API on port 3333.
**Status:** READ-ONLY. No application code or migration was modified. Test rows were removed except where noted in "Test residue" at the end.

---

## 0. Database-level invariants for the high-value entities

Written down first, before evaluating service logic, so each finding can name the specific invariant that the database currently cannot guarantee.

| Entity | Invariant the business needs | Enforced by the DB today? |
|---|---|---|
| **Shipment** | `tracking_number` unique, case-insensitively | **Yes** — `shipments_tracking_number_key` plus `shipments_tracking_number_normalised_idx` on `UPPER(tracking_number)` |
| | money and weights non-negative, `package_count > 0` | **Yes** — `shipments_total_amount_nonneg`, `shipments_outstanding_nonneg`, `shipments_declared_value_nonneg`, `shipments_weights_nonneg` |
| | `quote_id` references a real quote; `customs_case_id` references a real case | **No** — neither column has a foreign key (DATA-009) |
| | concurrent edits do not silently overwrite each other | **No** — `version` column exists but is never read or incremented (DATA-007) |
| | `lifecycle_status` transitions follow a legal state machine | **No** — no CHECK, no trigger, no application guard |
| | `outstanding_amount_minor_units` = issued charges − allocated payments | **No** — denormalised, nothing maintains it (DATA-019) |
| **Quote** | `total_amount_minor_units >= 0` | **Yes** — `quotes_total_nonneg` |
| | quote total equals the sum of its lines | **No** (DATA-010) |
| | all lines share the quote's currency | **No** (DATA-011) |
| | a persisted quote is attributable to a requester | **No** — `QuotesService.calculate` never sets `userId`/`organisationId`, and the quote id is never returned to the caller |
| | quote + its lines are written atomically | **Yes** — verified empirically, see PASS note under DATA-010 |
| **Payment** | one row per `(provider, provider_payment_id)` | **Yes** — `payments_provider_provider_payment_id_key` |
| | `amount_minor_units >= 0` | **Yes** — `payments_amount_nonneg` |
| | `sum(refunds.amount) <= payment.amount` | **No** (DATA-018) |
| | `sum(payment_allocations.amount) <= payment.amount` | **No** (DATA-018) |
| | refund/allocation currency matches the payment currency | **No** (DATA-011) |
| **PaymentEvent** | a provider webhook event is processed at most once | **Yes** — `payment_events_provider_event_id_key`; append-only trigger blocks UPDATE and DELETE. This one is genuinely well-built and ready for the handler that does not exist yet. |
| **Claim** | claimant owns (or is authorised on) the shipment | **No** — no FK-expressible rule, and no application check (DATA-006) |
| | a shipment cannot accumulate unbounded duplicate claims | **No** — no partial unique index, no state guard (DATA-006) |
| | claim + its audit event commit together | **Yes** — the only place in the codebase where this is done correctly |
| **IdempotencyRecord** | one row per `(scope, key)` | **Yes** — `idempotency_records_scope_idempotency_key_key`; empirically prevents concurrent double-creation (see PASS note under DATA-001) |
| | a key belonging to one principal cannot be replayed by another | **No** — `user_id` is stored but never compared (DATA-001) |
| | records expire | **No** — `expires_at` is written and never read; no sweeper exists (DATA-002) |
| | the record's terminal state is atomic with the business write | **No** — separate connection, fire-and-forget (DATA-003) |
| **OutboxEvent** | written in the same transaction as the business change | **No producer exists at all** (DATA-004) |
| | published at least once, retried with a bound, dead-lettered | **No** — unbounded retry, no DLQ, no claim/lock (DATA-004) |
| | never deleted | **Yes** — `outbox_events_append_only` trigger blocks DELETE (UPDATE is deliberately allowed for the relay) |
| **TrackingEvent** | append-only: an issued event is never rewritten | **No** — the trigger blocks DELETE only; UPDATE succeeds (DATA-008) |
| | `canonical_code` is one of the 34 catalogue statuses | **No** — no CHECK, despite the schema comment asserting one exists (DATA-011) |
| | duplicate carrier events are rejected | **Partially** — `dedup_key` is unique but nullable, so NULLs never dedup (DATA-017) |
| | a corrected event is superseded, not still authoritative | **No** — `correction_of_id` exists but nothing consumes it (DATA-012) |
| **AuditEvent** | append-only | **Yes** — `audit_events_append_only` blocks UPDATE and DELETE |
| | every high-risk write produces one | **No** — only `claim:submit` does (DATA-014) |
| | `entity_id` points at a row that exists | **No** — plain `TEXT`, no FK; one dangling row already present in the dev DB |

**Correction to the brief's premise:** the append-only trigger set is narrower than described. Verified against `pg_trigger`:

| Table | UPDATE blocked | DELETE blocked |
|---|---|---|
| `audit_events` | yes | yes |
| `inbox_events` | yes | yes |
| `payment_events` | yes | yes |
| `package_movements` | yes | yes |
| `outbox_events` | **no** (intentional — the relay mutates status) | yes |
| `tracking_events` | **no** (not intentional — see DATA-008) | yes |

---

## DATA-001 — Idempotency keys are global across all users: a key collision leaks one user's record to another and silently discards the second user's write

- **Severity:** Critical
- **Confidence:** Confirmed (reproduced end to end against the running dev API)
- **File:line:** `apps/api/src/common/interceptors/idempotency.interceptor.ts:52` (scope excludes the principal), `:71-86` (replay path), `packages/database/prisma/schema.prisma:1216` (`@@unique([scope, key])`)

**Invariant violated:** an idempotency record is a per-principal receipt. The uniqueness domain must include the authenticated principal; here it is `(scope, key)` only, so the key namespace is shared by every user of the system. `IdempotencyRecord.userId` is persisted (`:63`) and then never compared against the replaying caller.

**Reproduction (actually executed):**

```
# user "secaudit-victim" creates an address with key AUDIT-XUSER
POST /v1/me/addresses  Authorization: Bearer secaudit-victim  Idempotency-Key: AUDIT-XUSER
  -> 201 {"id":"019fdbac-ef38-...","userId":"019fdba9-f1dc-...(victim)","line1":"AUDIT-TEST-2 Victim Street",...}

# a DIFFERENT account replays the same key with the same body
POST /v1/me/addresses  Authorization: Bearer secaudit-attacker  Idempotency-Key: AUDIT-XUSER
  -> 201 {"id":"019fdbac-ef38-...","userId":"019fdba9-f1dc-...(victim)","line1":"AUDIT-TEST-2 Victim Street",...}

# database state afterwards:
select a.id, u.cognito_sub from addresses a join users u on u.id=a.user_id
  where a.line1='AUDIT-TEST-2 Victim Street';
  -> 019fdbac-ef38-...  |  secaudit-victim          (exactly one row — the attacker's write never happened)
```

**Interleaving that produces it without malice** (this is not only an attack; it fires on ordinary key reuse, because the key is client-chosen and nothing requires it to be a UUID):

- T1: user A `POST /v1/me/addresses`, `Idempotency-Key: 1`. `create()` succeeds, address A written, record marked COMPLETED with A's response body.
- T2: user B `POST /v1/me/addresses`, `Idempotency-Key: 1`, same body shape (a shared office address, a default form value, a client that numbers its requests). `create()` raises P2002 → `findUnique` finds A's record → `requestHash` matches → status is COMPLETED → `return of(existing.responseBodyJson)`.
- B receives HTTP 201 and A's address row, including A's `userId`. B's address is never created. B's client has a success receipt for a write that does not exist.

**Impact:** two distinct failures from one defect. (1) Cross-tenant disclosure of a persisted record — on `/v1/me/addresses` that is a home address and the owner's user id; the same interceptor also guards `POST /v1/claims` and `POST /v1/bookings`, so the leaked body would be a claim or a booking draft. (2) Silent data loss — the second caller is told 201 and has no way to detect that nothing was written. On `POST /v1/bookings` that means a customer's booking draft is discarded while the UI shows success. Both are amplified by the fact that `POST /v1/me/addresses` and `POST /v1/claims` require only a customer-level token.

**Recommended fix (smallest correct mechanism):** put the principal in the uniqueness domain, not in application logic. Change the unique constraint to `@@unique([scope, userId, key])` (with a sentinel for anonymous callers) and derive `scope` as `${controller}.${handler}` as today. As defence in depth, add an equality check on `existing.userId` before the `return of(...)` at `:86` and return 409, not the stored body, on mismatch — that converts any residual collision into a loud failure instead of a silent cross-tenant read. Both changes are needed: the constraint prevents the collision, the check makes a future regression fail closed.

---

## DATA-002 — Idempotency records never expire and are never swept: expired receipts replay forever and a crash permanently bricks a key

- **Severity:** High
- **Confidence:** Confirmed (both halves reproduced)
- **File:line:** `apps/api/src/common/interceptors/idempotency.interceptor.ts:18` (`RECORD_TTL_HOURS = 24`), `:64` (`expiresAt` written), `:71-86` (lookup ignores `expiresAt`); `packages/database/prisma/schema.prisma:1214,1217`

**Invariant violated:** an idempotency receipt is valid for a bounded window. Here `expires_at` is computed, written, and indexed — and never read by any code in the repository. Confirmed: `grep -rn 'idempotencyRecord|expiresAt' apps/api/src apps/worker/src` returns only the interceptor's own write and an unrelated `Quote.expiresAt`. There is no cleanup job in `apps/worker/src` (the only scheduled job is `retention.job.ts`, which touches shipments only).

**Reproduction A — expired receipt still replays:**

```
update idempotency_records set expires_at = now() - interval '400 days',
       created_at  = now() - interval '400 days'
 where idempotency_key='AUDIT-XUSER';

POST /v1/me/addresses  Idempotency-Key: AUDIT-XUSER
  -> 201, replaying the 400-day-old cached body
```

The stated 24-hour TTL does not exist. A key is bound to its response for the lifetime of the table.

**Reproduction B — stuck `IN_PROGRESS` bricks the key permanently.** This is the crash window the brief asked about, simulated by setting the state the crash would leave behind:

```
update idempotency_records set status='IN_PROGRESS', response_body_json=null
 where idempotency_key='AUDIT-CONCURRENT-1';

POST /v1/me/addresses  Idempotency-Key: AUDIT-CONCURRENT-1  -> 409
POST /v1/me/addresses  Idempotency-Key: AUDIT-CONCURRENT-1  -> 409   (and so on, indefinitely)
```

**Interleaving that reaches that state in production:**

- T1: request with key K. `create()` claims K (row is `IN_PROGRESS`). Handler runs, business transaction **commits**.
- T1 continues into `tap.next` at `:91`, which fires the `update(... status: "COMPLETED")` **without awaiting it** and returns the response.
- The pod is killed (deploy, OOM, scale-in, `SIGKILL`) in the window between the commit and that update landing. ECS rolling deploys make this window routine, not exotic.
- T2 (any later retry, minutes or months later): `create()` → P2002 → record is `IN_PROGRESS` → 409 forever. No expiry clears it, no sweeper deletes it, and the interceptor's own error path (`:102`) only runs in the process that already died.

**Impact:** (a) an idempotency key that a client has legitimately retried becomes permanently unusable, and the underlying operation can never be completed with that key — for `POST /v1/claims` that is a customer who can no longer file the claim their client is pinned to; (b) `idempotency_records` grows without bound, one row per guarded request forever, with the `expires_at` index paid for and never used.

**Recommended fix:** two small changes. (1) Make the lookup at `:71` treat `expiresAt < now()` as "not seen": delete the stale row and fall through to claiming the key (the unique constraint keeps the delete-then-claim safe — a loser gets P2002 and re-reads). (2) Add a sweeper to `apps/worker/src` alongside `retention.job.ts` doing `deleteMany({ where: { expiresAt: { lt: new Date() } } })`, which the existing `idempotency_records_expires_at_idx` already supports. (1) alone fixes correctness; (2) alone fixes growth; both are cheap.

---

## DATA-003 — The idempotency receipt is not atomic with the business write, and the error path releases the key even when the write committed

- **Severity:** High
- **Confidence:** Confirmed by code trace (the commit-then-error interleaving is not reproducible on demand without fault injection, hence stated as an interleaving rather than a transcript)
- **File:line:** `apps/api/src/common/interceptors/idempotency.interceptor.ts:89-107`

**Invariant violated:** "this operation has been performed" and "the operation's effects are durable" must become true atomically. Here the claim row and the business row are written on two independent connections (`getPrismaClient()` in the interceptor; a separate `prisma.$transaction` inside `ClaimsReturnsService.submit`), and neither of the two `tap` callbacks is awaited or sequenced against the response.

Two distinct defects in the same eight lines:

**(a) `tap` is fire-and-forget.** Both `.update()` (`:92`) and `.delete()` (`:102`) return promises that are never awaited; only `.catch(log)` is attached. The HTTP response is flushed to the client before either lands. Any failure of that write is logged and otherwise invisible — the client's receipt says the operation is complete while the record says `IN_PROGRESS` (this is the entry point to DATA-002B).

**(b) The error path deletes a claim whose side effect may already be durable.** `:99-105` deletes the record on *any* handler error, on the stated assumption that "the operation failed". That assumption does not hold for the error class that matters most:

- T1: `POST /v1/claims`, key K. `create()` claims K. `prisma.$transaction` runs `claim.create` + `auditEvent.create`; PostgreSQL **commits**.
- The `COMMIT` acknowledgement is lost — pooled connection reset, RDS Proxy failover, `statement_timeout`/`query_timeout` (both set to 15 s in `packages/database/src/index.ts:26-27`) firing on the acknowledgement rather than the work. Prisma surfaces an error.
- `tap.error` fires and **deletes the claim on key K**.
- T2: the client, having received a 5xx that the exception filter labelled `retryable: true` (see DATA-016), retries with the same key K. `create()` now succeeds — the key was released. A **second Claim row and a second AuditEvent** are written for one logical submission.

The repeated input is *(Idempotency-Key: K, identical body)*; the duplicated side effect is a second `claims` row plus a second append-only `audit_events` row that can never be deleted. When `BillingModule` grows the payment path this same shape becomes a double charge.

**Impact:** the guarantee the interceptor exists to provide does not hold across the exact failure mode — a transient error after commit — that idempotency keys are designed for.

**Recommended fix:** write the receipt inside the business transaction rather than around it. Give the guarded services a transaction-aware helper (the same shape `AuditService.record(input, tx?)` already uses successfully) that inserts the `IdempotencyRecord` in the handler's own `$transaction`; the unique constraint then does the deduplication, and the record's existence and the business row's existence become the same fact. Where a handler cannot be restructured yet, at minimum: stop deleting on error and instead mark the record `FAILED` with the error class, and only allow re-claiming for error classes that provably did not commit (validation errors, 4xx) — never for connection or timeout errors. Also `await` both terminal writes before the response is emitted.

**Related dead columns:** `response_status` (`schema.prisma:1210`) is never written — the replay at `:86` returns the body with whatever status the route decorator implies, so a replayed `201` and a replayed `202` are indistinguishable.

---

## DATA-004 — The transactional outbox has no producer: no business event is ever published, and the relay itself is unsafe for more than one replica

- **Severity:** High
- **Confidence:** Confirmed
- **File:line:** `apps/worker/src/outbox-relay.ts:43-86`; absence verified across all of `apps/api/src`

**Invariant violated:** "a committed business change eventually produces exactly one published event." Neither half holds. Nothing produces, and what consumes is unbounded and unlocked.

**(a) No producer exists.** `grep -rn 'outboxEvent|OutboxEvent' apps packages` matches only `apps/worker/src/outbox-relay.ts`. There is no `outboxEvent.create` anywhere in the API. Confirmed against live data after exercising every write endpoint the API has:

```
outbox_events=0   inbox_events=0   notifications=0
quotes=4          addresses=3      claims=6
```

The relay's own routing table (`:16-20`) names `quote.created`, `shipment.created`, and `claim.submitted` — none of which any code emits. Every published-event path (`ShipmentCreated` in the `ShipmentsService` header comment, the `notifications-email` consumer, `DeliveryAttempt`, `Notification`) is reachable only by hand-inserting a row. This is scope-not-yet-built, but it should be recorded as such rather than counted as delivered infrastructure: the machinery is individually testable and currently inert.

**(b) The relay has no claim step.** `:45-49` selects `status: PENDING` and `:57/:71/:78` updates by id, with no locking, no `FOR UPDATE SKIP LOCKED`, and no conditional `WHERE status = 'PENDING'`. `apps/worker/src/main.ts:10-12` states the worker runs "as its own ECS Fargate service, scaled on SQS queue depth" — i.e. more than one replica by design.

- T1 (relay A) reads rows [e1..e25].
- T2 (relay B), within the same 2-second tick, reads the same [e1..e25] — none are marked yet.
- Both publish e1. Both then `update(... PUBLISHED)`; the second is a harmless no-op write, so nothing surfaces the duplicate.
- e1 is delivered twice. Whether that becomes a duplicate side effect depends entirely on the consumer, which is itself racy — see DATA-005.

**(c) `attempts` is incremented and never read.** `:78-81` increments on publish failure and the next poll re-selects the same row unconditionally. A permanently failing event is republished every 2 seconds forever: no cap, no backoff, no jitter, no dead-letter queue. This is the exact list CLAUDE.md requires ("bounded retries, jitter, dead-letter queues, replay controls"). Meanwhile an *unroutable* event type is marked `FAILED` on the first pass (`:57-60`) with no operator-visible alert and no replay path — and `outbox_events` is DELETE-blocked, so those rows accumulate permanently in a terminal state.

**(d) `PUBLISHED` is recorded before the consumer has done anything.** `LocalQueueAdapter.publish` (`local-queue-adapter.ts:21-25`) resolves immediately via `setImmediate`; the relay marks the row `PUBLISHED` at `:71` while the handler has not yet run. If the handler then throws, the error is caught and logged in the adapter (`:38-45`) and the outbox row still reads `PUBLISHED`. The event is lost with no queryable trace. Concretely: a `notifications-email` message whose payload lacks `email` throws at `notifications-email.job.ts:17`, and the system's durable record says the notification was published successfully.

**Impact:** today, no notification, webhook, or downstream reaction fires for any business event. When a producer is added, the relay will duplicate under normal horizontal scaling and lose events on consumer failure.

**Recommended fix, in order of size:**
1. Claim before publishing: `UPDATE outbox_events SET status='PUBLISHING' WHERE id = ANY(...) AND status='PENDING' RETURNING *`, or select with `FOR UPDATE SKIP LOCKED` inside the transaction that publishes. One conditional update removes the multi-replica duplicate entirely — no distributed lock required.
2. Bound the retry: skip rows with `attempts >= N` and route them to a `DEAD_LETTERED` status with an alert; add exponential backoff by filtering on `created_at`/a `next_attempt_at` column.
3. Only mark `PUBLISHED` on an acknowledgement the transport can actually give. The local adapter cannot give one — have it return after the handler resolves, or have the relay record `DISPATCHED` and let the consumer close the loop.
4. Add the producers, writing `outboxEvent.create` inside the same `$transaction` as each business change (the `ClaimsReturnsService.submit` transaction is the natural first one).

---

## DATA-005 — Consumer idempotency is check-then-act, so a duplicate delivery runs the handler twice

- **Severity:** High
- **Confidence:** Confirmed by code trace; the `InboxEvent` unique constraint exists and is verified, but it is consulted after the side effect rather than before
- **File:line:** `apps/worker/src/queue/local-queue-adapter.ts:28-46`

**Invariant violated:** "a message with a given `messageId` produces its side effect at most once." The DB *can* enforce this — `inbox_events_source_message_id_key` exists — but the code reads it as an advisory check and only writes the row *after* the handler has already completed its externally visible work.

```ts
const already = await prisma.inboxEvent.findUnique({...});  // :30
if (already) return;                                        // :33
try {
  await handler(message);                                   // :36  <- side effect happens here
  await prisma.inboxEvent.create({...});                    // :37  <- claim happens here
}
```

**Interleaving:**

- T1 and T2 are two deliveries of the same `messageId` — produced by DATA-004(b)'s unlocked relay, or by SQS's at-least-once delivery once `SqsQueueAdapter` replaces this one.
- T1 executes `findUnique` → `null`.
- T2 executes `findUnique` → `null` (T1 has not inserted yet; the insert is three statements away).
- T1 runs `handler(message)` → `messagingAdapter.sendEmail(...)` → **email sent**.
- T2 runs `handler(message)` → **the same email sent again**. `LocalMockMessagingAdapter.sendEmail` (`packages/integrations/src/messaging/local-mock-messaging-adapter.ts:6-10`) ignores the `idempotencyKey` it is handed at `notifications-email.job.ts:24` and returns a fresh `providerMessageId` each call — as would SES.
- T1 inserts the `InboxEvent`. T2's insert raises P2002, which is swallowed by the `catch` at `:38` and logged as a handler failure.
- Two `Notification` rows and two `DeliveryAttempt` rows, both numbered `attemptNumber: 1`, plus two real emails to a customer.

**Second defect in the same block:** a handler that throws leaves **no** `InboxEvent` row, so the message is eligible for reprocessing — but nothing redelivers it (`publish` is fire-and-forget), and the outbox row already says `PUBLISHED`. The message is simply gone. The comment at `:41-44` correctly notes the local adapter has no DLQ; the problem is that the relay's success accounting does not account for that.

**Third defect:** `notifications-email.job.ts:30-45` performs two writes (`notification.create`, then `deliveryAttempt.create`) outside any transaction, *after* the email has already gone out. A crash between them leaves a `Notification` with no `DeliveryAttempt`, i.e. a sent email with no delivery record.

**Recommended fix:** invert the order — insert the `InboxEvent` **first** and let the unique constraint be the gate:

```ts
try { await prisma.inboxEvent.create({ data: { source: queue, messageId } }); }
catch (e) { if (isP2002(e)) return; throw e; }   // already processed
await handler(message);
```

That makes the DB constraint, not a read, the arbiter. For the handler's own writes, wrap `notification.create` + `deliveryAttempt.create` in one `$transaction`, and record the `Notification` row *before* calling the provider so a crash leaves an auditable "attempted" state rather than an invisible send.

---

## DATA-006 — Claims: no ownership check, no state guard, no de-duplication — any user can file unlimited claims against any shipment

- **Severity:** High
- **Confidence:** Confirmed (reproduced against the running dev API)
- **File:line:** `apps/api/src/modules/claims-returns/claims-returns.module.ts:32-58`; enabled by `apps/api/src/modules/shipments/shipments.service.ts:52-62`

**Invariant violated:** a claim is a financially consequential assertion about a shipment. Three rules the database cannot express and the service does not implement: the claimant must be authorised on the shipment; the shipment must be in a state where a claim is meaningful (delivered, lost, or damaged — not `DRAFT`); and one shipment/claimant/reason should not accumulate open duplicates. `ClaimsReturnsService.submit` passes `dto.shipmentId` straight into `tx.claim.create`. The only check performed by anything is the `claims_shipment_id_fkey` FK, which asserts existence and nothing else.

**Reproduction (actually executed):**

```
# "secaudit-attacker" is not the owner of this shipment (owner_user_id is NULL; the
#  user is not a member of any organisation on it)
POST /v1/claims  Authorization: Bearer secaudit-attacker  Idempotency-Key: AUDIT-CLAIM-1
{"shipmentId":"019fdad2-542b-7e99-ba70-1941332b3fc0","reasonCategory":"LOST","description":"..."}
  -> 201  {"id":"019fdbad-accd-...","status":"SUBMITTED", ...}

# three more identical claims, same user, same shipment, different idempotency keys
  -> 201, 201, 201

select count(*) from claims where shipment_id='019fdad2-542b-7e99-ba70-1941332b3fc0';
  -> 4
```

**Why the idempotency interceptor does not help:** it deduplicates *retries of one request*, not *distinct requests asserting the same fact*. A client that varies the key — which every correct client does, one key per logical submission — bypasses it entirely, by design. Idempotency and de-duplication are different invariants; only the first is implemented.

**Enabler:** `ShipmentsService.getById` (`shipments.service.ts:52-62`) applies no ownership scoping at all, unlike `list()` immediately above it (`:32-50`), which carefully scopes by staff role / organisation / owner. Confirmed: `GET /v1/shipments/{id}` as an unrelated customer returns `200` with the full record. Any authenticated customer can therefore enumerate shipment ids to claim against. This overlaps the security audit's territory; it is recorded here because it is the discovery step for the state corruption above.

**Impact:** a claims queue that can be filled with claims against shipments the filer has nothing to do with, and duplicate claims against a single shipment. Once `ClaimDecision`/`Refund` are wired up, "the same delivered shipment accumulates unlimited duplicate claims" becomes "the same loss is compensated more than once" — each duplicate claim is independently approvable, and nothing at the database level would notice.

**Recommended fix:** three separate mechanisms, one per invariant.
1. **Authorisation:** load the shipment inside the transaction and verify `ownerUserId === userId` or the caller's `organisationId` matches, before `claim.create`. Return 404 (not 403) to avoid confirming existence.
2. **State guard:** reject unless `lifecycleStatus` is in the claimable set — a plain application check plus a CHECK-backed state machine when the lifecycle rules are settled.
3. **De-duplication:** a partial unique index is the right size here —
   `CREATE UNIQUE INDEX claims_one_open_per_shipment_claimant ON claims (shipment_id, submitted_by_user_id, reason_category) WHERE status IN ('SUBMITTED','UNDER_REVIEW');`
   which permits a new claim after a prior one is resolved but rejects concurrent duplicates at the database, closing the check-then-act race that an application-level `findFirst` would leave open.

---

## DATA-007 — The optimistic-locking `version` columns are dead schema: no code reads or increments them

- **Severity:** High
- **Confidence:** Confirmed
- **File:line:** `packages/database/prisma/schema.prisma:58` (`User.version`), `:96` (`Organisation.version`), `:426` (`Shipment.version`), `:852` (`Invoice.version`); comment asserting the mechanism at `:15-16`

**Invariant violated:** "a concurrent edit to the same record is detected and rejected rather than silently overwritten." The schema's own header comment states the design — *"Records with realistic concurrent-edit risk carry an optimistic `version` column, bumped via a `WHERE version = $expected` guard in application code"* — and no such guard exists anywhere.

**Verification:** grepping `apps/api/src`, `apps/worker/src`, and `packages/database/src` for `version`, excluding the unrelated `eventVersion` / `versionNumber` / `templateVersion` / `DocumentVersion` / `PolicyVersion` identifiers, returns **zero** matches in executable code — only the word "conversion" inside comments. The four columns are written once at insert (`DEFAULT 1`) and never touched again.

**Interleaving this leaves open** (using `Shipment`, which is the one with real concurrent-edit exposure — staff dashboard, warehouse PWA, driver PWA, and carrier webhooks all target the same row):

- T1 (staff dashboard) reads shipment S: `{version: 1, actionRequiredReason: null, lifecycleStatus: ACTIVE}`.
- T2 (customs worker) reads the same S: `{version: 1, ...}`.
- T1 writes `{lifecycleStatus: ACTION_REQUIRED, actionRequiredReason: "Commercial invoice missing"}`.
- T2 writes `{lifecycleStatus: DELIVERED, deliveredAt: now()}` — computed from its own stale read, which did not include T1's action-required flag.
- Final state: `DELIVERED` with no record that a customs hold was ever raised. T1's write is gone, no error was raised to either operator, and `version` still reads 1.

There is no write path to `shipments` in the API today (DATA-014/priority-flow notes), so this is latent rather than active — but the column's presence actively misleads: a reviewer reading `schema.prisma:15-16` and seeing `version Int @default(1)` will reasonably assume the protection is in place when writing the first shipment mutation.

**Recommended fix:** either implement it or remove it; the current state is the worst of the three. To implement, the smallest correct mechanism is a conditional update, not a lock:
`prisma.shipment.updateMany({ where: { id, version: expectedVersion }, data: { ...changes, version: { increment: 1 } } })`
and treat `count === 0` as a 409 conflict. `updateMany` is required because Prisma's `update` cannot take a non-unique predicate. If a given entity has no real concurrent-edit exposure, drop the column and the schema comment along with it.

---

## DATA-008 — `tracking_events` is not append-only: UPDATE succeeds and silently rewrites issued customer-facing history

- **Severity:** High
- **Confidence:** Confirmed (reproduced against the live database, rolled back)
- **File:line:** `packages/database/prisma/migrations/20260807024500_constraints_and_triggers/migration.sql:132-139`; asserted-but-absent invariant at `packages/database/prisma/schema.prisma:11-14`

**Invariant violated:** CLAUDE.md, unconditionally: *"Tracking, audit, and issued financial history are append-only. Correct with linked adjustment records."* The migration installs `tracking_events_no_delete` as `BEFORE DELETE` only. Its own comment (`:132-136`) acknowledges the gap and defers the UPDATE half to "application logic" — and no such application logic exists (there is no tracking write path at all).

**Reproduction (actually executed, rolled back):**

```sql
UPDATE tracking_events
   SET canonical_code = 'AUDIT_TEST_TAMPER',
       public_title_en = 'TAMPERED',
       event_time      = event_time - interval '5 days'
 WHERE id = (SELECT id FROM tracking_events LIMIT 1);
-- UPDATE 1     (no error; canonical_code, customer-visible title, and the
--               event's own timestamp were all rewritten in place)
```

Compare `audit_events`, `inbox_events`, `payment_events`, and `package_movements`, where the identical statement raises `<table> is append-only: UPDATE is not permitted`.

**Impact:** the tracking timeline is the customer-facing record of custody and the evidentiary basis for claims and carrier disputes. A bug, a mistaken admin query, or a compromised application role can rewrite a delivery timestamp or a canonical status with no trace — the `correction_of_id` self-relation exists precisely so corrections are new rows, and nothing forces that path. The `receivedTime` column, which would otherwise let you detect a backdated `eventTime`, is itself editable.

**Secondary gap in the same migration:** the section header (`:91-101`) states the migration *"revokes UPDATE/DELETE from the app role"* and describes revoking "from PUBLIC plus any role literally named `nauterio_app`". Grepping the migrations directory for `REVOKE` returns **no statements at all** — only those comments. The trigger is not defence in depth on top of a grant model; it is the only control that exists.

**Recommended fix:** extend the existing trigger — one line, using the function already defined:

```sql
CREATE TRIGGER tracking_events_append_only
  BEFORE UPDATE ON "tracking_events"
  FOR EACH ROW EXECUTE FUNCTION reject_update_delete();
```

If `notification_state` genuinely needs to be mutable (it is the one field with a legitimate lifecycle: `NOT_ELIGIBLE → ELIGIBLE → QUEUED → SENT`), use a column-scoped trigger that raises only when an immutable column changes, rather than leaving the whole row writable:
`BEFORE UPDATE ON tracking_events FOR EACH ROW WHEN (OLD.canonical_code IS DISTINCT FROM NEW.canonical_code OR OLD.event_time IS DISTINCT FROM NEW.event_time OR ...) EXECUTE FUNCTION reject_update_delete();`
Separately, either write the `REVOKE` statements the comment promises or correct the comment so it does not describe a control that is absent.

---

## DATA-009 — Thirty-one reference columns have no foreign key, including the shipment↔quote and shipment↔customs-case links

- **Severity:** Medium (High once the deferred write paths land)
- **Confidence:** Confirmed (enumerated from `pg_constraint`; orphan inserts executed and rolled back)
- **File:line:** `packages/database/prisma/schema.prisma:403,418,424` (Shipment), `:349` (Booking), `:722` (CustomsCase), `:1025-1026` (Return), and others

**Invariant violated:** referential integrity for relationships that Prisma models as bare `String @db.Uuid` fields rather than `@relation`s. Prisma only emits a foreign key where a relation is declared, so every "pointer" field written as a plain column is unconstrained.

**Full list of `uuid`-typed `*_id` columns with no FK** (from `information_schema` cross-referenced against `pg_constraint`):

`bookings.converted_shipment_id`, `claim_decisions.decided_by_user_id`, `claim_evidence.document_id`, `content_pages.current_policy_version_id`, `customs_cases.shipment_id`, `deliveries.assigned_driver_user_id`, `deliveries.proof_photo_document_id`, `deliveries.signature_document_id`, `document_versions.uploaded_by_user_id`, `documents.current_version_id`, `external_tracking_events.mapped_tracking_event_id`, `idempotency_records.user_id`, `invoices.customer_user_id`, `invoices.document_id`, `package_movements.from_location_id`, `package_movements.to_location_id`, `package_movements.scanned_by_user_id`, `packages.label_document_id`, `pickups.assigned_driver_user_id`, `pickups.evidence_document_id`, `rate_cards.approved_by_id`, `refunds.approved_by_user_id`, `returns.original_shipment_id`, `returns.return_shipment_id`, `shipments.created_by_user_id`, `shipments.customs_case_id`, `shipments.quote_id`, `support_links.shipment_id`, `tracking_events.actor_user_id`, `tracking_events.evidence_document_id`, `users.staff_warehouse_ids`.

**Reproduction (actually executed, rolled back):**

```sql
INSERT INTO customs_cases (shipment_id, updated_at)
  VALUES ('00000000-0000-0000-0000-0000deadbeef', now());          -- INSERT 0 1

UPDATE shipments SET quote_id        = '00000000-0000-0000-0000-00000000dead',
                     customs_case_id = '00000000-0000-0000-0000-00000000beef'
 WHERE id = (SELECT id FROM shipments LIMIT 1);                     -- UPDATE 1

INSERT INTO returns (original_shipment_id, return_shipment_id)
  VALUES ('00000000-0000-0000-0000-00000000aaaa',
          '00000000-0000-0000-0000-00000000bbbb');                  -- INSERT 0 1
```

**The financially significant ones:**

- **`shipments.quote_id`** — the link from a shipment to the quote whose price it was sold at. Unconstrained *and* unvalidated at the application layer. `SaveDraftDto.quoteId` (`bookings.module.ts:17`) is `@IsOptional() @IsString()` — not even `@IsUUID()` — and no code checks that the quote belongs to the caller. Combined with the fact that `QuotesService.calculate` never sets `Quote.userId`, **every persisted quote is ownerless**, so once booking→shipment conversion is implemented there is nothing to check ownership *against*: a client can attach any quote id (a cheap 1 kg quote) to a booking for a different consignment. That is a price-tampering path that should be closed before the conversion code is written, not after.
- **`customs_cases.shipment_id` / `shipments.customs_case_id`** — a bidirectional link with a `@unique` on each side and a FK on neither. The two can disagree; either can dangle.
- **`bookings.converted_shipment_id`** — the idempotency anchor for booking→shipment conversion. `@unique` guarantees one booking maps to at most one shipment id, but not that the id names a shipment that exists.
- **`audit_events.entity_id`** is `TEXT`, not even a uuid, and has no FK. The dev database already contains one audit row (`019fdb83-014a-…`, 09:17) whose `entity_id` names a claim that no longer exists — an append-only audit trail pointing at a deleted entity, which is exactly the failure mode audit tables are meant to prevent.

**Recommended fix:** declare the missing `@relation`s in `schema.prisma` so Prisma emits the FKs — this is the smallest correct mechanism and costs nothing beyond a migration. Where a genuine circular dependency blocks it (`shipments.customs_case_id` ↔ `customs_cases.shipment_id`), keep **one** direction as the FK and drop the other column rather than maintaining two unenforced pointers. Add the FKs with `NOT VALID` followed by a separate `VALIDATE CONSTRAINT` so the migration does not take a long lock (see DATA-015). For the price-tampering path specifically, also set `Quote.userId`/`organisationId` at creation and verify quote ownership when a booking references it.

---

## DATA-010 — Money is computed in IEEE-754 floats; a reproducible one-cent under-charge, and no constraint that a quote's total matches its lines

- **Severity:** Medium
- **Confidence:** Confirmed (reproduced against the running API; divergence enumerated exhaustively)
- **File:line:** `apps/api/src/modules/quotes/quotes.service.ts:42-48` (float arithmetic), `:79,84-87` (conversion to minor units at the last moment), `:97-99` (`round2`); `packages/validation/src/volumetric-weight.ts:32,37-39`

**Invariant violated:** CLAUDE.md and `schema.prisma:8-9`: *"Money is always a (AmountMinorUnits BigInt, Currency Char(3)) pair, never a Float/Decimal alone."* The storage layer honours this; the calculation layer does not. Every intermediate is a JavaScript `number`, converted only at `BigInt(Math.round(x * 100))`, and the API response returns floats (`totalPriceEur`, `baseRateEur`, …) to the client.

**Reproduction A — one-cent under-charge (actually executed):**

```
POST /v1/quotes {"weightKg":0.17,"lengthCm":1,"widthCm":1,"heightCm":1,
                 "declaredValueEur":0,"service":"air-express"}
  -> {"baseRateEur":36.1,"totalPriceEur":36.1, ...}

select total_amount_minor_units from quotes order by created_at desc limit 1;
  -> 3610
```

The exact value is `35 + 6.5 × 0.17 = 36.105` EUR, which is `3611` minor units under round-half-up (and `3610` under round-half-even). `Math.round(36.105 * 100)` yields `3610` because `36.105 * 100` evaluates to `3610.4999999999995`. The quote is a cent light — silently, with no error.

This is not a single unlucky input. Enumerating `weightKg` from 0.001 to 200 kg in 1 g steps against exact integer arithmetic, the first divergences are at **0.17, 0.23, 0.39, 0.45, 0.73, 0.83 kg** — i.e. common parcel weights, not edge cases. The same class of error will apply to every future rate computation that follows this pattern.

**Reproduction B — precision collapse at scale.** `weightKg` carries `@Min(0.01)` and no upper bound (`create-quote.dto.ts:8`). At `weightKg = 1e15` the computed base is `6500000000000035` EUR and the persisted value is `650000000000003456` minor units — the trailing digits are float noise, not a price. (See DATA-016 for the same unbounded input causing a 500.)

**Missing constraints on the same data:**

- Nothing requires `quotes.total_amount_minor_units = sum(quote_lines.amount_minor_units)`. Verified: a quote of `100000` minor units EUR whose only line is `1` minor unit inserts cleanly. Today the two happen to agree, but only by accident of the arithmetic — there is exactly one unrounded component (`insuranceFeeEur`), so `round2(base + ins) × 100` coincides with `round(base×100) + round(ins×100)`. Add a second unrounded component and the total and the lines silently diverge.
- `insuranceFeeEur` (`:45-47`) is the one term never passed through `round2`, so a value like `8.995000000000001` is carried into both the total and its line.

**Impact:** systematic sub-cent revenue error across every quote, on the pricing path that is the commercial front door of the product. Individually trivial; at volume it is an unreconcilable ledger, and it is being baked in before any real rate card exists.

**Recommended fix:** do the arithmetic in integer minor units end to end. Take `declaredValueEur`/`weightKg` as input, convert once at the boundary, and keep every intermediate a `bigint`; apply an explicit, documented rounding rule (round-half-up on the final total only) instead of `Math.round(x*100)` at each step. Return minor units + currency in the API response rather than EUR floats — `main.ts:16-19` already installs a `BigInt.prototype.toJSON`, so the serialisation support is in place. Add a deferrable CHECK or an application invariant test asserting `total = sum(lines)` once the arithmetic is integral.

**PASS note — nested-write atomicity.** The brief asked whether Prisma 7's nested `create` is genuinely one transaction under the driver-adapter. Verified empirically rather than assumed: forcing the second `QuoteLine` to violate `quote_lines_amount_nonneg` inside `prisma.quote.create({ data: { ..., lines: { create: [...] } } })` produced `23514` and left the quote count unchanged (3 → 3). The parent is rolled back with the child. **Atomic — no finding.**

---

## DATA-011 — Missing CHECK constraints: `canonical_code` accepts anything (despite a schema comment claiming otherwise), and no currency column is validated

- **Severity:** Medium
- **Confidence:** Confirmed (reproduced, rolled back)
- **File:line:** `packages/database/prisma/schema.prisma:512-516` (the claim), `20260807024500_constraints_and_triggers/migration.sql` (the absence)

**Invariant violated (a):** `TrackingEvent.canonicalCode` must be one of the 34 statuses in `packages/contracts/src/tracking-status.ts`. The schema comment states plainly: *"a CHECK constraint mirroring the enum is added in the companion migration instead."* Querying `pg_constraint` for CHECK constraints on `tracking_events` returns **none**. The migration adds seventeen money/measurement CHECKs and no status CHECK.

```sql
INSERT INTO tracking_events (shipment_id, canonical_code, public_title_en,
                             public_title_it, source_type, event_time)
SELECT id, 'NOT_A_REAL_STATUS_AUDIT_TEST', 'x','x','CARRIER_API', now()
  FROM shipments LIMIT 1;                                    -- INSERT 0 1
```

The consumer is unguarded too: `TrackingService.getByTrackingNumber` does `TRACKING_STATUS_META[latestEvent.canonicalCode as TrackingStatus]` (`tracking.service.ts:62`) — an unchecked cast on a value with no constraint behind it. An unrecognised code yields `undefined`, and the customer-facing status silently falls back to the raw `lifecycleStatus` enum name (`:70`) instead of a translated label. A carrier adapter emitting an unmapped code degrades the public tracking page with no error anywhere.

**Invariant violated (b):** every `currency` column is `CHAR(3)` with no CHECK on the value and no constraint tying related currencies together. Confirmed: `UPDATE shipments SET currency='zz9'` succeeds. A quote of `100000` minor units `EUR` whose only line is `1` minor unit `JPY` inserts cleanly. Nothing requires `payment.currency = payment_allocation.currency = invoice.currency`, or `refund.currency = payment.currency`. `CHAR(3)` also pads rather than rejects, so `'E '` and `'EUR'` are both storable and unequal.

**Impact:** (a) the tracking status vocabulary — the single most customer-visible enum in the product, and the thing the whole `contracts` package exists to keep in lockstep — has no enforcement on either side of the boundary, while a comment asserts it does. (b) Cross-currency arithmetic can be performed and stored without the database objecting, which is the classic route to a reconciliation break that is only discovered at close.

**Recommended fix:** add the CHECK the comment already promises, generated from `TRACKING_STATUSES` so the two cannot drift:
`ALTER TABLE tracking_events ADD CONSTRAINT tracking_events_canonical_code_valid CHECK (canonical_code IN (...)) NOT VALID;` then `VALIDATE CONSTRAINT`. For currency, a single reusable domain is smaller than per-column CHECKs: `CREATE DOMAIN currency_code AS CHAR(3) CHECK (VALUE ~ '^[A-Z]{3}$')`, then a CHECK per money pair asserting the currencies of a parent and its children agree. Also replace the `as TrackingStatus` cast at `tracking.service.ts:62` with a lookup that handles the miss explicitly.

---

## DATA-012 — Current tracking status ignores corrections and has no ordering tie-break; superseded events stay authoritative and visible

- **Severity:** Medium
- **Confidence:** Confirmed (correction scenario reproduced, rolled back)
- **File:line:** `apps/api/src/modules/tracking/tracking.service.ts:47,59-60,77-83`; also `apps/api/src/modules/shipments/shipments.service.ts:56`

**Invariant violated:** "the customer-facing current status is the latest *non-superseded* event." `getByTrackingNumber` orders by `eventTime desc` and takes `visibleEvents[0]`. `TrackingEvent.correctionOfId` — the self-relation that exists specifically so a correction is a new row rather than an edit — is never read by any code in the repository.

**Reproduction (actually executed, rolled back).** Staff correct a mistaken carrier event by inserting a correction row pointing at it, with the true (earlier) event time:

```
BEFORE latest: INTERNATIONAL_TRANSIT @ 2026-08-07 02:04:05.01
-- insert correction: canonical_code EXCEPTION, correction_of_id = <that event>,
--                    event_time = event_time - 1 hour
AFTER  latest (what TrackingService picks): INTERNATIONAL_TRANSIT @ 2026-08-07 02:04:05.01
superseded events still returned to the customer: 1
```

The correction is filed, linked, and completely ignored: the event it corrects still drives the headline status, and **both** rows are returned in the customer's timeline with no indication that one has been superseded. The customer sees the retracted event and the retraction side by side, with the retracted one on top.

**Second defect — no tie-break.** `orderBy: { eventTime: "desc" }` has no secondary sort key. Carrier feeds routinely report at minute granularity, so two events sharing an `eventTime` are common. PostgreSQL gives no stable order for ties, so which event is "latest" — and therefore the status shown on the public tracking page — can change between two identical requests, depending on plan and physical row order. `id` is UUIDv7 and time-ordered, so it is available as a free deterministic tie-break and is not used.

**Third defect — three unsynchronised sources of truth for status.** The response mixes them: `status` comes from the latest tracking event (`:70`), `statusCategory` from `shipment.lifecycleStatus` (`:71`), and `Shipment.currentTrackingCode` (`schema.prisma:414`) is a third denormalised copy that no code writes or reads. Nothing keeps any pair consistent, so a shipment whose latest event is `DELIVERED` while `lifecycleStatus` is still `ACTIVE` renders as the label "Delivered" with the badge colour for "in progress".

**Note on the out-of-order case the brief asked about:** a late-arriving carrier event with an *earlier* `eventTime` sorts correctly into the timeline — ordering by `eventTime` rather than insertion order is the right choice and works. The defect is not ordering by the wrong column; it is the absent tie-break, the ignored corrections, and the divergent status sources.

**Recommended fix:** three small changes, all in the query. (1) Add `id: "desc"` as a secondary `orderBy` (also in `shipments.service.ts:56`) — UUIDv7 makes this both deterministic and chronologically sensible. (2) Exclude superseded events from both the status derivation and the customer timeline: `where: { correctedBy: { none: {} } }`, which the existing `TrackingEventCorrection` back-relation already supports. (3) Pick one authority for status. Deriving it from tracking events at read time is the honest choice given `currentTrackingCode` is unmaintained; if a denormalised copy is wanted for indexing, maintain it in the same transaction as the event insert and drop the other.

---

## DATA-013 — `generateTrackingNumber` has a 16.7-million-value space with no collision handling (currently dead code)

- **Severity:** Medium
- **Confidence:** Confirmed (dead-code status verified; collision probability computed)
- **File:line:** `apps/api/src/modules/shipments/shipments.service.ts:64-68`

**Invariant violated:** `shipments.tracking_number` is unique (twice over — `shipments_tracking_number_key` and the normalised `UPPER()` index, which is correct and good). The generator is not built to satisfy it.

```ts
const digits = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
return `NT-${digits}-US`;
```

Six hex characters = `16^6` = **16,777,216** values. By the birthday bound:

| Shipments issued | P(at least one collision) |
|---|---|
| 1,000 | 2.9 % |
| 5,000 | **52.5 %** |
| 20,000 | >99.99 % |

A coin-flip collision at ~4,800 shipments. There is no retry-on-unique-violation loop anywhere in the codebase, so the first collision surfaces as a raw P2002 — which, per DATA-016, the exception filter renders as a `500` with `retryable: true`, so a customer's booking would fail at the final step with a message inviting them to retry.

**Confirmation that it is currently unreachable:** `grep` for `shipment.create`/`shipment.update` across `apps/api/src` returns **nothing**. `ShipmentsController` exposes only `GET /v1/shipments` and `GET /v1/shipments/:id`. `generateTrackingNumber()` has no callers. **There is genuinely no way to create a Shipment through the current API** — the only writer is `packages/database/prisma/seed.ts`, which uses three hard-coded tracking numbers. The "Booking → Shipment conversion" referenced in `bookings.module.ts:10-13` and `shipments.service.ts:11-14` is entirely unimplemented, not partially. Recording as scope-not-yet-built; the finding is that the one piece of it that *was* written is not safe to call.

**Recommended fix:** widen and retry, both. Widen the space (10–12 base32 characters excluding ambiguous glyphs gives ≥10^15 and stays human-readable/dictatable, which is the constraint the short format was presumably serving), and wrap creation in a bounded retry that catches P2002 on the tracking-number constraint and regenerates — 3 attempts is ample once the space is wide. The unique index is already correct; the generator just has to respect it. Do not reach for a sequence: sequential tracking numbers reintroduce the enumeration threat that `tracking.controller.ts:11-15` and the spec explicitly call out.

---

## DATA-014 — Only claim submission produces an audit trail; every other write, including the worker's bulk state change, produces none

- **Severity:** Medium
- **Confidence:** Confirmed
- **File:line:** `apps/api/src/modules/audit/audit.module.ts:34-52`; sole call site `apps/api/src/modules/claims-returns/claims-returns.module.ts:44-54`; `apps/worker/src/jobs/retention.job.ts:18-25`

**Invariant violated:** `AuditEvent` exists, per its own docblock, for *"append-only high-risk activity"*, and CLAUDE.md requires audit for every high-risk write. Grepping `apps/api/src` for `auditService`/`AuditService` returns exactly two files: the module that defines it, and `claims-returns.module.ts`. Confirmed against live data — after exercising every write endpoint the API exposes, `audit_events` contains only `claim:submit` rows.

Writes that currently produce **zero** audit trail:

- `POST /v1/me/addresses` — `CustomersService.addAddress` (`customers.module.ts:22-25`). Personal data creation.
- `POST /v1/bookings` — `BookingsService.saveDraft` (`bookings.module.ts:22-32`).
- `POST /v1/quotes` — `QuotesService.calculate` (`quotes.service.ts:70-91`). A priced commercial offer, persisted with no actor and no audit.
- `runRetentionSweep` (`retention.job.ts:18-25`) — an unbounded `updateMany` transitioning every eligible shipment to `ARCHIVED`, on a 60-second timer, with no audit event, no actor, and no per-row record of what changed. This is the highest-risk of the set: an automated bulk lifecycle transition is exactly the "high-risk activity" the table names, and if the predicate is ever wrong there is no forensic trail of what it touched.

**What is correct here, and should be the template:** `ClaimsReturnsService.submit` opens `prisma.$transaction`, creates the claim, and passes the same `tx` into `auditService.record(input, tx)` so both commit or neither does. That is precisely the ADR-0001 §6.3 requirement, and `AuditService.record`'s optional-`tx` signature is well designed for it. The defect is coverage, not design.

**Secondary:** `AuditEvent.entityId` is `TEXT` with no FK (DATA-009), and the dev database already holds one audit row pointing at a claim that no longer exists.

**Recommended fix:** extend the existing pattern rather than adding a new mechanism — wrap the address, booking, and quote writes in `$transaction` and pass `tx` to `auditService.record`, as claims already do. For `runRetentionSweep`, replace the blind `updateMany` with a select-then-update inside a transaction that writes one audit event per archived shipment (or a single event carrying the affected ids), and add a sanity bound so an unexpectedly large sweep aborts rather than proceeding.

---

## DATA-015 — Migration 2 is not safe to apply during a rolling deployment: full-table locks and behaviour changes that break in-flight old code

- **Severity:** Medium
- **Confidence:** Confirmed by inspection (`NOT VALID` / `CONCURRENTLY` absent from all migrations)
- **File:line:** `packages/database/prisma/migrations/20260807024500_constraints_and_triggers/migration.sql:9-88` (CHECKs), `:110-139` (triggers), `:147-148` (unique index)

**Invariant violated:** during a rolling deploy, migration N+1 is applied while code from migration N is still serving traffic. Migration 2 breaks that contract in three ways. (Migration 1 is the baseline; migration 3, `20260807090808_idempotency_records`, is purely additive — new table, new indexes — and is safe.)

**(a) `ALTER TABLE … ADD CONSTRAINT … CHECK` without `NOT VALID`.** Seventeen CHECK constraints are added across `shipments`, `quotes`, `quote_lines`, `invoices`, `payments`, `packages`, and others. Each takes an `ACCESS EXCLUSIVE` lock and scans the whole table to validate before releasing it. On an empty dev database this is instant; on a production `shipments` or `tracking_events` table it blocks **all reads and writes** for the duration of the scan, and the lock request itself queues behind any open transaction while blocking every query that arrives after it. The two-phase form — `ADD CONSTRAINT … NOT VALID` (metadata-only, brief lock) followed by a separate `VALIDATE CONSTRAINT` (`SHARE UPDATE EXCLUSIVE`, concurrent with reads and writes) — is not used anywhere in the repository.

**(b) `CREATE UNIQUE INDEX` without `CONCURRENTLY`** at `:147-148`, on `shipments (UPPER(tracking_number))`. Blocks writes to `shipments` for the entire index build.

**(c) The append-only triggers change behaviour for code that is still running.** `audit_events`, `inbox_events`, `payment_events`, and `package_movements` go from writable to UPDATE/DELETE-rejecting the instant the migration commits. Any old-version pod mid-request that updates one of those tables starts failing immediately. No such code exists today, so this is latent — but it is the general hazard: the migration is a behaviour change, not just a schema addition, and the deployment order (migrate-then-deploy vs deploy-then-migrate) is not documented in `docs/decisions/0001-backend-architecture-plan.md` or any runbook. `docs/runbooks/` does not exist.

**(d) The migration's comment describes controls it does not contain.** Lines 91-101 state the migration *"revokes UPDATE/DELETE from the app role"* and revokes "from PUBLIC plus any role literally named `nauterio_app`". There is no `REVOKE` statement in any migration. A reader following the comment would believe a grant-level control is in force when only the trigger exists.

**(e) `updated_at` has no database default.** Prisma's `@updatedAt` is client-side only, so any non-Prisma writer must supply it. Encountered directly while testing: `INSERT INTO customs_cases (shipment_id) VALUES (...)` fails with `null value in column "updated_at" violates not-null constraint`. This makes raw-SQL backfills and data-repair scripts — the ordinary companions of a rolling migration — fail in a confusing way.

**Recommended fix:** rewrite the constraint additions as `NOT VALID` + `VALIDATE CONSTRAINT` in separate statements, and the unique index as `CREATE UNIQUE INDEX CONCURRENTLY` (which requires running it outside a transaction — Prisma needs the migration split or marked accordingly). Add `DEFAULT now()` to the `updated_at` columns so non-Prisma writers behave. Write the `REVOKE` statements or delete the comment claiming them. Record the required deploy ordering in `docs/runbooks/` — the repository's own "Required project records" list already calls for migration and rollback notes, and none exist.

---

## DATA-016 — Unbounded numeric input on the public quote endpoint returns 500, and permanent errors are advertised as retryable

- **Severity:** Medium
- **Confidence:** Confirmed (both reproduced against the running API)
- **File:line:** `apps/api/src/modules/quotes/dto/create-quote.dto.ts:8-12`; `apps/api/src/modules/quotes/quotes.service.ts:79`; `apps/api/src/common/filters/http-exception.filter.ts:61-69`

**Invariant violated:** validation at the trust boundary must reject inputs the downstream code cannot represent, and error classification must not tell a client to retry something that will never succeed.

**(a) Unbounded `weightKg`/`declaredValueEur` → `RangeError` → 500.** `@IsNumber() @Min(0.01)` with no `@Max` and no decimal-place limit. At `weightKg: 1e308` the intermediate overflows to `Infinity`, and `BigInt(Math.round(Infinity))` throws `RangeError: The number Infinity cannot be converted to a BigInt`:

```
POST /v1/quotes {"weightKg":1e308,"lengthCm":1,"widthCm":1,"heightCm":1,
                 "declaredValueEur":0,"service":"air-express"}
  -> HTTP 500 {"code":"INTERNAL_ERROR","retryable":true, ...}
```

This is an **unauthenticated public endpoint** (`quotes.controller.ts:16-17`, throttled to 30/min/IP) — a one-line request body produces a logged 500 with a full stack trace, from any caller.

**(b) Prisma error codes are unmapped, so client errors become retryable 5xx.** `AllExceptionsFilter` handles `HttpException` and defaults everything else to `INTERNAL_ERROR` / 500 / `retryable: true`. A foreign-key violation is a permanent client error:

```
POST /v1/claims {"shipmentId":"00000000-0000-0000-0000-00000000dead", ...}
  -> HTTP 500 {"code":"INTERNAL_ERROR","retryable":true, ...}
```

The correct answer is 404 or 422 and `retryable: false`. As written, a well-behaved client honouring `retryable` retries a request that can never succeed, indefinitely — and each retry, per DATA-003, claims and then releases an idempotency record, so the retry loop also churns rows in `idempotency_records`. The same applies to P2002 (unique violation → 409) and P2025 (record not found → 404), and to the tracking-number collision in DATA-013.

**(c) Related — unvalidated cursor.** `CursorPaginationQueryDto`'s `cursor` is passed straight into Prisma as `cursor: { id }` (`paginate-cursor.ts:24`). A cursor naming a non-existent row produces a Prisma error and, by (b), another retryable 500.

**Recommended fix:** add `@Max()` bounds to the quote DTO reflecting real shipping limits (and `@IsUUID()` to `SaveDraftDto.quoteId` and the cursor, which are currently `@IsString()`); a sane upper bound is business evidence, so mark it `REQUIRES_BUSINESS_EVIDENCE` and pick a conservative placeholder rather than leaving it unbounded. Add a Prisma-aware branch to `AllExceptionsFilter` mapping P2002 → 409, P2003 → 422, P2025 → 404, all with `retryable: false`, and set `retryable` from the error's nature rather than from `status >= 500`.

---

## DATA-017 — `TrackingEvent.dedupKey` is a nullable unique column, so events without a dedup key never deduplicate

- **Severity:** Low
- **Confidence:** Confirmed by schema inspection
- **File:line:** `packages/database/prisma/schema.prisma:532`

**Invariant violated:** "the same carrier event is recorded once." In PostgreSQL, a unique index permits unlimited `NULL`s. `dedupKey String? @unique` therefore deduplicates only those events for which a producer chooses to compute a key, and silently permits unlimited duplicates for those it does not. There is no ingestion code yet, so nothing currently sets it — meaning the constraint protects nothing today and will protect only whatever the future adapter remembers to populate.

`ExternalTrackingEvent` gets this right by contrast: `@@unique([provider, providerEventId])` on two `NOT NULL` columns (`:563`), which cannot be bypassed. The raw-payload table is better protected than the canonical one.

**Recommended fix:** make the dedup key mandatory and derived rather than optional and supplied — `@@unique([shipmentId, sourceType, sourceEventId])`, or a `NOT NULL dedupKey` computed by the ingestion adapter from `(source, sourceEventId)` with a deterministic fallback (e.g. a hash of shipment + canonical code + event time) when the carrier supplies no event id. Either way the column must be `NOT NULL` for the constraint to mean anything.

---

## DATA-018 — No aggregate money constraints: refunds can exceed the payment, allocations can exceed the payment

- **Severity:** Low today (High the day a payment handler ships)
- **Confidence:** Confirmed by schema inspection; no code exists to exercise it
- **File:line:** `packages/database/prisma/schema.prisma:928-962`

**Invariant violated:** `sum(refunds.amount) <= payment.amount` and `sum(payment_allocations.amount) <= payment.amount`. The per-row non-negativity CHECKs exist (`refunds_amount_nonneg`, `payment_allocations_amount_nonneg`) but say nothing about the aggregate. `payments`, `refunds`, and `payment_allocations` are all empty; there is no route or webhook handler for any of them, confirming the brief's scope-not-yet-built assessment.

The read-modify-write shape this invites is the classic one: read the payment, sum existing refunds, compare, insert. Two concurrent approvals of a partial refund both read the same "already refunded" total and both pass their check, over-refunding the customer. Recording now, while the tables are empty and the fix is free.

**Also noted while the tables are fresh:**

- `PaymentEvent.providerEventId` **does** carry `@@unique` (`:924`), verified in `pg_constraint` as `payment_events_provider_event_id_key`, and `payment_events` is UPDATE/DELETE-blocked by trigger. The Stripe-webhook replay defence the brief asked about is in place and correct. The one caveat: uniqueness is global rather than `(provider, providerEventId)`, so a PayPal event whose id happens to equal a Stripe event id would be rejected as a replay. `Payment` gets this right with `@@unique([provider, providerPaymentId])`; `PaymentEvent` should match.
- `Refund` has no FK to the `Invoice` or `Shipment` being refunded, and `refunds.approved_by_user_id` has no FK (DATA-009) — so the separation-of-duties rule the claims module's docblock anticipates has no referential anchor.
- `Payment` has no link to what it pays for except through `PaymentAllocation`; nothing prevents a `Payment` with zero allocations, or allocations to invoices in a different currency (DATA-011).

**Recommended fix:** when the payment handler is built, enforce the aggregate with a conditional insert rather than a read-then-check — `INSERT … SELECT … WHERE (SELECT COALESCE(SUM(amount_minor_units),0) FROM refunds WHERE payment_id = $1) + $2 <= (SELECT amount_minor_units FROM payments WHERE id = $1)`, which evaluates the predicate and the write in one statement and closes the race without a lock. Add a `refunded_amount_minor_units` column on `Payment` maintained in the same transaction with a CHECK `refunded_amount_minor_units <= amount_minor_units` if a cheaper read path is wanted. Change `PaymentEvent`'s unique to `@@unique([provider, providerEventId])` — but that requires adding a `provider` column, so do it now while the table is empty.

---

## DATA-019 — Denormalised aggregates on `Shipment` have no maintaining mechanism

- **Severity:** Low
- **Confidence:** Confirmed by inspection
- **File:line:** `packages/database/prisma/schema.prisma:394-397,419-421`

`Shipment.packageCount`, `totalActualWeightKg`, `totalVolumetricWeightKg`, `totalChargeableWeightKg`, and `outstandingAmountMinorUnits` all duplicate facts derivable from `packages`, `charges`, and `payment_allocations`. Nothing recomputes them: no trigger, no application code (there is no shipment write path at all), no reconciliation job. `outstandingAmountMinorUnits` in particular is the number a customer would be chased for.

The CHECK constraints guard the columns' *range* (`>= 0`, `package_count > 0`) but not their *agreement* with the rows they summarise, so a shipment can hold `package_count = 3` with five `packages` rows and the database is satisfied.

**Recommended fix:** decide per column. Where the aggregate is cheap to derive (`packageCount`, the weight totals over a handful of packages), drop the column and compute on read. Where a stored value is genuinely needed for indexing or invoicing (`outstandingAmountMinorUnits`), maintain it inside the same transaction as every charge/allocation write, and add a periodic reconciliation check that alerts on divergence rather than silently repairing.

---

## Priority-flow coverage

| Priority flow | Verdict | Basis |
|---|---|---|
| **Unique tracking number creation** | **PARTIAL** | The database side is correct and verified: `shipments_tracking_number_key` plus the normalised `UPPER()` unique index. The generator is not: `16^6` space, ~50 % collision at 4,800 shipments, no retry-on-P2002 (DATA-013). Currently unreachable — there is no shipment-creation path in the API at all, confirmed by grep and by `ShipmentsController` exposing only two GET routes. |
| **Quote snapshot immutability** | **PARTIAL** | Nested `create` of quote + lines verified genuinely atomic under Prisma 7's driver adapter (forced child CHECK violation rolled the parent back). But quotes are not immutable — no trigger prevents UPDATE — and there is no constraint that the total matches the lines or that currencies agree (DATA-010, DATA-011). Persisted quotes carry no `userId`, so a snapshot cannot be attributed to a requester, and the quote id is never returned to the caller. |
| **Payment / invoice / shipment activation** | **NOT VERIFIED** — not implemented | `Payment`, `PaymentEvent`, `PaymentAllocation`, `Refund` tables exist and are empty; the only billing route is `GET /v1/invoices/:id`. No shipment write path exists, so "payment-gated activation" has neither a producer nor a gate. Schema-level gaps recorded now: DATA-018 (aggregate money constraints), DATA-011 (currency agreement), DATA-009 (`shipments.quote_id` unconstrained). Positive note: `PaymentEvent.providerEventId` is unique and the table is append-only — the webhook-replay defence is ready for the handler. |
| **Refund / claim settlement** | **FAIL** | Claim submission accepts any `shipmentId` from any authenticated user, with no ownership check, no lifecycle-state guard, and no de-duplication — four identical claims against one shipment accepted in sequence (DATA-006). `ClaimDecision`/`Refund` settlement is unimplemented, and `sum(refunds) <= payment.amount` is unenforceable at the database (DATA-018). The one thing done correctly is claim + audit atomicity. |
| **Tracking event append / correction** | **FAIL** | `tracking_events` UPDATE is not blocked — `canonical_code`, `public_title_en`, and `event_time` were all rewritten in place with no error (DATA-008), directly against CLAUDE.md's append-only rule. `correction_of_id` is never read, so a filed correction does not supersede anything: the corrected event still drives current status and both rows are shown to the customer (DATA-012). No CHECK on `canonical_code` despite a schema comment asserting one (DATA-011). `dedup_key` is nullable-unique and therefore inert (DATA-017). |
| **Outbox / queue delivery** | **FAIL** | No producer exists anywhere in the API — `outbox_events` is empty after exercising every write endpoint, and `grep` finds no `outboxEvent.create` (DATA-004). The relay has no claim step, so multiple replicas publish duplicates; retries are unbounded with no backoff or DLQ; rows are marked `PUBLISHED` before the consumer runs, so handler failures lose the event silently. The consumer's inbox check is check-then-act, so a duplicate delivery sends the email twice (DATA-005). |
| **Idempotency enforcement** | **FAIL** | The unique constraint does its narrow job — 10 concurrent same-key requests produced exactly one `201`, nine `409`s, and one row, so the concurrent double-create window is genuinely closed. Everything around it fails: keys are global across users, so a collision returns another user's record and discards the caller's write (DATA-001, reproduced); `expires_at` is never read and no sweeper exists, so 400-day-old receipts still replay (DATA-002); a crash between commit and the fire-and-forget `update()` bricks a key permanently with 409s (DATA-002); and the error path deletes the claim even when the business transaction committed, enabling duplicate side effects on retry (DATA-003). |

---

## Summary

Nineteen findings: **1 Critical, 7 High, 8 Medium, 3 Low**.

The critical one is DATA-001 — idempotency keys share a single global namespace across all users, so a key collision returns one user's persisted record to another and silently discards the second user's write. This was reproduced end to end: a second account posting the same `Idempotency-Key` received `HTTP 201` carrying the first user's address row, `userId` included, while its own record was never created. It is one defect producing both cross-tenant disclosure and silent data loss, on endpoints reachable with a plain customer token, and it fires on ordinary key reuse rather than requiring an attacker. The fix is small — put the principal in the unique constraint and compare `userId` before replaying.

The dominant theme across the rest is a consistent gap between what the schema and its comments assert and what the database actually enforces. `Shipment.version`, `User.version`, `Organisation.version`, and `Invoice.version` are never read or incremented by any code — the header comment describes a `WHERE version = $expected` guard that does not exist (DATA-007). `schema.prisma` states that a CHECK constraint mirrors the tracking-status enum; `pg_constraint` has no such constraint, and arbitrary status codes insert cleanly (DATA-011). The constraints migration's own header says it revokes UPDATE/DELETE from the application role; no `REVOKE` statement exists anywhere (DATA-008/DATA-015). `tracking_events` is documented as append-only and is not — a full rewrite of a customer-facing event's code, title, and timestamp succeeded without error (DATA-008). `IdempotencyRecord.expiresAt` is written, indexed, and never read (DATA-002). Thirty-one reference columns, including `shipments.quote_id` and both sides of the shipment↔customs-case link, carry no foreign key (DATA-009). A reviewer trusting these comments would build on protections that are not there — which is the practical risk, given how much of the system is still to be written.

Three areas are genuinely well built and worth preserving as templates: the `(scope, key)` unique constraint really does close the concurrent double-create window (10 parallel requests → one `201`, nine `409`s, one row); `ClaimsReturnsService.submit` correctly commits the business change and its audit event in one transaction via `AuditService.record(input, tx)`; and `PaymentEvent` combines a unique `providerEventId` with an append-only trigger, so the Stripe webhook-replay defence is ready before the handler that needs it. Prisma 7's nested `create` was verified empirically to be atomic under the driver adapter, so the quote-plus-lines write needs no change.

Much of what is listed as FAIL above is unbuilt rather than broken — there is no way to create a shipment, no payment handler, and nothing that writes an outbox row. Those are recorded as scope-not-yet-built. The findings that matter most are the ones that would be inherited by the code written next: the idempotency namespace, the unenforced append-only guarantee on tracking, the dead `version` columns, the missing foreign keys on the quote and customs links, and float-based money arithmetic that already under-charges by a cent at ordinary parcel weights (`weightKg: 0.17` → `3610` minor units where `3611` is exact).

---

## Verification environment and test residue

- PostgreSQL 18.4 (Homebrew), database `nauterio_dev`, reached with the `DATABASE_URL` from `packages/database/.env`.
- Dev API booted from `apps/api/dist/main.js` on port 3333, `NODE_ENV=development`, stopped after testing.
- All schema-level probes (orphan FK inserts, `tracking_events` UPDATE, currency and quote-total violations, the correction/ordering scenario) ran inside explicit transactions and were **rolled back**.
- API-level probes created rows that were deleted afterwards: 2 `addresses`, 6 `idempotency_records`, 1 `quotes`.
- **Left in place, deliberately:** 4 `claims` rows with `description = 'AUDIT TEST claim - unowned shipment'` on shipment `019fdad2-542b-7e99-ba70-1941332b3fc0`. Deleting them would strand their 4 `audit_events` rows, which the append-only trigger makes permanent — creating exactly the dangling-audit condition described in DATA-009. Leaving the claims keeps the dev database self-consistent. Remove them together with a schema-level cleanup if the dev data is reset.
- One pre-existing dangling `audit_events` row (`019fdb83-014a-…`, 09:17, entity `019fdb83-00cc-…`) was present before this audit began and points at a claim that no longer exists.

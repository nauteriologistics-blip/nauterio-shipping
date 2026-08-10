# Backend Audit — Evidence Log

Concrete commands and outputs from this remediation session proving each fix works, not just that the code compiles. Organized by finding. Local Postgres (`nauterio_dev`), local API on port 4000, `verify-*`/`secaudit-*`/`local-*-user-id` are pre-seeded dev fixtures from `packages/database/prisma/seed.ts` and the earlier audit phase, not real users.

**Covers the first remediation pass only.** A second pass produced its own live evidence for SEC-007's residual, SEC-008's trust-proxy fix (13-distinct-IP and same-IP repros), SEC-011's full erasure flow against a user with real audit history, DATA-011(b)'s currency-format repro, DATA-014's quote/retention-sweep audit events, REL-011's structured-log output (API and worker), and REL-015's quote-expiry sweep — summarized in each finding's row in `BACKEND_AUDIT_VERIFICATION.md` rather than reproduced verbatim here.

## DATA-010 — Float-arithmetic under-charge

Unit suite, unmodified assertions, passing against the rewritten integer-arithmetic implementation:

```
PASS src/modules/quotes/quotes.service.spec.ts
  QuotesService
    ✓ calculates the base rate as flat fee + chargeable weight * per-kg rate
    ✓ always marks the result as indicative with a disclaimer
    ✓ applies the customs fee only when addCustoms is true
    ✓ flags de minimis eligibility at the $800 threshold
    ✓ rejects an unknown service id
    ✓ persists a quote snapshot for every calculation
    ✓ uses volumetric weight when it exceeds actual weight
Tests: 7 passed, 7 total
```

Live repro of the audit's exact failing case (`weightKg: 0.17` previously stored `3610`, `3611` is exact):

```
$ curl -s -X POST http://localhost:4000/v1/quotes -H "Content-Type: application/json" \
    -d '{"weightKg":0.17,"lengthCm":1,"widthCm":1,"heightCm":1,"declaredValueEur":0,"service":"air-express"}'
{"totalPriceEur":36.11, ...}

$ psql nauterio_dev -c "SELECT total_amount_minor_units FROM quotes ORDER BY created_at DESC LIMIT 1;"
 total_amount_minor_units
--------------------------
                     3611
```

`quote_lines` sum matches the total by construction:

```
$ psql nauterio_dev -c "SELECT label, amount_minor_units FROM quote_lines WHERE quote_id = '...';"
     label      | amount_minor_units
-----------------+--------------------
 Freight charge |               3611
```

The €113 (12kg, air-express) example from the spec also persists exact:

```
$ curl ... -d '{"weightKg":12,"lengthCm":10,"widthCm":10,"heightCm":10,"declaredValueEur":0,"service":"air-express"}'
{"baseRateEur":113,"totalPriceEur":113, ...}
```

## DATA-008 / DATA-011(a) — Tracking append-only + CHECK constraint

Re-ran the audit's own repro SQL after applying migration `20260809120500_tracking_integrity_and_indexes`:

```sql
-- DATA-008 repro
BEGIN;
UPDATE tracking_events SET canonical_code = 'AUDIT_TEST_TAMPER', public_title_en = 'TAMPERED',
       event_time = event_time - interval '5 days' WHERE id = (SELECT id FROM tracking_events LIMIT 1);
-- ERROR:  tracking_events is append-only: UPDATE is not permitted. Insert a correction row instead.
ROLLBACK;

-- DATA-011(a) repro
BEGIN;
INSERT INTO tracking_events (shipment_id, canonical_code, public_title_en, public_title_it, source_type, event_time)
SELECT id, 'NOT_A_REAL_STATUS_AUDIT_TEST', 'x','x','CARRIER_API', now() FROM shipments LIMIT 1;
-- ERROR:  new row for relation "tracking_events" violates check constraint "tracking_events_canonical_code_valid"
ROLLBACK;

-- Control: a legitimate status still inserts fine
BEGIN;
INSERT INTO tracking_events (...) SELECT id, 'DEPARTED_ORIGIN', ... FROM shipments LIMIT 1;
-- INSERT 0 1
ROLLBACK;
```

Both attacks now fail with the correct error; the legitimate case is unaffected. Applying this migration also surfaced one piece of labeled test residue from the earlier live-audit phase — a `canonical_code = 'CUSTOMS_HOLD'` row tagged `'SECAUDIT internal probe'` — which violated the new CHECK constraint (the code has no matching status; `CUSTOMS_HELD` is the real one). It was removed from the local dev database (not production, no real customer data) by briefly disabling the trigger, deleting the single labeled row, and re-enabling it, so the migration could apply cleanly.

## REL-009 / REL-016 — New indexes

```
$ psql nauterio_dev -c "SELECT indexname, tablename FROM pg_indexes WHERE indexname IN
    ('shipments_organisation_id_id_idx','shipments_owner_user_id_id_idx',
     'notifications_user_id_id_idx','delivery_attempts_notification_id_attempted_at_idx',
     'shipments_retention_sweep_idx');"
                     indexname                      |     tablename
----------------------------------------------------+-------------------
 delivery_attempts_notification_id_attempted_at_idx | delivery_attempts
 shipments_organisation_id_id_idx                   | shipments
 shipments_owner_user_id_id_idx                     | shipments
 notifications_user_id_id_idx                       | notifications
 shipments_retention_sweep_idx                      | shipments
(5 rows)
```

## DATA-013 / REL-018 — Tracking number generator entropy

Jest test exercising the rewritten generator against the real database (temporary, removed after verification):

```
✓ generates well-formed, unique, DB-verified tracking numbers (116 ms)
```

20 numbers generated, each matching `^NT-[0-9A-HJKMNP-TV-Z]{10}-US$` (Crockford base32, ambiguous characters excluded) and checked unique via `findUnique` against the real `shipments` table before being accepted.

## SEC-013 — Malformed UUID path parameters

Before this pass's `ParseUUIDPipe` additions, these three routes had none. After:

```
$ curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer verify-customer" http://localhost:4000/v1/bookings/not-a-uuid
{"code":"BAD_REQUEST","message":"Validation failed (uuid is expected)","retryable":false}
HTTP 400

$ curl ... http://localhost:4000/v1/claims/not-a-uuid
{"code":"BAD_REQUEST", ..., "retryable":false}
HTTP 400

$ curl -X DELETE ... http://localhost:4000/v1/me/addresses/not-a-uuid
{"code":"BAD_REQUEST", ..., "retryable":false}
HTTP 400

# Control: a well-formed but nonexistent id still 404s cleanly, not 400
$ curl ... http://localhost:4000/v1/bookings/00000000-0000-7000-8000-000000000000
{"code":"NOT_FOUND","message":"Booking ... not found","retryable":false}
HTTP 404
```

## SEC-014 — Correlation-ID validation

```
$ curl -s -i -H "Authorization: Bearer verify-customer" \
    -H 'x-correlation-id: <script>alert(1)</script>||malicious`payload' \
    http://localhost:4000/v1/bookings/not-a-uuid | grep -i x-correlation-id
x-correlation-id: 58ab3254-c41f-4e3a-aed6-794dd2fd8365      # replaced with a generated UUID

$ curl -s -i -H "Authorization: Bearer verify-customer" -H "x-correlation-id: partner-trace-abc123" \
    http://localhost:4000/v1/bookings/not-a-uuid | grep -i x-correlation-id
x-correlation-id: partner-trace-abc123                       # well-formed value honoured verbatim
```

## DATA-016(b) — Prisma error mapping

Direct unit exercise of `AllExceptionsFilter.catch()` against real `Prisma.PrismaClientKnownRequestError` instances (temporary test, removed after verification):

```
✓ maps Prisma P2002 to HTTP 409 retryable:false
✓ maps Prisma P2003 to HTTP 422 retryable:false
✓ maps Prisma P2023 to HTTP 400 retryable:false
✓ maps Prisma P2025 to HTTP 404 retryable:false
✓ falls back to 500 retryable:true for a truly unknown error
```

The log output during this test also confirmed the secondary fix: the four mapped-to-4xx cases produced no `[AllExceptionsFilter] ERROR` log line, while the one genuinely-unknown 500 case did — closing SEC-013's "every malformed request floods the error log at ERROR level" complaint for these paths.

## REL-019 — Lint

Before: neither app had an `eslint.config.*`; `eslint` would have exited non-zero with "couldn't find an eslint.config file" (not independently reproduced pre-fix in this session, since the fix was applied directly — the absence of any config file was confirmed by `find` before writing one).

After, with the shared root config in place:

```
$ pnpm --filter @nauterio/api lint
$ eslint "{src,test}/**/*.ts"
   (no output — clean)

$ pnpm --filter @nauterio/worker lint
$ eslint "src/**/*.ts"
   (no output — clean)

$ pnpm -r lint
   apps/admin lint: 1 warning (pre-existing, unrelated to this pass)
   apps/web lint: 4 warnings (pre-existing, unrelated to this pass)
   apps/worker lint: Done
   apps/api lint: Done
```

`pnpm -r lint` now exits 0 for the whole workspace, closing the "CI lint-and-typecheck job cannot have passed" root cause.

## Worker graceful shutdown (`main.ts` refactor for REL-019's `require-await`/`no-misused-promises`)

The `main()` function's `async` keyword was removed (it had no `await` in its own body — all async work happens in event-driven callbacks) and the SIGTERM/SIGINT handlers were changed from `process.on("SIGTERM", shutdown)` to `process.on("SIGTERM", () => void shutdown())`. Verified this is still behaviorally correct, not just type-correct:

```
$ npx tsx src/main.ts &
Nauterio worker started: outbox relay + notifications-email consumer + retention sweep + idempotency cleanup.

$ kill -TERM <pid>
$ # process exited cleanly, confirmed via `kill -0` failing afterward
Process exited cleanly after SIGTERM
```

## API boot after `main.ts` bootstrap changes

Confirmed the API still boots cleanly after the SEC-007 fail-fast check, the `Prisma` import in the exception filter, and the `bootstrap().catch(...)` restructuring:

```
$ pnpm start:dev
[Nest] Nest application successfully started
Nauterio API listening on port 4000 (development)

$ curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/v1/health
200
```

## Full-suite results after each phase

`pnpm -r typecheck` and `pnpm -r test` were run to a clean state after every task in this pass (29 through 39), not only at the end. Final state:

```
$ pnpm -r typecheck
  (13/13 workspace projects: Done, zero errors)

$ pnpm -r test
  packages/validation: 2 test files, 16 tests passed
  apps/api: 6 test suites, 18 tests passed
```

One pre-existing test required a fixture correction, disclosed rather than silently patched: `permission-evaluator.test.ts`'s "enforces separation of duties" case had only been passing because of the approval-limit truthiness bug this pass fixed (a missing limit used to be treated as unlimited, so execution skipped past the approval-limit check to reach the separation-of-duties check by accident). The fixture now sets an explicit sufficient limit so the test exercises the check it claims to.

## Earlier phase of this session (pre-compaction; summarized, not re-run in this evidence pass)

The following were live-verified earlier in this same session, before the conversation was summarized for context — included here for completeness since they're part of the same remediation effort, but their command transcripts are not reproduced verbatim in this document:

- SEC-002/SEC-003: a `verify-customer` bearer token against `/v1/admin/reports/operational-summary` returned 403 after the permission-baseline fix (previously 200).
- A follow-on live-test finding, not in the original audit, was caught this way: `/v1/admin/warehouses` remained reachable by a customer token even after the SEC-002 fix, because the route used `shipment:read` (now legitimately in the customer baseline) instead of a staff-only action — fixed by adding a dedicated `warehouse:read` action.
- `npx cdk synth` succeeded across all 6 CDK stacks after the WAF-scope and RDS-credentials-secret-encryption-key fixes (the latter resolved a `DependencyCycle` between the Data and Compute stacks).

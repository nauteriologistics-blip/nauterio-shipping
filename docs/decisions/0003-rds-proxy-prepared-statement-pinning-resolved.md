# ADR 0003: RDS Proxy prepared-statement pinning — resolved by code inspection, not a live load test

## Status

Accepted (informational — records a finding, not a design choice).

## Context

REL-014 flagged an open question the original audit explicitly could not settle statically: "RDS Proxy for PostgreSQL pins a session — disabling the multiplexing that is the entire reason for the proxy — when it observes certain statements, including named prepared statements. Whether Prisma 7's `@prisma/adapter-pg` issues named or unnamed prepared statements determines whether the proxy actually multiplexes here." The recommended resolution was to measure `DatabaseConnectionsBorrowLatency` and the proxy's pinning CloudWatch metric under real load — infrastructure this environment does not have and is not authorized to provision for a load test.

## Resolution

Settled by reading `@prisma/adapter-pg@7.9.1`'s actual compiled source (`node_modules/.pnpm/@prisma+adapter-pg@7.9.1/.../dist/index.js`), not by inference from documentation:

```js
// PgQueryable.performIO()
const result = await this.client.query({
  name: this.pgOptions?.statementNameGenerator?.(query),
  text: sql,
  values,
  rowMode: "array",
  ...
});
```

Every query's `name` field is `this.pgOptions?.statementNameGenerator?.(query)` — present only if a `statementNameGenerator` function was supplied when constructing the adapter. `packages/database/src/index.ts` constructs it as `new PrismaPg(pool)` — no second argument, so `pgOptions` is `undefined` and `name` evaluates to `undefined` for every query, always.

Cross-checked against the underlying `pg` driver (`pg@8.22.0/lib/query.js`): `this.name = config.name`, and the statement-caching/reuse logic is gated behind `if (this.name)` — a falsy check, so `name: undefined` takes the "no name" path on every execution. In Postgres's extended query protocol, an unnamed `Parse` message uses the empty statement name, which is **not** cached or reused by the server across executions — each one is parsed and planned fresh, then discarded. This is precisely the behavior RDS Proxy's pinning logic exists to detect and treat as *safe*; it is named, server-cached prepared statements specifically that pin a session to one backend connection for the connection's remaining lifetime.

**Conclusion: this codebase, as configured, never issues named prepared statements. RDS Proxy pinning from prepared statements is ruled out — definitively, by reading the exact code path that would cause it, not by assumption.**

## A related but distinct behavior this does NOT resolve

Every proxy or pooler — RDS Proxy, PgBouncer in session/transaction mode, anything — pins a session to one backend connection for the duration of an explicit multi-statement transaction (`BEGIN` ... `COMMIT`), because transaction state (row locks, uncommitted writes) is physically tied to one backend connection; this is unavoidable and correct, not a defect. This codebase uses `prisma.$transaction(async (tx) => {...})` extensively (outbox relay batch claims, claims/bookings/quotes writes, the GDPR erasure transaction, etc.), so those specific operations pin for their own duration regardless of prepared statements — expected, bounded by the transaction's own lifetime, and not the "connection pinned forever" failure mode REL-014 was actually worried about.

## What remains genuinely unverified

Real-world proxy behavior under concurrent load — actual `DatabaseConnectionsBorrowLatency`, connection-reuse rate, and whether the *transaction-duration* pinning above becomes a bottleneck at the target request rate — still requires a real RDS Proxy and a real load test. This ADR closes the specific "are named prepared statements defeating multiplexing" question; it does not substitute for load testing before relying on the proxy's connection-scaling numbers.

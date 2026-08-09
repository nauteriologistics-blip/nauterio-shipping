# Nauterio Logistics — Backend Application Security Audit (DRAFT)

**Scope:** `apps/api`, `apps/worker`, `packages/validation`, `packages/database`, `packages/integrations`, `packages/configuration`, `infra/cdk` (read-only review), `apps/admin` (auth surface only).
**Method:** Full route enumeration, controller → guard → service → Prisma trace for every route, plus live exploitation against a locally-booted API (`NODE_ENV=development` and `NODE_ENV=staging`) at `http://localhost:4000` against `postgresql://codelord01@localhost:5432/nauterio_dev` using purpose-seeded `SECAUDIT` fixtures.
**Date:** 2026-08-07
**Status:** DRAFT — not yet triaged with the engineering owner.

> **Reproduction convention.** In local/dev mode `AuthGuard` treats the bearer token verbatim as the caller's `cognito_sub`. All transcripts below use two seeded **plain CUSTOMER** accounts (`staff_role = NULL`, `status = ACTIVE`):
> - `secaudit-attacker` — no organisation membership, owns nothing.
> - `secaudit-victim` — member of "SECAUDIT Victim Org SRL", owns shipment `NT-SECAUD1-US`, one invoice, one identity document.
>
> Every request shown was issued as `secaudit-attacker`. No staff token was used anywhere in Findings SEC-001 through SEC-006.

---

## Findings summary

| ID | Title | Severity | Confidence |
|----|-------|----------|------------|
| SEC-001 | Every organisation's API client and webhook records readable by any authenticated user, regardless of path parameter | Critical | High |
| SEC-002 | Permission evaluator grants **every** declared permission to **every** non-staff role — staff-only admin endpoints open to customers | Critical | High |
| SEC-003 | Broken object-level authorization on six record-read routes (cross-customer shipments, invoices, documents, customs, pickups, organisations) | High | High |
| SEC-004 | Claims can be submitted against any shipment ID, including other customers' shipments | High | High |
| SEC-005 | `Idempotency-Key` namespace is global, not per-caller: cross-user response replay, silent write suppression, key-squatting DoS | High | High |
| SEC-006 | SUSPENDED and CLOSED accounts retain full read **and write** access to 12 of 19 routes | High | High |
| SEC-007 | Dev auth passthrough and Swagger UI are active in `staging` — full identity impersonation in any non-`production` environment | High | High |
| SEC-008 | Rate limiting is ineffective as deployed: no `trust proxy`, in-memory per-instance storage | Medium | High |
| SEC-009 | `PermissionGuard` fails open when a route omits `@RequirePermission` | Medium | High |
| SEC-010 | Fail-open defaults inside `evaluatePermission` (warehouse scope, approval limit) | Medium | High |
| SEC-011 | `ON DELETE SET NULL` on `audit_events.actor_user_id` + append-only trigger makes user erasure permanently impossible | Medium | High |
| SEC-012 | No audit trail for most state-changing operations | Medium | High |
| SEC-013 | Unvalidated UUID path parameters produce HTTP 500 instead of 400/404 | Low | High |
| SEC-014 | Attacker-controlled, unvalidated correlation ID reflected in responses and persisted into the append-only audit log | Low | High |
| SEC-015 | Admin bearer token stored in `localStorage`; no staff-role gate on the admin surface | Low | High |
| SEC-016 | Dependency advisories (informational characterization) | Low | High |

**Totals: 2 Critical, 5 High, 5 Medium, 4 Low.**

---

## SEC-001 — Every organisation's API client and webhook records readable by any authenticated user, regardless of path parameter

**Severity:** Critical
**Confidence:** High
**File:line:**
- `apps/api/src/modules/integrations/integrations.module.ts:29-32` (handler, missing `@Param` and missing `@RequirePermission`)
- `apps/api/src/modules/integrations/integrations.module.ts:16-19` (service, `where: { organisationId }`)
- `apps/api/src/common/guards/permission.guard.ts:19-20` (guard returns `true` when no permission is declared)

**Actor & preconditions:** Any authenticated user. A plain `CUSTOMER` with no organisation membership, no staff role, and no relationship to any tenant is sufficient. No knowledge of any organisation ID is required.

**Attack path:**

The route handler is declared as:

```ts
@Get()
async list(organisationId: string) {
  return this.service.listApiClients(organisationId);
}
```

`organisationId` carries **no parameter decorator**. NestJS resolves undecorated route-handler parameters to `undefined`. The value is passed straight into:

```ts
return prisma.apiClient.findMany({ where: { organisationId }, include: { webhookEndpoints: true } });
```

Prisma treats `{ organisationId: undefined }` as *filter omitted*, not *filter on NULL*. The `where` clause collapses to `{}` and the query becomes an unfiltered `SELECT * FROM api_clients` with every child `webhook_endpoints` row joined in. The URL's `:organisationId` segment is decorative — it is never read.

The controller does carry `@UseGuards(AuthGuard, PermissionGuard)`, but the handler declares no `@RequirePermission()`, so `PermissionGuard.canActivate` returns `true` at line 20 before evaluating anything. `AuthGuard` alone applies, which only proves the caller has *an* account.

**Impact:** Complete cross-tenant disclosure of the partner-integration identity layer for every organisation on the platform: client names, granted `scopes`, active flags, every registered webhook endpoint URL (typically an internal/partner-side host that is not otherwise public), each endpoint's subscribed `eventTypes`, and each endpoint's `hashedSecret`. The secret is stored hashed rather than in plaintext, which prevents immediate signature forgery, but the disclosure still hands an attacker (a) a complete tenant census, (b) internal endpoint URLs to attack directly, (c) offline cracking material for weak webhook secrets, and (d) the scope inventory needed to plan abuse of the partner API once it ships. This is broad, unbounded, cross-tenant compromise available to anyone who can register an account.

**Root cause:** Two independent defenses both absent on the same handler. (1) The missing `@Param("organisationId")` decorator silently converts a scoping filter into no filter — TypeScript cannot catch this because `undefined` is assignable through Prisma's optional-filter typing. (2) The absent `@RequirePermission()` makes the attached `PermissionGuard` inert (see SEC-009).

**Reproduction / proof:**

```console
$ curl -s -H "Authorization: Bearer secaudit-attacker" \
    http://localhost:4000/v1/business/organisations/00000000-0000-0000-0000-000000000000/api-clients
HTTP 200
[{"id":"019fdba9-f25e-7dd9-90b9-9722b218bcd8",
  "organisationId":"019fdba9-f1dd-7203-a9fb-8af057c06bee",
  "name":"SECAUDIT Victim Partner Client",
  "scopes":["shipment:read","shipment:create"],
  "active":true,
  "createdAt":"2026-08-07T09:59:35.643Z",
  "webhookEndpoints":[
    {"id":"019fdba9-f29c-75c3-a7e5-9c4045b24d06",
     "apiClientId":"019fdba9-f25e-7dd9-90b9-9722b218bcd8",
     "url":"https://secaudit-victim-internal.example.test/hooks/nauterio",
     "hashedSecret":"secaudit-hashed-secret-0001",
     "eventTypes":["shipment.created","shipment.delivered"],
     "active":true, ...}]}]
```

Note the path segment is the all-zeros UUID — an organisation that does not exist — and the caller is a customer with **no** organisation membership. The response is another tenant's record. The correct response is `403` (or `404`).

**Recommended fix:**
1. Add `@Param("organisationId", ParseUUIDPipe) organisationId: string`.
2. Add `@RequirePermission(...)` to the handler.
3. In the service, verify the caller has an ACTIVE `OrganisationMember` row for that `organisationId` (or is staff) **before** querying, and pass the caller context in rather than trusting the path.
4. Add a lint rule (`eslint-plugin-@darraghor/nestjs-typed`'s `api-method-should-specify-api-response` family, or a custom rule) that fails CI on any controller-method parameter lacking a Nest parameter decorator.
5. Never `include` `hashedSecret` in an API response — select explicit fields.

**Standards mapping:** OWASP API Security Top 10 2023 **API1:2023 Broken Object Level Authorization** and **API3:2023 Broken Object Property Level Authorization**; OWASP ASVS 5.0 V8.1 (general data protection), V4.2.1 (object-level access control at the trust boundary).

---

## SEC-002 — Permission evaluator grants every declared permission to every non-staff role

**Severity:** Critical
**Confidence:** High
**File:line:**
- `packages/validation/src/permission-evaluator.ts:58-67` (the `else` branch that checks nothing for non-staff roles)
- `packages/validation/src/permission-evaluator.ts:82-84` (the record-relationship check that is supposed to compensate)
- `apps/api/src/common/guards/permission.guard.ts:28-38` (the only production caller — never supplies `recordOwnerUserId`)

**Actor & preconditions:** Any authenticated user whose `staffRole` is `NULL` (i.e. any customer) with `status = ACTIVE`.

**Attack path:**

`evaluatePermission` is documented as "the ONE place" the spec-27.3 authorization chain is implemented. Step 2 branches on role:

```ts
const isStaff = (STAFF_ROLES as readonly string[]).includes(ctx.role);
if (isStaff) {
  const allowedActions = ROLE_BASELINE_ACTIONS[ctx.role as (typeof STAFF_ROLES)[number]];
  if (!allowedActions.includes(req.action)) {
    return deny(`Role ${ctx.role} does not include action ${req.action}`);
  }
} else {
  // Customer/organisation roles only ever act on their own records -
  // enforced below by the relationship check, not by a baseline action list.
}
```

Non-staff roles are deliberately exempted from any action allowlist, on the stated assumption that step 5 will catch them:

```ts
// 5. Record relationship (customer acting on their own record)
if (!isStaff && req.recordOwnerUserId && req.recordOwnerUserId !== ctx.userId) {
  return deny("Caller does not own this record");
}
```

But `PermissionGuard` — the sole production caller — constructs the request object as `{ action: action as never }`. It never supplies `recordOwnerUserId`, and structurally it cannot: the guard runs before the handler has loaded any record. `req.recordOwnerUserId` is therefore always `undefined`, the `&&` short-circuits, and step 5 never fires.

Net effect: for a customer, the evaluation chain reduces to a single check — `accountStatus === "ACTIVE"` — after which **every** `PermissionAction` in the catalogue is granted, including `staff:manage`, `refund:approve`, `identity_document:view`, `customer_pii:view`, and `data:export`. Staff roles are correctly constrained; ordinary customers are not constrained at all. The authorization model is inverted.

The unit tests in `packages/validation/src/permission-evaluator.test.ts:34-49` appear to cover this ("denies a customer acting on a record they do not own"), but every one of those cases passes `recordOwnerUserId` explicitly — an input the real caller never provides. The suite is green and the control is inert.

**Impact:** Every current and future route protected by `@RequirePermission` is open to any customer. Today that is two staff-only administrative endpoints. The severity is Critical not because of today's two endpoints but because the single mechanism the codebase relies on to gate all staff functionality does not work for the largest user population, and every staff route added on top of it will inherit the hole silently. Any future `POST /v1/admin/refunds` guarded by `@RequirePermission("refund:approve")` would be callable by any registered customer on the day it merges.

**Reproduction / proof:**

```console
# Caller is a plain CUSTOMER: staffRole = null
$ curl -s -H "Authorization: Bearer secaudit-attacker" http://localhost:4000/v1/me
{"id":"019fdba9-f1db-...","email":"secaudit-attacker@example.test","status":"ACTIVE","staffRole":null}

# Route: @RequirePermission("data:export") — granted only to SUPER_ADMIN/OPERATIONS/CUSTOMS
$ curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer secaudit-attacker" \
    http://localhost:4000/v1/admin/reports/operational-summary
{"activeShipments":2,"actionRequired":1,"openClaims":0}
HTTP 200

# Route: @RequirePermission("shipment:read") on an /admin/ surface
$ curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer secaudit-attacker" \
    http://localhost:4000/v1/admin/warehouses
[{"id":"00000000-0000-7000-8000-000000000001","name":"Nauterio Hub Milan",
  "countryCode":"IT","city":"Milano","active":true}]
HTTP 200
```

Both should be `403`.

**Root cause:** A layering error. The permission chain was designed to require record context (`recordOwnerUserId`, `recordOrganisationId`, `recordWarehouseId`, `requestedAmountMinorUnits`), but it is invoked from a guard that by definition runs before records are loaded. The design and the call site are incompatible, and the incompatibility fails open rather than closed.

**Recommended fix:**
1. **Immediately:** give customer roles an explicit baseline action allowlist in `ROLE_BASELINE_ACTIONS` (e.g. `CUSTOMER: ["shipment:read"]`) and apply it in the `else` branch, so a customer can never be granted `staff:manage` or `data:export` no matter what record context is missing. This alone closes the live exposure.
2. **Structurally:** split the chain in two. A route-entry check (identity, account status, role baseline) belongs in `PermissionGuard`. A record-scope check (ownership, organisation, warehouse, approval limit, separation of duties) must be a **mandatory** service-layer call made after the record is loaded — e.g. `assertCanAccessRecord(ctx, { recordOwnerUserId, recordOrganisationId })` — that throws when the caller is non-staff and no record context was supplied.
3. Make the record-scope function throw on `recordOwnerUserId === undefined` for non-staff callers rather than silently allowing, so the fail mode is closed.
4. Rewrite the unit tests to include a case that mirrors the real guard's call shape (`{ action }` only) and asserts denial for a customer.

**Standards mapping:** OWASP API Security Top 10 2023 **API5:2023 Broken Function Level Authorization**; OWASP ASVS 5.0 V4.1.3 (principle of least privilege), V4.1.5 (access control fails securely).

---

## SEC-003 — Broken object-level authorization on six record-read routes

**Severity:** High
**Confidence:** High
**File:line:**
- `apps/api/src/modules/shipments/shipments.service.ts:52-62` (`getById` — `findUnique({ where: { id } })`, no scope)
- `apps/api/src/modules/billing/billing.module.ts:16-20` (`getInvoiceById`)
- `apps/api/src/modules/documents/documents.module.ts:16-20` (`getById`)
- `apps/api/src/modules/customs/customs.module.ts:13-18` (`getCaseByShipment`)
- `apps/api/src/modules/pickup-delivery/pickup-delivery.module.ts:12-19` (`listByShipment`)
- `apps/api/src/modules/organisations/organisations.module.ts:17-24` (`getById`)

**Actor & preconditions:** Any authenticated user holding a target record's UUID. UUIDv7 primary keys are time-ordered and therefore partially predictable: the leading 48 bits are a millisecond timestamp, so an attacker who knows roughly when a record was created has a materially reduced search space compared with a random UUIDv4. Record IDs are also freely obtained from legitimate responses — e.g. `GET /v1/shipments/:id` returns `organisationId`, which feeds `GET /v1/business/organisations/:id`, which returns every member's `userId`.

**Attack path:** Each of these six handlers takes an ID from the URL and passes it directly to a Prisma lookup keyed only on that ID. No handler compares the loaded record's `ownerUserId` / `organisationId` / owning shipment against the caller. Four of the six (`invoices`, `customs-case`, `organisations`, plus `api-clients` from SEC-001) attach `PermissionGuard` but declare no `@RequirePermission`, so the guard no-ops (SEC-009). Two (`documents`, `pickup-delivery`) do not attach `PermissionGuard` at all. `GET /v1/shipments/:id` does declare `@RequirePermission("shipment:read")`, but per SEC-002 that grants unconditionally for a customer, and the guard cannot check ownership anyway.

This contrasts directly with the sibling list route in the same service, which *is* correctly scoped:

```ts
// shipments.service.ts:32-40 — list() gets this right
const where = isStaff ? {} : scope.organisationId
  ? { organisationId: scope.organisationId }
  : { ownerUserId: scope.userId };
```

`getById` on line 52 of the same file has no equivalent.

**Impact:** Cross-customer disclosure of the platform's most sensitive records:

- **Shipments** — sender and receiver full names and street addresses (`senderAddressSnapshot`, `receiverAddressSnapshot`), declared customs value, total and outstanding amounts, package dimensions and weights, and **the complete `trackingEvents` array with no visibility filter**. `TrackingEvent.visibility` has an `INTERNAL` value and the row carries `internalDescription`, `reason`, and `actorUserId`; the public tracking service at `tracking.service.ts:59` explicitly filters these out, but `getById` does not. Internal compliance notes are exposed to any logged-in stranger.
- **Invoices** — issued financial records: customer, organisation, invoice number, status, amount, currency, and all `lines`.
- **Documents** — includes `versions[]` with `s3Bucket` and `s3ObjectKey` for private documents. The seeded fixture was `type: "IDENTITY_DOCUMENT"`, i.e. a passport scan. The metadata leak names the exact private-bucket object path; combined with any future signed-URL endpoint or a bucket misconfiguration this becomes retrieval of identity documents. Note that `identity_document:view` is a deliberately restricted permission granted only to `SUPER_ADMIN` and `CUSTOMS` (`packages/contracts/src/permissions.ts:50-80`) — this route bypasses that model entirely.
- **Customs cases** — case status, action type, deadlines, broker reference, outcome notes.
- **Pickups and deliveries** — scheduled time windows and assigned driver user IDs, i.e. when a named individual's goods will be at a physical address.
- **Organisations** — legal name, VAT number, EORI number, credit limit, contract reference, and the full `members[]` array with each member's `userId`, role, and approval limit.

**Reproduction / proof:** All six as `secaudit-attacker`, a customer who owns none of these records:

```console
$ SHIP=019fdba9-f2cd-7d05-a789-46add28aa6c5   # owned by secaudit-victim
$ INV=019fdba9-f339-731d-a107-72c7ec7297fd
$ DOC=019fdba9-f372-7a32-94f1-f5ce9d3bd99e
$ ORG=019fdba9-f1dd-7203-a9fb-8af057c06bee
$ A="Authorization: Bearer secaudit-attacker"

$ curl -s -H "$A" http://localhost:4000/v1/shipments/$SHIP
HTTP 200
{"id":"019fdba9-f2cd-...","trackingNumber":"NT-SECAUD1-US",
 "organisationId":"019fdba9-f1dd-...","ownerUserId":"019fdba9-f1dc-...",
 "senderNameSnapshot":"SECAUDIT Victim Sender",
 "senderAddressSnapshot":{"city":"Milano","line1":"Via Segreta 1","postalCode":"20100","countryCode":"IT"},
 "receiverNameSnapshot":"SECAUDIT Victim Receiver",
 "receiverAddressSnapshot":{"city":"Newark","line1":"9 Private Way","postalCode":"07102","countryCode":"US"},
 "declaredValueAmountMinorUnits":"500000", ...}

# ...and the trackingEvents array in that same response:
[{"canonicalCode":"CUSTOMS_HOLD",
  "visibility":"INTERNAL",
  "internalDescription":"INTERNAL ONLY: consignee flagged by compliance, broker ref XYZ, do not disclose",
  "reason":"SECAUDIT audit probe row"}]

$ curl -s -H "$A" http://localhost:4000/v1/invoices/$INV
HTTP 200
{"id":"019fdba9-f339-...","organisationId":"019fdba9-f1dd-...",
 "customerUserId":"019fdba9-f1dc-...","invoiceNumber":"SECAUDIT-INV-0001",
 "status":"ISSUED","totalAmountMinorUnits":"250000","currency":"EUR", ...}

$ curl -s -H "$A" http://localhost:4000/v1/documents/$DOC
HTTP 200
{"id":"019fdba9-f372-...","ownerUserId":"019fdba9-f1dc-...","type":"IDENTITY_DOCUMENT",
 "reviewStatus":"APPROVED",
 "versions":[{"s3ObjectKey":"private/identity/secaudit-victim-passport.pdf",
              "s3Bucket":"nauterio-private-documents",
              "contentType":"application/pdf","malwareScanResult":"CLEAN", ...}]}

$ curl -s -H "$A" http://localhost:4000/v1/shipments/$SHIP/customs-case
HTTP 200
{"id":"019fdba9-f3a7-...","shipmentId":"019fdba9-f2cd-...","status":"ACTION_REQUIRED", ...}

$ curl -s -H "$A" http://localhost:4000/v1/shipments/$SHIP/pickup-delivery
HTTP 200
{"pickups":[{"id":"019fdba9-f403-...","windowStart":"2026-08-07T09:59:35.643Z",
             "windowEnd":"2026-08-07T11:59:35.643Z","status":"SCHEDULED",
             "assignedDriverUserId":null, ...}],"deliveries":[]}

$ curl -s -H "$A" http://localhost:4000/v1/business/organisations/$ORG
HTTP 200
{"id":"019fdba9-f1dd-...","legalName":"SECAUDIT Victim Org SRL",
 "vatNumber":"IT-SECAUDIT-VAT-0001","eoriNumber":"ITSECAUDITEORI","status":"APPROVED",
 "members":[{"userId":"019fdba9-f1dc-...","role":"ORGANISATION_ADMIN","status":"ACTIVE",
             "approvalLimitAmountMinorUnits":null, ...}]}
```

Every one should be `403` or `404`.

**Root cause:** The codebase treats the presence of a guard decorator as authorization. `AuthGuard` proves identity; `PermissionGuard` (where declared) proves role capability; neither can prove *relationship to this record*, and no service performs that check. The comment at `shipments.service.ts:24-31` correctly identifies that record-relationship scoping "happens here, not in PermissionGuard" — and then implements it only for `list()`, not `getById()`.

**Recommended fix:**
1. Every single-record read must load the record and then assert scope before returning it. Prefer expressing the scope in the query itself so the database enforces it: `prisma.shipment.findFirst({ where: { id, ...ownershipScope(caller) } })` returning `null` → `404`. This avoids a leak-then-check window and makes the enforcement visible in the SQL.
2. Introduce a shared `ownershipScope(caller)` helper per aggregate root (shipment, invoice, document, organisation) and require its use — a repository wrapper that refuses an unscoped `findUnique` for customer callers is stronger than a convention.
3. For nested routes (`/shipments/:shipmentId/...`), resolve and authorize the **parent shipment** first, then load children.
4. Filter `TrackingEvent.visibility === "INTERNAL"` and drop `internalDescription` / `reason` / `actorUserId` on every customer-facing response — reuse the filter already present at `tracking.service.ts:59`.
5. Never return `s3Bucket` / `s3ObjectKey` to a non-staff caller; return an opaque version ID.
6. Add integration tests that assert 403/404 for a non-owning caller on **every** `:id` route, and wire them into CI so new routes cannot ship without one.

**Standards mapping:** OWASP API Security Top 10 2023 **API1:2023 Broken Object Level Authorization**, **API3:2023 Broken Object Property Level Authorization**; OWASP ASVS 5.0 V4.2.1, V8.3.4 (sensitive data exposure).

---

## SEC-004 — Claims can be submitted against any shipment ID

**Severity:** High
**Confidence:** High
**File:line:** `apps/api/src/modules/claims-returns/claims-returns.module.ts:32-58` (service), `:62-76` (controller — `@UseGuards(AuthGuard)` only, no `PermissionGuard`, no `@RequirePermission`)

**Actor & preconditions:** Any authenticated user. Requires only a shipment UUID, which SEC-003 hands out freely.

**Attack path:** `SubmitClaimDto` validates `shipmentId` as `@IsString()` — not even as a UUID — and the service writes it straight into `tx.claim.create({ data: { shipmentId: dto.shipmentId, submittedByUserId: userId, ... } })`. Nothing verifies that the shipment exists in a state that permits a claim, that the caller owns it, or that the caller's organisation owns it. The only integrity check is the database foreign key, which merely requires the shipment to exist.

**Impact:**
- **Financial/fraud:** claims are the entry point to the compensation and refund workflow. An attacker can open claims against arbitrary third-party shipments, including high-declared-value ones discovered via SEC-003. Even with a downstream human approval step, this injects fraudulent financial workflow items attributed to real shipments and can be used to force operational holds on a competitor's or victim's consignments.
- **Existence oracle:** because the FK rejects non-existent shipment IDs, the endpoint distinguishes valid from invalid shipment UUIDs. Combined with time-ordered UUIDv7 keys this is a usable enumeration primitive that also writes a permanent, append-only audit row per probe.
- **Storage/audit-log flooding:** each probe writes a `claims` row plus an `audit_events` row, and `audit_events` is append-only by trigger (`20260807024500_constraints_and_triggers/migration.sql:110-112`) so the noise is unremovable. The only brake is the 120 req/min throttle, which is itself ineffective as deployed (SEC-008).

**Reproduction / proof:**

```console
$ curl -s -w "\nHTTP %{http_code}\n" -X POST \
    -H "Authorization: Bearer secaudit-attacker" \
    -H "Content-Type: application/json" \
    -H "Idempotency-Key: secaudit-claim-1" \
    -d '{"shipmentId":"019fdba9-f2cd-7d05-a789-46add28aa6c5",
         "reasonCategory":"LOST",
         "description":"SECAUDIT cross-tenant claim probe"}' \
    http://localhost:4000/v1/claims
{"id":"019fdbab-22b9-7996-ac53-9dae7c880817",
 "shipmentId":"019fdba9-f2cd-7d05-a789-46add28aa6c5",
 "submittedByUserId":"019fdba9-f1db-7fe7-b181-5a05bffd6cd5",
 "status":"SUBMITTED","reasonCategory":"LOST", ...}
HTTP 201
```

`shipmentId` belongs to `secaudit-victim`; `submittedByUserId` is the attacker. Should be `403`.

Note also that `reasonCategory` is accepted as a free-form string (`@IsString()`), so the claim taxonomy is attacker-defined.

**Root cause:** The write path was built around idempotency and transactional audit atomicity — both of which are correctly implemented here — while the authorization precondition on the referenced aggregate was never added. Referential integrity was mistaken for authorization.

**Recommended fix:**
1. Load the shipment inside the transaction and assert the caller owns it (or belongs to its organisation, or is staff) before creating the claim; `404` if not visible to the caller.
2. Validate `shipmentId` with `@IsUUID("all")`.
3. Constrain `reasonCategory` with `@IsIn([...])` against a defined enum, and enforce it with a database CHECK constraint or Postgres enum.
4. Assert claim eligibility as a domain invariant (shipment lifecycle state, claim window, no duplicate open claim for the same shipment).

**Standards mapping:** OWASP API Security Top 10 2023 **API1:2023 Broken Object Level Authorization**, **API6:2023 Unrestricted Access to Sensitive Business Flows**; OWASP ASVS 5.0 V4.2.1, V11.1.2 (business-logic limits).

---

## SEC-005 — `Idempotency-Key` namespace is global, not per-caller

**Severity:** High
**Confidence:** High
**File:line:**
- `apps/api/src/common/interceptors/idempotency.interceptor.ts:52` (scope is `Class.handler` only)
- `apps/api/src/common/interceptors/idempotency.interceptor.ts:58-66` (`userId` recorded but not part of the key)
- `apps/api/src/common/interceptors/idempotency.interceptor.ts:71-86` (replay path)
- `packages/database/prisma/schema.prisma` `IdempotencyRecord` — `@@unique([scope, key])`, no `userId`

**Actor & preconditions:** Any authenticated user. Affects all four write routes: `POST /v1/bookings`, `POST /v1/claims`, `POST /v1/me/addresses`, and any future `@RequireIdempotencyKey()` route.

**Attack path:** The interceptor derives the uniqueness scope as `${context.getClass().name}.${context.getHandler().name}` — the route, not the caller. `userId` is stored on the row at line 63 but is absent from the unique constraint and from the lookup at line 72. The idempotency namespace is therefore shared platform-wide.

Three consequences:

1. **Cross-user response replay.** If user B submits the same route with the same `Idempotency-Key` and a body whose SHA-256 matches user A's, the interceptor returns `of(existing.responseBodyJson)` at line 86 — user A's stored response — and B's handler never runs. B receives A's record.
2. **Silent write suppression.** In that same flow B's write is silently discarded while B receives HTTP 200 and a plausible-looking body. There is no signal that the operation did not occur. For `POST /v1/claims` this means a customer's claim can be silently swallowed.
3. **Key-squatting denial of service.** An attacker can pre-register predictable keys (sequential integers, dates, timestamps, `order-1`…`order-N`) across the shared namespace. Any legitimate client that later uses one of those keys with a different body receives a hard `409` (line 76-80) and cannot complete the operation with that key. Clients using non-random keys — a very common integration pattern, and one a partner API will invite — are trivially locked out.

**Impact:** Cross-tenant data disclosure and cross-tenant write suppression on every idempotent write path, plus a low-effort availability attack. The replay case requires body collision, which is realistic for low-entropy bodies (address forms, claim categories) and fully attacker-controllable in a targeted scenario. The suppression and DoS cases require no collision at all.

**Reproduction / proof:**

```console
# 1. Attacker claims key "SHARED-KEY-1" on POST /v1/me/addresses
$ curl -s -H "Authorization: Bearer secaudit-attacker" -H "Content-Type: application/json" \
    -H "Idempotency-Key: SHARED-KEY-1" \
    -d '{"line1":"1 Attacker St","city":"Roma","postalCode":"00100","countryCode":"IT"}' \
    http://localhost:4000/v1/me/addresses
{"id":"019fdbab-9e8e-7c98-b120-3f04dee73833",
 "userId":"019fdba9-f1db-7fe7-b181-5a05bffd6cd5",   <-- ATTACKER's user id
 "line1":"1 Attacker St","city":"Roma", ...}

# 2. Victim uses the same key with the same body -> receives the ATTACKER's record.
#    No address is created for the victim. HTTP 201, looks like success.
$ curl -s -H "Authorization: Bearer secaudit-victim" -H "Content-Type: application/json" \
    -H "Idempotency-Key: SHARED-KEY-1" \
    -d '{"line1":"1 Attacker St","city":"Roma","postalCode":"00100","countryCode":"IT"}' \
    http://localhost:4000/v1/me/addresses
{"id":"019fdbab-9e8e-7c98-b120-3f04dee73833",
 "userId":"019fdba9-f1db-7fe7-b181-5a05bffd6cd5",   <-- still the ATTACKER's user id
 "line1":"1 Attacker St", ...}

# 3. Victim uses the same key with their OWN body -> permanently blocked.
$ curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer secaudit-victim" \
    -H "Content-Type: application/json" -H "Idempotency-Key: SHARED-KEY-1" \
    -d '{"line1":"2 Victim Rd","city":"Milano","postalCode":"20100","countryCode":"IT"}' \
    http://localhost:4000/v1/me/addresses
{"code":"CONFLICT",
 "message":"This Idempotency-Key was already used with a different request payload.", ...}
HTTP 409
```

Step 2 is the disclosure. Step 3 is the DoS.

**Root cause:** The Stripe-style idempotency contract the implementation mirrors is scoped per API credential. This implementation scoped it per route instead, and the `userId` column that would have made the scoping correct was added for observability rather than made part of the key.

**Recommended fix:**
1. Add `userId` (and, for partner API keys, `apiClientId`) to the `IdempotencyRecord` unique constraint: `@@unique([scope, userId, key])`. This requires a migration and a backfill/purge of existing rows.
2. Include the caller identity in the lookup at line 72 as well as the create.
3. Reject keys that are not sufficiently random (minimum length, UUID format) to reduce accidental collision even within a single user's namespace.
4. Also address the fire-and-forget persistence at lines 92-105: both the `COMPLETED` update and the failure-path `delete` are unawaited promises inside `tap`. A crash between handler completion and the update leaves the record stuck `IN_PROGRESS` until TTL expiry, hard-`409`ing every legitimate retry in the meantime. Await these, or move the state transition into the same transaction as the business write.

**Standards mapping:** OWASP API Security Top 10 2023 **API1:2023 Broken Object Level Authorization**, **API4:2023 Unrestricted Resource Consumption**; OWASP ASVS 5.0 V4.2.2 (multi-tenant data segregation), V11.1.4.

---

## SEC-006 — SUSPENDED and CLOSED accounts retain full read and write access

**Severity:** High
**Confidence:** High
**File:line:**
- `packages/validation/src/permission-evaluator.ts:52-55` (the **only** place `accountStatus` is checked)
- `apps/api/src/common/guards/permission.guard.ts:19-20` (skips the check entirely when no `@RequirePermission`)
- `apps/api/src/common/guards/auth.guard.ts:51-72` (`AuthGuard` reads `user.status` into the request context but never enforces it)

**Actor & preconditions:** Any user whose account has been suspended or closed, who still holds their bearer token.

**Attack path:** `AuthGuard` loads the user and populates `req.user.accountStatus`, but performs no check on it — it authenticates a `SUSPENDED` or `CLOSED` user exactly as it would an `ACTIVE` one. The `accountStatus !== "ACTIVE"` deny is the first step of `evaluatePermission`, which only runs when `PermissionGuard` finds a `@RequirePermission` decorator. **12 of the 19 routes have no such decorator**, so for those routes account status is never consulted.

**Impact:** Account suspension — the platform's primary response to fraud, abuse, chargebacks, non-payment, or a compromised account — does not actually revoke access. A suspended user retains the ability to read every route in SEC-003 and, critically, to **write**: submit claims, create bookings, and add addresses. This defeats incident response: suspending a compromised or fraudulent account has no effect on the attacker's ongoing capability. In practice this means there is currently no working mechanism to cut off an abusive account short of deleting the user row (which SEC-011 shows is itself impossible once any audit event exists).

**Reproduction / proof:**

```console
$ psql ... -c "update users set status='SUSPENDED' where cognito_sub='secaudit-attacker';"
UPDATE 1

$ A="Authorization: Bearer secaudit-attacker"
$ curl -s -o /dev/null -w "%{http_code}\n" -H "$A" http://localhost:4000/v1/me
200
$ curl -s -o /dev/null -w "%{http_code}\n" -H "$A" http://localhost:4000/v1/documents/019fdba9-f372-...
200
$ curl -s -o /dev/null -w "%{http_code}\n" -H "$A" http://localhost:4000/v1/shipments/019fdba9-f2cd-.../pickup-delivery
200
$ curl -s -o /dev/null -w "%{http_code}\n" -H "$A" http://localhost:4000/v1/business/organisations/00000000-0000-0000-0000-000000000000/api-clients
200
# --- a WRITE, by a SUSPENDED account ---
$ curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "$A" -H "Content-Type: application/json" \
    -H "Idempotency-Key: secaudit-suspended-1" \
    -d '{"shipmentId":"019fdba9-f2cd-...","reasonCategory":"DAMAGE","description":"suspended-account write probe"}' \
    http://localhost:4000/v1/claims
201
# Only the one route that declares @RequirePermission blocks:
$ curl -s -o /dev/null -w "%{http_code}\n" -H "$A" http://localhost:4000/v1/shipments
403
```

`201` on a write from a suspended account is the finding. The single `403` confirms the check exists but is reachable only via `@RequirePermission`.

**Root cause:** Account-status enforcement was placed inside the optional authorization chain rather than in the mandatory authentication path.

**Recommended fix:** Move the `accountStatus === "ACTIVE"` check into `AuthGuard.canActivate`, immediately after the user lookup at `auth.guard.ts:52`, and throw `UnauthorizedException` (or a dedicated 403 with an `ACCOUNT_SUSPENDED` code) for any non-ACTIVE status. Keep the check in `evaluatePermission` as defense in depth. Once real Cognito is wired, also disable the Cognito user and revoke refresh tokens on suspension so existing sessions die.

**Standards mapping:** OWASP ASVS 5.0 V3.3.4 / V3.7 (session and account state termination); OWASP API Security Top 10 2023 **API5:2023 Broken Function Level Authorization**.

---

## SEC-007 — Dev auth passthrough and Swagger UI are active in `staging`

**Severity:** High
**Confidence:** High
**File:line:**
- `apps/api/src/common/guards/auth.guard.ts:81-89` (`resolveCognitoSub` — throws only on `production`)
- `packages/configuration/src/index.ts:9` (`NODE_ENV` enum includes `staging`)
- `packages/configuration/src/index.ts:16` (`LOCAL_AUTH_MODE: z.coerce.boolean().default(true)`)
- `apps/api/src/main.ts:39-48` (Swagger mounted whenever `NODE_ENV !== "production"`)

**Actor & preconditions:** Anyone who can reach a non-production deployment of the API. If staging is internet-facing (typical) or reachable from a compromised VPN/CI runner, this is an unauthenticated attacker.

**Attack path:** `resolveCognitoSub` returns the bearer token verbatim as the `cognito_sub`, and refuses to do so only when `process.env.NODE_ENV === "production"`:

```ts
private async resolveCognitoSub(token: string): Promise<string | null> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("...refusing to start with the local-dev token passthrough in production.");
  }
  return token || null;
}
```

The configuration schema explicitly recognises `staging` as a valid environment. In `staging` the guard is a pure identity oracle: supply any user's `cognito_sub` as the bearer token and you are that user — including any `SUPER_ADMIN`. Swagger is simultaneously served at `/docs` and `/docs-json`, publishing the complete route inventory and DTO shapes.

Three aggravating details:

1. `LOCAL_AUTH_MODE` is **never read anywhere in the codebase** (verified by grep across `apps/`, `packages/`, `infra/`, `scripts/`). The comment at `auth.guard.ts:31-34` states the passthrough is "enforced by `loadApiConfig`'s `NODE_ENV` check at the call site in each module" — no such call-site check exists. The only real gate is the inline `production` string comparison.
2. Even if `LOCAL_AUTH_MODE` were wired up, `z.coerce.boolean()` cannot express `false`: `Boolean("false") === true`, so `LOCAL_AUTH_MODE=false` in an env file would evaluate to `true`. The kill switch would be non-functional.
3. The guard reads `process.env.NODE_ENV` directly rather than the validated config, so it bypasses the fail-fast schema entirely. A deployment with `NODE_ENV` unset (empty string) also takes the passthrough branch — and `loadApiConfig` would silently default it to `development`.

**Impact:** Complete authentication bypass and arbitrary user impersonation, including staff, in every environment other than one where `NODE_ENV` is exactly the string `production`. Staging environments routinely carry production-shaped data, real integration credentials, and are used for UAT with real customer records. The current design makes "did someone set an env var correctly" the sole barrier between an attacker and full staff-level impersonation.

**Reproduction / proof:**

```console
$ NODE_ENV=staging pnpm start
Nauterio API listening on port 4000 (staging)

# Impersonate a staff user by supplying their cognito_sub as the bearer token:
$ curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer test-ops-token-2" http://localhost:4000/v1/me
{"id":"019fdb82-cbe5-7ee9-8538-d246c0022e27","email":"ops2@nauterio.test",
 "fullName":"Test Ops User 2","status":"ACTIVE","preferredLanguage":"en",
 "staffRole":"OPERATIONS"}
HTTP 200

$ curl -s -o /dev/null -w "GET /docs -> HTTP %{http_code}\n" http://localhost:4000/docs
GET /docs -> HTTP 200

$ curl -s http://localhost:4000/docs-json | head -c 120
{"openapi":"3.0.0","paths":{"/v1/me":{"get":{"operationId":"IdentityController_getMe", ...
```

No credential of any kind was presented — only a `cognito_sub` string.

**Root cause:** A deny-list (`=== "production"`) was used where an allow-list (`=== "development" || === "test"`) was required, and the intended feature-flag kill switch was declared but never wired or made functional.

**Recommended fix:**
1. Invert the check to an allow-list: permit the passthrough only when `NODE_ENV === "development" || NODE_ENV === "test"`, and **fail closed** (throw at bootstrap, not per-request) otherwise.
2. Perform the check once at application bootstrap in `main.ts` using the validated `loadApiConfig()` result, so a misconfigured environment refuses to start rather than silently serving insecure requests.
3. Replace `z.coerce.boolean()` with an explicit `z.enum(["true","false"]).transform(v => v === "true")` for every boolean env var, and either wire `LOCAL_AUTH_MODE` up as a real second gate or delete it — a documented-but-inert kill switch is worse than none.
4. Gate Swagger behind an explicit `ENABLE_API_DOCS` flag rather than `NODE_ENV !== "production"`, and require authentication for `/docs` in any shared environment.
5. Prioritise the real Cognito JWKS verification before any environment beyond a developer laptop is stood up.

**Standards mapping:** OWASP API Security Top 10 2023 **API2:2023 Broken Authentication**, **API8:2023 Security Misconfiguration**; OWASP ASVS 5.0 V2.1 (authentication verification), V14.1.1 (build/deploy environment separation).

---

## SEC-008 — Rate limiting is ineffective as deployed

**Severity:** Medium
**Confidence:** High
**File:line:**
- `apps/api/src/app.module.ts:37` (`ThrottlerModule.forRoot([{ name: "default", ttl: 60_000, limit: 120 }])` — no `storage` option)
- `apps/api/src/app.module.ts:60` (`APP_GUARD: ThrottlerGuard`)
- `apps/api/src/main.ts` (no `app.set("trust proxy", ...)` anywhere)
- `apps/api/src/modules/tracking/tracking.controller.ts:17` (`@Throttle({ default: { limit: 10, ttl: 60_000 } })`)
- `apps/api/src/modules/quotes/quotes.controller.ts:17` (`@Throttle({ default: { limit: 30, ttl: 60_000 } })`)

**Actor & preconditions:** Any network client; relevant to the production ECS Fargate topology described in `CLAUDE.md`.

**Attack path:** Two independent defects.

**(a) No `trust proxy`.** `@nestjs/throttler`'s default tracker uses `req.ips[0]` when available and falls back to `req.ip`. Express populates `req.ips` from `X-Forwarded-For` **only** when the `trust proxy` setting is enabled. It is never set. Behind the planned ALB/CloudFront, `req.ip` is the load balancer's address for every request, so **all clients worldwide share a single counter**. The tracking endpoint's 10/min anti-enumeration budget becomes 10 requests per minute for the entire internet — any single client trivially denies service to all others.

Confirmed live: 13 requests with 13 distinct `X-Forwarded-For` values were counted against one bucket.

Note the converse trap: naively "fixing" this by enabling `trust proxy: true` would make the tracker read a fully attacker-controlled header, letting an enumerator rotate `X-Forwarded-For` per request and bypass the limit entirely. The correct fix is a bounded trust hop count matched to the actual proxy depth.

**(b) In-memory storage.** No custom `ThrottlerStorage` is configured, so `@nestjs/throttler`'s default in-process `ThrottlerStorageService` is used (verified: no `ThrottlerStorage` reference anywhere in the repo). Each ECS task keeps an independent counter, so the effective limit is `limit × taskCount` and it drifts with autoscaling. The tracking-enumeration control named in the spec is not enforceable at the value written in the code.

**Impact:** As deployed, the anti-enumeration control does not work in either direction — it is both too tight (self-inflicted denial of service against all legitimate users once one client is noisy) and too loose (per-task multiplication defeats the intended global budget). Rate limiting also currently substitutes for authorization on several public and semi-public paths, so its failure compounds SEC-004's enumeration primitive.

**Reproduction / proof:**

```console
$ for i in $(seq 1 13); do
    curl -s -o /dev/null -w "%{http_code} " -H "X-Forwarded-For: 203.0.113.$i" \
      "http://localhost:4000/v1/tracking/NT-SECAUD1-US"
  done
200 200 200 200 200 200 200 200 200 200 429 429 429
```

13 different source IPs (as far as `X-Forwarded-For` is concerned), one shared counter, 429 from the 11th request onward.

```console
$ grep -rn "ThrottlerStorage\|getTracker\|skipIf\|trust proxy" apps/api/src packages/*/src
# (no matches — confirms default in-memory storage and default IP tracker)
```

**Root cause:** The throttler was adopted with defaults appropriate for a single-instance local server and not adapted to the documented multi-instance, load-balanced target topology.

**Recommended fix:**
1. Set `app.set("trust proxy", <hop count>)` in `main.ts`, matching the real number of trusted proxies (e.g. `2` for CloudFront → ALB). Never `true`.
2. Configure a shared `ThrottlerStorage` backed by Redis/ElastiCache (`@nest-lab/throttler-storage-redis` or equivalent) so limits are global across tasks.
3. Implement a custom `getTracker` that keys authenticated requests on `userId` and anonymous ones on the client IP, so one noisy anonymous client cannot exhaust the budget for authenticated users.
4. Keep the AWS WAF rate rule as defense in depth, as ADR 0001 §5.3 already anticipates — but do not let it substitute for a correct application-layer limit.
5. Add a smoke test asserting that two distinct `X-Forwarded-For` values receive independent budgets once trust proxy is configured.

**Standards mapping:** OWASP API Security Top 10 2023 **API4:2023 Unrestricted Resource Consumption**; OWASP ASVS 5.0 V11.1.4 (anti-automation).

---

## SEC-009 — `PermissionGuard` fails open when a route omits `@RequirePermission`

**Severity:** Medium
**Confidence:** High
**File:line:** `apps/api/src/common/guards/permission.guard.ts:19-20`

**Actor & preconditions:** Any authenticated user; applies to every route lacking the decorator.

**Attack path:**

```ts
const action = this.reflector.get<string>(PERMISSION_KEY, context.getHandler());
if (!action) return true; // route did not declare @RequirePermission - AuthGuard alone applies
```

A missing decorator is treated as "no authorization required" rather than as a configuration error. Because the decorator is applied per **handler** (not per controller), attaching `@UseGuards(AuthGuard, PermissionGuard)` at the controller level provides a strong visual signal of protection while delivering none. Four controllers do exactly this — `billing`, `customs`, `organisations`, `integrations` — attaching `PermissionGuard` to a handler that declares nothing for it to check.

Current coverage: **7 of 19 routes** declare `@RequirePermission`; **12 do not**. Every route in SEC-003 and SEC-004 is in the second group, and SEC-006's account-status bypass is a direct consequence.

**Impact:** No direct exploit beyond the findings already enumerated, but this is the mechanism that made SEC-001, SEC-003, SEC-004, and SEC-006 possible, and it guarantees that any future route whose author forgets the decorator ships unprotected and looks protected in review.

**Reproduction / proof:** Code trace above, plus the SEC-002 transcript — `GET /v1/shipments` (decorator present, suspended account) returns `403` while `GET /v1/documents/:id` (decorator absent, same suspended account) returns `200`.

**Root cause:** Fail-open default in a security control.

**Recommended fix:** Invert the default. Throw `ForbiddenException` when a route reached through `PermissionGuard` declares no action, and introduce an explicit `@PublicRoute()` / `@NoPermissionRequired()` marker for the deliberate exceptions. Add a bootstrap-time assertion that walks the route table and fails startup if any non-public route lacks either marker — that converts an easily-missed omission into a build failure.

**Standards mapping:** OWASP ASVS 5.0 V4.1.5 ("access control fails securely"); OWASP API Security Top 10 2023 **API5:2023**.

---

## SEC-010 — Fail-open defaults inside `evaluatePermission`

**Severity:** Medium
**Confidence:** High
**File:line:** `packages/validation/src/permission-evaluator.ts:75-79` (warehouse scope), `:87-93` (approval limit), `:70-72` (organisation scope), `:97-102` (separation of duties)

**Actor & preconditions:** Staff accounts, once record context is actually supplied (i.e. after SEC-002 is fixed).

**Attack path:** Each remaining step in the chain is conditional on optional context being present, and grants when it is absent:

```ts
// 4. Warehouse scope — skipped entirely when the staff member has no assignments
if (isStaff && req.recordWarehouseId && ctx.warehouseIds.length > 0) { ... }

// 6. Approval limit — skipped entirely when no limit is configured
if (req.requestedAmountMinorUnits !== undefined && ctx.approvalLimitAmountMinorUnits !== undefined) { ... }
```

- A staff member with `staffWarehouseIds = []` passes **every** warehouse scope check, because the guard reads `ctx.warehouseIds.length > 0` as "scoping applies" rather than "no warehouses assigned → no warehouse access". An empty array is the default (`schema.prisma` `staffWarehouseIds String[] @default([])`), so an unconfigured staff account has maximal warehouse reach.
- A member whose `approvalLimitAmountMinorUnits` is `NULL` (the schema default) has an **unlimited** approval limit. In `AuthGuard` this is compounded: `approvalLimitAmountMinorUnits: membership?.approvalLimitAmountMinorUnits ? Number(...) : undefined` (`auth.guard.ts:68-70`) — a falsy check, so a legitimately-configured limit of **`0`** also becomes `undefined`, i.e. unlimited. A "may approve nothing" configuration silently becomes "may approve anything".
- Steps 3 and 7 are similarly inert without record context.

**Impact:** Once SEC-002 is fixed and record context begins flowing, these checks will still not enforce what they appear to. Financial approval limits — the control standing between a staff account and an arbitrary refund — default to unlimited and invert on the specific value `0`.

**Reproduction / proof:** Code trace. Not live-reproducible today because no route currently supplies `requestedAmountMinorUnits` or `recordWarehouseId` (no refund/approval routes exist yet) — this is a latent defect that will activate with the billing module. The `0` inversion is directly visible at `auth.guard.ts:68`.

**Root cause:** Optional-context checks written as "constrain if configured" rather than "deny unless explicitly permitted"; plus a truthiness test on a numeric value whose zero is meaningful.

**Recommended fix:**
1. Treat missing scope context as denial for the actions that require it. If an action is declared warehouse-scoped, absent `recordWarehouseId` must deny.
2. Treat an empty `warehouseIds` array as "no warehouse access", not "all warehouses".
3. Treat a `NULL` approval limit as `0` (may approve nothing) and require an explicit positive limit to approve anything.
4. Fix the falsy check at `auth.guard.ts:68-70` to `membership?.approvalLimitAmountMinorUnits != null ? Number(...) : undefined`.
5. Add a per-action metadata table declaring which scope inputs each action requires, and assert their presence in the evaluator.

**Standards mapping:** OWASP ASVS 5.0 V4.1.3 (least privilege), V4.1.5 (fail securely).

---

## SEC-011 — User erasure is permanently impossible once any audit event exists

**Severity:** Medium
**Confidence:** High
**File:line:**
- `packages/database/prisma/schema.prisma` — `AuditEvent.actorUser` relation (`onDelete: SetNull`, confirmed as `confdeltype = 'n'` in the live database)
- `packages/database/prisma/migrations/20260807024500_constraints_and_triggers/migration.sql:110-112` (`BEFORE UPDATE OR DELETE ON audit_events`)

**Actor & preconditions:** Operator action — GDPR Article 17 erasure request, or any account teardown.

**Attack path:** `audit_events.actor_user_id` carries `ON DELETE SET NULL`. Deleting a `users` row therefore causes Postgres to issue `UPDATE ONLY public.audit_events SET actor_user_id = NULL WHERE ...`. The `audit_events_append_only` trigger fires `BEFORE UPDATE OR DELETE` and raises an exception unconditionally. The user delete aborts, and the enclosing transaction rolls back.

Because `audit_events` also blocks `DELETE`, there is no way to clear the referencing rows first. The user row becomes permanently undeletable through normal application or DBA operations — the only escape is `ALTER TABLE ... DISABLE TRIGGER`, i.e. deliberately suspending an integrity control.

**Impact:**
- **Regulatory:** the platform cannot satisfy a GDPR Art. 17 erasure request for any user who has ever performed an audited action — which is every real customer. The spec's retention schedule and deletion obligations cannot be met.
- **Operational:** account teardown, test-data cleanup, and de-provisioning all fail with a confusing error that names `audit_events` rather than the user delete that triggered it.
- **Integrity risk:** the natural workaround (disabling the append-only trigger to complete a delete) undermines the tamper-evidence guarantee the trigger exists to provide, and there is no runbook governing when that is permitted.

**Reproduction / proof:** Encountered live while cleaning up this audit's own fixtures:

```console
$ psql ... -c "DELETE FROM users WHERE cognito_sub = 'secaudit-attacker';"
ERROR:  audit_events is append-only: UPDATE is not permitted. Insert a correction row instead.
CONTEXT:  PL/pgSQL function reject_update_delete() line 3 at RAISE
  SQL statement "UPDATE ONLY "public"."audit_events" SET "actor_user_id" = NULL
                 WHERE $1 OPERATOR(pg_catalog.=) "actor_user_id""

$ psql ... -t -c "select conname, confdeltype from pg_constraint
                  where conrelid='audit_events'::regclass and contype='f';"
 audit_events_actor_user_id_fkey | n      -- 'n' = SET NULL
```

The `secaudit-attacker` test user could not be removed and remains in the dev database (see Coverage note).

**Root cause:** Two correct-in-isolation designs — referential nulling on delete, and an append-only audit trigger — combine into a deadlock that was not tested.

**Recommended fix:**
1. Change the FK to `ON DELETE NO ACTION` / `RESTRICT` and stop relying on cascade nulling for an immutable table.
2. Implement erasure as **pseudonymisation** rather than deletion: keep the `users` row and audit linkage intact, overwrite the PII columns (email, full name, phone, address book) with tombstone values, and record the erasure as its own audit event. This satisfies Art. 17 while preserving the append-only financial and audit history that `CLAUDE.md` requires — the two obligations are reconcilable, but only by not deleting the row.
3. Document the chosen approach in an ADR and a runbook, and add an integration test that exercises a full erasure against a user with audit history.

**Standards mapping:** OWASP ASVS 5.0 V8.1.3 / V8.3 (data retention and deletion); GDPR Art. 17.

---

## SEC-012 — No audit trail for most state-changing operations

**Severity:** Medium
**Confidence:** High
**File:line:**
- `apps/api/src/modules/claims-returns/claims-returns.module.ts:44-54` (the only `auditService.record` call in the codebase)
- `apps/api/src/modules/bookings/bookings.module.ts:22-32` (no audit)
- `apps/api/src/modules/customers/customers.module.ts:22-25` (no audit)
- `apps/api/src/modules/quotes/quotes.service.ts:70-91` (no audit)

**Actor & preconditions:** N/A — this is a detection and forensics gap.

**Attack path:** `AuditService.record` is invoked from exactly one place: claim submission. Three of the four write routes (`POST /v1/bookings`, `POST /v1/me/addresses`, `POST /v1/quotes`) produce no audit event. No read of sensitive data — including the cross-tenant reads in SEC-003 — produces one either.

**Impact:** The cross-tenant access described in SEC-001 and SEC-003 would leave **no trace** in `audit_events`. There is no record of who read which customer's identity document, invoice, or shipment. `CLAUDE.md` mandates that "tracking, audit, and issued financial history are append-only" and that every high-risk activity be recorded; the storage and atomicity mechanism is well built (the transactional pattern at `claims-returns.module.ts:34-57` is exactly right), but it is applied to one operation out of many. Incident response for any of the findings above would currently be unable to determine scope of exposure.

**Reproduction / proof:**

```console
$ grep -rn "auditService.record\|AuditService" apps/api/src/modules
apps/api/src/modules/claims-returns/claims-returns.module.ts:10:import { AuditService } from "../audit/audit.module";
apps/api/src/modules/claims-returns/claims-returns.module.ts:25:  constructor(private readonly auditService: AuditService) {}
apps/api/src/modules/claims-returns/claims-returns.module.ts:44:      await this.auditService.record(
# (audit.module.ts itself excluded — no other call sites)
```

**Root cause:** Audit was implemented as an opt-in service call per feature rather than as a cross-cutting concern.

**Recommended fix:**
1. Audit every write, following the existing transactional pattern (`tx` passed through) so the audit row and the business row commit atomically.
2. Add access logging for reads of PII, identity documents, and financial records — the `customer_pii:view` and `identity_document:view` actions already exist in the permission catalogue and should each emit an audit event when exercised.
3. Consider a `@Audited(action, entityType)` decorator plus interceptor for the uniform cases, keeping explicit in-transaction calls for writes where atomicity matters.
4. Record `ipAddress` (currently never populated despite being on `RecordAuditEventInput`).

**Standards mapping:** OWASP API Security Top 10 2023 **API9:2023 Improper Inventory Management** (adjacent) and general logging requirements; OWASP ASVS 5.0 V7.1 (log content), V7.2.1 (security event logging).

---

## SEC-013 — Unvalidated UUID path parameters produce HTTP 500

**Severity:** Low
**Confidence:** High
**File:line:** all `@Param("id")` / `@Param("shipmentId")` handlers — e.g. `apps/api/src/modules/shipments/shipments.controller.ts:29`, `billing/billing.module.ts:31`, `documents/documents.module.ts:31`, `customs/customs.module.ts:29`, `pickup-delivery/pickup-delivery.module.ts:30`, `organisations/organisations.module.ts:35`

**Actor & preconditions:** Any authenticated user.

**Attack path:** No `ParseUUIDPipe` is applied to any path parameter. A malformed value reaches Prisma, which raises `P2023 (Inconsistent column data)`. `AllExceptionsFilter` catches the non-`HttpException`, logs the full stack server-side, and returns a generic 500.

**Impact:** No information disclosure — the filter correctly returns only `{"code":"INTERNAL_ERROR","message":"An unexpected error occurred.", ...}` with no stack trace, which is good practice and worth preserving. The issues are operational: every malformed ID is logged as an unhandled exception at ERROR level, so an attacker can flood the error log and any 5xx-based alerting or SLO error budget at negligible cost, and genuine incidents get buried. Clients also receive `retryable: true` for a permanently invalid request.

**Reproduction / proof:**

```console
$ curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer secaudit-attacker" \
    http://localhost:4000/v1/shipments/not-a-uuid
{"code":"INTERNAL_ERROR","message":"An unexpected error occurred.",
 "correlationId":"7c4916e8-7e00-4bb4-a186-99bff24a4976","retryable":true}
HTTP 500
```

Should be `400`.

**Root cause:** Validation applied at the body boundary (global `ValidationPipe`) but not at the path-parameter boundary.

**Recommended fix:** Apply `ParseUUIDPipe` (or `new ParseUUIDPipe({ version: "7" })`) to every UUID path parameter. Additionally, map Prisma's known error codes (`P2023`, `P2025`) to 400/404 in `AllExceptionsFilter` so client-caused errors never register as server errors.

**Standards mapping:** OWASP ASVS 5.0 V5.1.3 (input validation at the boundary), V7.4.1 (generic error handling).

---

## SEC-014 — Attacker-controlled correlation ID reflected in responses and persisted into the append-only audit log

**Severity:** Low
**Confidence:** High
**File:line:**
- `apps/api/src/common/interceptors/correlation-id.interceptor.ts:20-23`
- `apps/api/src/common/decorators/correlation-id.decorator.ts:8-11`
- `apps/api/src/modules/claims-returns/claims-returns.module.ts:73` → `audit.module.ts:45`

**Actor & preconditions:** Any client, authenticated or not.

**Attack path:** The interceptor accepts an inbound `x-correlation-id` header of any length and content, performs no validation, writes it back onto the request, and echoes it in the response header. The `@CorrelationId()` decorator then reads it and it is persisted verbatim into `audit_events.correlation_id`, a table protected by an append-only trigger — so a poisoned value can never be corrected or removed.

**Impact:** Bounded. Node rejects header values containing CR/LF, so response-splitting is not achievable. The realistic effects are (a) log and audit-trail poisoning — an attacker can inject arbitrary text into the field used to correlate logs, potentially forging or colliding with another request's trace, and it is permanent by trigger; (b) unbounded-length values stored per audit row (a storage-growth nuisance); (c) forged correlation IDs that make incident reconstruction unreliable precisely when it matters.

Separately, `correlation-id.decorator.ts:10` hard-codes the literal `"x-correlation-id"` while the interceptor uses the configurable `config.CORRELATION_ID_HEADER`. If that setting is ever changed the decorator silently returns `"unknown"` for every request and the audit trail loses correlation entirely. The same hard-coding exists at `http-exception.filter.ts:26`.

**Reproduction / proof:** Code trace; visible in the SEC-005 transcript where a request without the header produced `"correlationId":"unknown"` in the error body, confirming the value is taken from the raw header with no server-side generation guarantee at the decorator boundary.

**Recommended fix:**
1. Validate the inbound header against a strict format (UUID, or `^[A-Za-z0-9._-]{1,64}$`); generate a fresh server-side ID when it does not match, and never trust it for anything security-relevant.
2. Consider always generating a server-side ID and recording any client-supplied value in a separate `client_correlation_id` field, so the audit trail's own identifier is never attacker-controlled.
3. Replace the hard-coded header literals in the decorator and exception filter with the injected `config.CORRELATION_ID_HEADER`.

**Standards mapping:** OWASP ASVS 5.0 V7.1.3 (log injection / neutralisation), V5.1.3.

---

## SEC-015 — Admin bearer token in `localStorage`; no staff-role gate on the admin surface

**Severity:** Low
**Confidence:** High
**File:line:** `apps/admin/src/lib/auth.ts:13-24`, `apps/admin/src/lib/api.ts:26-35`

**Actor & preconditions:** Requires an XSS foothold in the admin app, or the SEC-007 staging passthrough.

**Attack path:** The admin session token is held in `window.localStorage` under `nauterio_admin_token` and attached as a bearer header by `apiFetch`. `localStorage` is readable by any script executing in the origin, so a single XSS (including via a compromised dependency) exfiltrates a staff session. There is no `httpOnly` cookie, no CSP configured for the admin app, and no `SameSite` protection because no cookie is used.

There is also no staff-role check on the admin surface — client-side or otherwise. A customer token entered at `/login` will authenticate, and the admin UI will render whatever the API returns; per SEC-002 the API grants customers every declared permission, so the admin views backed by `@RequirePermission` routes will populate with real data.

The file's own comment acknowledges this is a local-dev stopgap to be replaced by an OAuth redirect into an httpOnly session cookie, which is the right target.

**Impact:** Low today given the acknowledged pre-production state and the absence of a real token, but it compounds SEC-002 (a customer credential drives the admin console) and SEC-007 (in staging, any `cognito_sub` string is a working admin token). It must not survive into any shared environment.

**Reproduction / proof:** Code trace; no live exploitation attempted (no XSS sink identified, and finding one was out of scope for this backend-focused pass).

**Recommended fix:** Implement the documented target — Cognito Hosted UI OAuth redirect issuing an `httpOnly; Secure; SameSite=Lax` session cookie, with CSRF protection on state-changing requests. Add a server-enforced staff-role requirement for every `/admin/*` API route (which SEC-002's fix provides), and a client-side redirect for non-staff users as a usability measure only. Add a strict CSP to the admin app.

**Standards mapping:** OWASP ASVS 5.0 V3.4 (cookie-based session management), V3.5 (token storage); OWASP API Security Top 10 2023 **API2:2023 Broken Authentication**.

---

## SEC-016 — Dependency advisories (informational)

**Severity:** Low
**Confidence:** High

`pnpm audit --audit-level=high` at the repository root reports 12 vulnerabilities: 1 critical, 4 high, 7 moderate. Verified characterization:

| Advisory | Path | Reachable? |
|---|---|---|
| Vitest UI arbitrary file read (critical) | `packages__validation > vitest` | **No.** The only vitest script in the repo is `packages/validation/package.json:10` → `"test": "vitest run"`. `--ui` is never invoked, and `@vitest/ui` is not installed. Not exploitable as used. |
| `vite` (high) | `packages__validation > vitest > vite` | **No.** Dev/test-time only; not a runtime dependency of `apps/api`. |
| `lodash` (high) | `apps__api > @nestjs/swagger > lodash` | **Not attacker-reachable.** `@nestjs/swagger` *is* loaded by `apps/api` at bootstrap (`main.ts:5`), but only to build the OpenAPI document from decorator metadata — no request data flows into it. |
| `js-yaml` ×2 (high, quadratic CPU on parse) | `apps__api > @nestjs/swagger > js-yaml` | **Not attacker-reachable.** These require parsing attacker-supplied YAML. `@nestjs/swagger` uses js-yaml to *serialize* the generated document for `/docs-yaml`; no user-supplied YAML is ever parsed by the API. |

Conclusion: no advisory in the current set is reachable from the request-handling path of `apps/api`. They remain worth patching on the normal maintenance cadence, and `@nestjs/swagger` should be upgraded (it also pulls the js-yaml and lodash chains). Note that `@nestjs/swagger` is pinned at `^8.0.0` while the rest of the Nest platform is `^11.0.0` — worth confirming that pairing is intentional.

**Recommended fix:** Upgrade `@nestjs/swagger` and `vitest` to patched majors; add `pnpm audit --audit-level=high` to CI as a non-blocking report initially, escalating to blocking once the current set is cleared.

---

## Summary

The Nauterio backend has a well-conceived security architecture on paper — a documented permission chain traceable to spec §27.3, transactional audit atomicity, idempotency enforcement, append-only database triggers, money as integer minor units, and typed adapter boundaries with no real provider credentials anywhere in the tree — but that architecture is not actually load-bearing at runtime. The central defect is that authorization was designed to depend on record context (owner, organisation, warehouse, amount) while being invoked exclusively from a NestJS guard that runs before any record is loaded and never supplies it; every scope check in `evaluatePermission` is consequently a structural no-op, and because non-staff roles were deliberately exempted from the role-baseline allowlist on the assumption that those scope checks would catch them, the result is that **every authenticated customer is granted every permission in the catalogue**. Layered on top, `PermissionGuard` returns `true` for the 12 of 19 routes that never declared a permission, so account suspension is unenforceable on those routes and no service performs an independent ownership check — leaving six record-read routes and one write route fully open across tenants, verified live with a plain customer account reading another customer's shipment (including `INTERNAL`-visibility compliance notes), invoice, identity-document S3 path, customs case, pickup schedule, and organisation membership roster, and filing a claim against a shipment they do not own. The single worst instance is an undecorated handler parameter that silently drops the tenant filter and returns **every** organisation's API client and webhook records — hashed secrets and internal endpoint URLs included — to anyone with an account, regardless of the URL. Two further systemic issues compound the picture: the dev authentication passthrough is gated by a `!== "production"` deny-list, so a `staging` deployment allows impersonation of any user including `SUPER_ADMIN` by presenting their `cognito_sub` as a bearer token, and the `Idempotency-Key` namespace is global rather than per-caller, allowing cross-user response replay and silent write suppression. Encouragingly, the individual mechanisms are mostly correct where they are applied — the shipment *list* query is properly scoped, the public tracking service correctly filters internal events, the claim write is genuinely transactional with its audit row, error responses leak no stack traces, no real secrets or provider credentials exist anywhere in the repository, `.env` files are correctly gitignored, and no webhook receivers exist yet to forge. The remediation is therefore less about inventing new controls than about making the existing ones mandatory: give customer roles an explicit action allowlist immediately, move account-status enforcement into `AuthGuard`, make `PermissionGuard` fail closed on a missing decorator, and require every single-record query to carry its ownership predicate in the `where` clause so the database enforces tenancy rather than a convention.

---

## Coverage note

**Verified by direct code trace and live exploitation against a running API:**

- **HTTP route enumeration** — VERIFIED. All 19 routes enumerated from the NestJS `RouterExplorer` startup map and cross-checked against all 19 module files. Complete inventory: `POST /v1/quotes`, `POST /v1/bookings`, `POST /v1/claims`, `POST /v1/me/addresses`, `GET /v1/me`, `GET /v1/me/notifications`, `GET /v1/me/support-tickets`, `GET /v1/shipments`, `GET /v1/shipments/:id`, `GET /v1/shipments/:shipmentId/customs-case`, `GET /v1/shipments/:shipmentId/pickup-delivery`, `GET /v1/tracking/:trackingNumber`, `GET /v1/invoices/:id`, `GET /v1/documents/:id`, `GET /v1/business/organisations/:id`, `GET /v1/business/organisations/:organisationId/api-clients`, `GET /v1/content/pages/:slug`, `GET /v1/admin/warehouses`, `GET /v1/admin/reports/operational-summary`.
- **Webhook receivers** — VERIFIED ABSENT. No inbound webhook route exists (confirmed against the full route map; the only `POST` routes are the four listed above). `WebhookEndpoint` records are outbound-delivery configuration only, and no delivery code exists yet. Signature verification, replay windows, and forged-provider handling are therefore **NOT APPLICABLE** today and must be audited when that code lands.
- **Message consumers / workers** — VERIFIED by code read (`apps/worker/src/*`). `outbox-relay.ts`, `notifications-email.job.ts`, `retention.job.ts`, `local-queue-adapter.ts` reviewed. Inputs originate from the platform's own `outbox_events` table, not from an external boundary, and `LocalMockMessagingAdapter` sends nothing. No injectable input path found. The `outbox_events` append-only trigger correctly blocks only `DELETE` (not `UPDATE`), so the relay's status transitions are not broken — explicitly checked. The retention sweep only transitions `DELIVERED → ARCHIVED` on shipments with `legal_hold = false` and deletes nothing. No findings.
- **Scheduled jobs** — VERIFIED. Only the in-process `setInterval` retention sweep in `apps/worker/src/main.ts:25-34`. No external trigger surface.
- **Admin surfaces** — PARTIALLY VERIFIED. The two `/v1/admin/*` API routes were exploited live (SEC-002). The `apps/admin` Next.js app's auth mechanism was reviewed statically (SEC-015); its UI was not exercised in a browser and no XSS hunt was performed.
- **Guard → service → Prisma tracing** — VERIFIED for all 19 routes.
- **Secret scanning** — VERIFIED CLEAN. `grep` for `sk_live`, `sk_test`, `AKIA`, `-----BEGIN`, `xoxb-`, `AIzaSy`, and inline `password=`/`secret=`/`apiKey=` assignments across `apps/*/src`, `packages/*/src`, and `infra/` returned no matches. `git ls-files | grep -i '\.env'` returns only `packages/database/.env.example`; the four real `.env` files on disk are untracked and correctly covered by `.gitignore`. No real Stripe/DHL/FedEx/Twilio/SES SDK or credential exists anywhere — `packages/integrations` contains typed interfaces and `LocalMock*` implementations only, as documented.
- **Database constraints and triggers** — VERIFIED by reading `20260807024500_constraints_and_triggers/migration.sql` and by live `psql` inspection. Append-only triggers confirmed on `audit_events` (UPDATE+DELETE), `inbox_events` (UPDATE+DELETE), `payment_events` (UPDATE+DELETE), `package_movements` (UPDATE+DELETE), `outbox_events` (DELETE only), `tracking_events` (DELETE only). Non-negative money CHECK constraints confirmed across all monetary tables.
- **Dependency advisories** — VERIFIED, including reachability analysis (SEC-016).

**NOT VERIFIED (no capability in this environment — these are gaps in evidence, not failures):**

- **AWS / Cognito / IAM / KMS / S3 / WAF / SQS.** No AWS account or deployed environment exists. `infra/cdk` was inventoried (`network`, `data`, `compute`, `edge`, `security`, `observability` stacks) but not audited line by line, not synthesized, and not deployed. Bucket policies, KMS key policies, security groups, IAM least-privilege, WAF rules, and TLS configuration are **NOT VERIFIED**. Real Cognito JWT/JWKS verification does not exist yet (SEC-007), so no assertion can be made about token validation, signature checking, audience/issuer pinning, expiry handling, or session revocation in a production configuration.
- **Production configuration.** The API was only ever run with `NODE_ENV=development` and `NODE_ENV=staging`. `NODE_ENV=production` behaviour is asserted from code reading only — `AuthGuard.resolveCognitoSub` throws there, which means the API is currently **unable to authenticate anyone in production**; this was not exercised live.
- **Document upload / storage pipeline.** The quarantine → signature/type verification → malware scan → promote flow described in `CLAUDE.md` does not exist in code. Only the metadata read path is implemented. **NOT VERIFIED / NOT IMPLEMENTED** — must be audited when built.
- **Payment, refund, and invoice write paths.** No payment creation, refund, dispute, or invoice issuance code exists. Financial manipulation vectors are **NOT VERIFIABLE** today. SEC-010's approval-limit defects are latent and will activate with this module.
- **Partner API authentication.** `ApiClient`/`ApiKey` records exist in the schema but no API-key authentication path is implemented. **NOT VERIFIED / NOT IMPLEMENTED.**
- **TLS, CORS, and security headers.** No CORS configuration and no Helmet/security-header middleware were found in `apps/api/src/main.ts`. Whether this is intended to be handled at CloudFront/ALB was **NOT VERIFIED** — flagged here for the infrastructure audit rather than raised as an application finding.
- **Health check endpoint.** Confirmed absent (no route in the map). Out of remit for this security pass; referred to the reliability audit, though note it means ECS/ALB has no liveness signal.
- **Denial-of-service depth testing.** Not performed beyond the rate-limit probe in SEC-008 — no payload-size, connection-exhaustion, algorithmic-complexity, or Prisma connection-pool saturation testing. Note `apps/api/src/main.ts` sets no request body size limit beyond Express's default 100 kB.
- **Frontend (`apps/web`) and XSS.** Out of scope for this backend pass.

**Test-data cleanup:** All `SECAUDIT` fixtures were removed (organisation, organisation member, API client, API key, webhook endpoint, invoice, document, document version, customs case, pickup, addresses, claims, idempotency records, and the `secaudit-victim` user). Three artifacts could not be removed and remain in the local dev database:

1. The `secaudit-attacker` user row — undeletable because of SEC-011 (its `audit_events` rows block the FK's `SET NULL`).
2. The `NT-SECAUD1-US` shipment — its `owner_user_id` and `organisation_id` were nulled, but the row is retained by the `tracking_events` FK (`onDelete: Restrict`).
3. One `tracking_events` row (`reason = 'SECAUDIT audit probe row'`) — the append-only trigger blocks `DELETE`, as the audit brief anticipated.

Seven `audit_events` rows generated by the claim probes also remain and are likewise immutable by design. None of these contain real customer data; all are clearly marked with the `SECAUDIT` prefix.

**Note on an unattributed observation:** four `claims` rows with the description `"AUDIT TEST claim - unowned shipment"` were found in the database at `2026-08-07 10:03:40`, attributed to the `secaudit-attacker` user but **not** issued by this audit (this audit's two claim probes are separately accounted for at 10:00:53 and 10:01:42). They appear to originate from another process exercising the same locally-running API during this window. They were removed during cleanup. Flagging it because it means the local API and database may not have been exclusively under this audit's control, and any timing-sensitive observation should be re-confirmed before being relied upon.

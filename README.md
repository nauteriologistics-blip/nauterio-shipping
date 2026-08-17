# Nauterio Logistics

Pre-launch logistics platform focused on the Italy–United States trade lane. The monorepo contains the public/customer web app, staff admin, NestJS API, background worker, shared packages, Prisma data model and AWS CDK infrastructure.

## Getting started

Requirements: Node.js 24+, pnpm 11.20 and PostgreSQL. Copy the database environment example, generate the Prisma client, migrate and seed before starting the applications.

```sh
cp packages/database/.env.example packages/database/.env
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:migrate
pnpm db:seed

pnpm dev:api
pnpm dev:worker
pnpm dev:web
pnpm dev:admin
```

The web app runs on `http://localhost:3000`, the API on `http://localhost:4000`, and admin on `http://localhost:4100`.

## Quality checks

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Important product status

Nauterio is pre-launch. Pricing is indicative, real carrier/payment/broker integrations are not complete, and the platform must not be represented as accepting production shipments until the acceptance evidence in `docs/sections/41-39-final-acceptance-criteria.md` is complete.

The complete product and technical specification is indexed in `docs/specification-index.md`. Architectural decisions and operational runbooks live in `docs/decisions` and `docs/runbooks`.

## Repository layout

- `apps/web` — public website, customer portal, warehouse and driver surfaces
- `apps/admin` — staff administration console
- `apps/api` — NestJS API
- `apps/worker` — asynchronous jobs and outbox relay
- `packages` — contracts, validation, database, integrations and shared tooling
- `infra/cdk` — AWS infrastructure definitions

Never commit real credentials or customer data. Local authentication and mock provider adapters are development-only.

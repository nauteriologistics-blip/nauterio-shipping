---
name: nauterio-bootstrap
description: Safely scaffolds the Nauterio monorepo and development foundation. Invoke when creating the repository, applications, packages, local services, environment templates, or baseline CI for the first time.
disable-model-invocation: true
compatibility: Claude Code project skill; requires Node.js 24 LTS, pnpm, Docker, and Git.
---

# Bootstrap the Nauterio Project

Only run after the user explicitly invokes this skill.

## Preflight

1. Inspect the current directory. Do not overwrite an existing project.
2. Confirm Node.js 24 LTS, Corepack/pnpm, Docker, Git, and AWS CDK prerequisites.
3. Detect existing `package.json`, workspace, Git history, environment files, and CI.
4. Show the proposed files and commands before executing destructive or network-heavy steps.
5. Never create production AWS resources during bootstrap.

## Target monorepo

```text
apps/
  web/        # public site and customer/business portal
  admin/      # staff administration
  api/        # NestJS REST API
  worker/     # queues, scheduled work, integrations
packages/
  ui/         # design-system components
  contracts/  # shared API types and schemas
  database/   # Prisma schema, client, migrations
  config/     # shared TypeScript, ESLint and environment schemas
  integrations/
  testing/
  observability/
infrastructure/
  cdk/
docs/
```

## Required foundation

- TypeScript strict mode.
- pnpm workspaces.
- Next.js App Router applications.
- NestJS modular API and worker.
- Prisma 7 with PostgreSQL driver adapter.
- Docker Compose for local PostgreSQL and any local emulators chosen by the team.
- Central environment validation; commit `.env.example`, never secrets.
- ESLint, Prettier, type checking, unit tests, integration tests, and build scripts.
- GitHub Actions for validation only; production deployment remains disabled until approved.
- Conventional migration and seed scripts.
- Health endpoints and structured logging from the start.
- `docs/decisions`, `docs/implementation`, and `docs/runbooks` directories.

## Baseline commands

Create workspace commands for:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:integration`
- `pnpm test:e2e`
- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm validate`

## Completion gate

Bootstrap is complete only when a clean checkout can install, start local dependencies, run all validation commands, open each application shell, reach the API health endpoint, and connect to a disposable local database.

## References

- `docs/sections/22-20-approved-technology-stack.md`
- `docs/sections/24-22-domains-environments-and-aws-infrastructure.md`
- `docs/sections/25-23-application-and-repository-organisation.md`
- `docs/sections/38-36-ci-cd-releases-and-maintenance.md`

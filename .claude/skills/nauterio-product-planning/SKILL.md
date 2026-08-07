---
name: nauterio-product-planning
description: Converts the Nauterio specification into phases, epics, stories, work packages, dependencies, and acceptance criteria. Use when planning the backlog, estimating scope, sequencing work, or preparing an AI coding prompt.
compatibility: Claude Code project skill for product planning and delivery governance.
---

# Nauterio Product Planning

Create implementation-ready work packages that a human or coding agent can execute without guessing.

## Work-package contents

Every work package must contain:

1. Goal in plain language.
2. User role and business value.
3. Governing specification sections.
4. In-scope and explicitly out-of-scope items.
5. User flow and alternate/error flows.
6. UI pages and reusable components.
7. API endpoints and contracts.
8. Entities, fields, constraints, indexes, migrations, and retention.
9. Permissions, privacy, audit, and security requirements.
10. External integrations, events, queues, retries, and idempotency.
11. Analytics and operational telemetry.
12. Unit, integration, end-to-end, accessibility, performance, and security tests.
13. Fixtures and test data.
14. Documentation and runbooks.
15. Dependencies, assumptions, risks, and required business evidence.
16. Measurable acceptance criteria and evidence expected.

## Sizing rules

- Prefer vertical slices that can be demonstrated end to end.
- One work package should normally fit one focused pull request or a short sequence of dependent pull requests.
- Split packages when they touch unrelated domains, require separate approvals, or cannot be independently tested.
- Do not create a “build whole platform” task.

## Definition of ready

A package is ready only when its fields, statuses, permissions, dependencies, acceptance criteria, and test approach are known.

## Definition of done

A package is done only when code, migrations, tests, accessibility, telemetry, audit, documentation, and traceability are complete and the relevant acceptance criteria pass.

## References

- `docs/sections/07-5-end-to-end-operating-journeys.md`
- `docs/sections/26-24-functional-modules.md`
- `docs/sections/40-38-ai-assisted-build-protocol.md`
- `docs/sections/41-39-final-acceptance-criteria.md`

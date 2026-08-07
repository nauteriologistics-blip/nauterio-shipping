---
name: nauterio-feature-builder
description: Implements one complete Nauterio feature as a safe vertical slice. Invoke with a feature or work-package name after requirements are ready.
disable-model-invocation: true
compatibility: Claude Code project skill for controlled implementation work.
---

# Implement a Nauterio Feature

Requested feature: `$ARGUMENTS`

## Before editing

1. Find the approved work package or create a proposal with `nauterio-product-planning`.
2. Read every governing specification section.
3. Inspect existing code, migrations, tests, and conventions.
4. List affected modules, pages, API contracts, entities, permissions, audit events, integrations, queues, analytics, and documentation.
5. State assumptions and blockers. Stop if company evidence or credentials are essential.
6. Present the planned file changes and migration strategy.

## Implementation order

1. Shared contracts and validation.
2. Database constraints and migration.
3. Domain rules and application service.
4. API/controller and authorisation.
5. Events, queues, adapters, and audit.
6. UI and all required states.
7. Tests at appropriate levels.
8. Telemetry, documentation, traceability, and runbook.

## Safety

- Do not weaken types, permissions, audit, validation, or tests to make the feature pass.
- Do not use real production credentials or send real messages.
- Do not perform irreversible migrations or deployments without explicit approval.
- Preserve backward compatibility for rolling deployment.

## Completion

Run the narrowest relevant checks first, then the complete validation command. Provide exact command results and identify anything not run.

## References

- `docs/sections/40-38-ai-assisted-build-protocol.md`
- `docs/sections/41-39-final-acceptance-criteria.md`

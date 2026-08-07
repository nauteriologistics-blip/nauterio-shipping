---
name: nauterio-page-builder
description: Builds one complete Nauterio screen from the 201-screen catalogue. Invoke with a page name when implementing a public, portal, admin, warehouse, driver, status, or developer page.
disable-model-invocation: true
compatibility: Claude Code project skill for page-level vertical slices.
---

# Build a Nauterio Page

Requested page: `$ARGUMENTS`

Do not start coding until the exact page exists in Appendix A or B, or the user approves a new page.

## Workflow

1. Find the page in `docs/sections/42-appendix-a-complete-201-screen-inventory.md` and its blueprint in `docs/sections/43-appendix-b-screen-by-screen-implementation-blueprints.md`.
2. Identify its application, route, audience, business goal, primary action, secondary actions, required data, permissions, privacy rules, analytics, and acceptance rule.
3. Read the relevant area section: public site, customer portal, business portal, admin, warehouse, driver, status, or developer.
4. Reuse existing design-system components. Create a new primitive only when the component library lacks the necessary pattern.
5. Define route metadata, localisation keys, loading UI, empty state, validation state, provider failure, permission denial, session expiry, success state, and archived state where applicable.
6. Implement server/client boundaries deliberately. Do not convert a page to a client component without need.
7. Connect typed API contracts. Never mock success in production code.
8. Enforce server-side permission checks and data minimisation.
9. Add analytics without sensitive values.
10. Add unit/component tests and an end-to-end happy path plus the most important failure path.
11. Run visual, keyboard, responsive, and accessibility checks.
12. Update traceability and page implementation status.

## Page completion evidence

Report:

- Route and page title.
- Blueprint requirements satisfied.
- Components reused or added.
- API/data dependencies.
- Permissions and masked fields.
- All states implemented.
- English and Italian status.
- Tests and screenshots generated.
- Remaining business content placeholders.

## References

- `docs/sections/08-6-information-architecture-and-screen-count.md`
- `docs/sections/42-appendix-a-complete-201-screen-inventory.md`
- `docs/sections/43-appendix-b-screen-by-screen-implementation-blueprints.md`

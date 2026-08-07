---
name: nauterio-frontend-nextjs
description: Implements and reviews Nauterio frontend code in Next.js and React. Use for routes, layouts, server components, client components, forms, data fetching, localisation, PWA behaviour, performance, and reusable UI.
compatibility: Next.js 16, React, TypeScript, pnpm monorepo.
---

# Nauterio Frontend Engineering

## Architecture

- Use Next.js App Router.
- Keep `apps/web` and `apps/admin` as separate deployments.
- Default to server components. Add `use client` only for actual interactivity or browser APIs.
- Keep business rules in shared domain/API modules, not in presentation components.
- Use shared typed contracts and validation schemas.
- Keep public tracking usable without an account while protecting sensitive details.
- Support English and Italian from the start; do not hardcode visible text in components.

## Data and forms

- Validate on both client and server.
- Use accessible labels, descriptions, error summaries, field-level errors, sensible autocomplete, and preserved user input.
- Use URL state for shareable filters and searches where appropriate.
- Never place secrets or privileged integration logic in the browser.
- Avoid sequential data-fetch waterfalls; parallelise independent server requests.
- Define loading, error, not-found, unauthorised, and empty states.

## Performance

- Use version-matched Next.js documentation bundled with the installed framework when available.
- Minimise client JavaScript and third-party scripts.
- Optimise images and fonts.
- Stream or paginate large data sets.
- Use caching only with explicit freshness and invalidation rules.
- Track Core Web Vitals and real-user errors.

## PWA rules

Warehouse and driver PWAs may cache assignments and queue authorised offline actions. They must show synchronisation state, preserve original action time, prevent duplicates, and never allow offline finance, permission, or irreversible administrative operations.

## Quality

- TypeScript strict; no unexplained `any`.
- Semantic HTML and WCAG 2.2 AA.
- Component tests for complex interactions.
- Playwright tests for complete user journeys.
- Do not ship placeholder text, fake counters, fabricated testimonials, or mocked operational data.

## References

- `docs/sections/10-8-global-navigation-and-reusable-components.md`
- `docs/sections/11-9-public-website-page-specifications.md`
- `docs/sections/12-10-customer-portal.md`
- `docs/sections/13-11-business-portal.md`
- `docs/sections/15-13-warehouse-pwa.md`
- `docs/sections/16-14-driver-pwa.md`
- `docs/sections/25-23-application-and-repository-organisation.md`

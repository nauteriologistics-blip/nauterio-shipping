---
name: nauterio-design-system
description: Applies the Nauterio brand, design tokens, component patterns, responsive rules, and professional logistics visual language. Use when designing or implementing any interface, component, layout, icon, status, form, table, or page shell.
compatibility: Claude Code project skill for Next.js, React, and CSS design-system work.
---

# Nauterio Design System

Build a restrained, professional logistics interface. Do not create flashy startup visuals, excessive gradients, glassmorphism, glowing effects, oversized rounded cards, or decorative animation.

## Brand direction

- Selected mark: simple navy sail with an orange wave and horizontal wordmark.
- Primary navy: `#081F3D`.
- Navy 800: `#0B2E5E`.
- Brand blue: `#123F7A`.
- Action orange: `#F28C18`.
- Orange pressed: `#D97706`.
- Ink: `#0B1220`.
- Slate: `#334155`.
- Muted: `#64748B`.
- Mist: `#F3F6FA`.
- Success: `#15803D`.
- Warning: `#B45309`.
- Error: `#B91C1C`.
- Info: `#1D4ED8`.

Use colour semantically and never communicate status by colour alone.

## Visual rules

- White and mist backgrounds dominate.
- Navy is the trust and structure colour.
- Orange is a controlled action/movement accent, not a page background.
- Use one dominant call to action per section.
- Prefer clear borders and subtle shadows over floating glass cards.
- Use consistent professional line icons; never use emoji as interface icons.
- Preserve logo clear space and provide full-colour, navy-only, white-reverse, and black-only variants.

## Layout

- Mobile first.
- Use a 12-column desktop grid and clear content maximum widths.
- Maintain predictable spacing tokens rather than arbitrary values.
- Forms use one column on narrow screens and controlled multi-column layouts only when scanning improves.
- Data tables must have responsive alternatives, horizontal containment, and meaningful empty states.
- Page headers state the task, current context, and primary action.

## Components

Build and document reusable components for navigation, buttons, links, inputs, selects, comboboxes, address fields, package dimensions, steppers, cards, tables, filters, status chips, timelines, alerts, dialogs, drawers, tabs, breadcrumbs, pagination, file upload, document preview, barcode display, maps, charts, skeletons, empty states, permission states, and error summaries.

Every component needs variants, states, accessibility notes, keyboard behaviour, responsive behaviour, tests, and Storybook or equivalent examples if the project adopts a component workshop.

## Accessibility

Target WCAG 2.2 AA. Use semantic HTML, visible focus, labelled controls, logical heading order, error summaries, reduced motion, sufficient contrast, and keyboard-complete interaction.

## References

- `docs/assets/nauterio-logo.png`
- `docs/sections/09-7-brand-and-visual-design-system.md`
- `docs/sections/10-8-global-navigation-and-reusable-components.md`
- `docs/sections/20-18-content-legal-privacy-and-accessibility.md`

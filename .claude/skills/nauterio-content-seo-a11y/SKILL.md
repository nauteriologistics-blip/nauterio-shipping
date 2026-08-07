---
name: nauterio-content-seo-a11y
description: Creates and reviews Nauterio public content, localisation, SEO, privacy-aware analytics, and accessibility. Use for page copy, English/Italian text, metadata, structured data, forms, help content, legal placeholders, and UI audits.
compatibility: Bilingual public and portal content targeting WCAG 2.2 AA.
---

# Nauterio Content, SEO, Localisation, and Accessibility

## Content voice

- Direct, professional, calm, and operational.
- Explain next actions and responsibilities clearly.
- Avoid invented delivery promises, false urgency, exaggerated claims, fake reviews, fake counters, unsupported certifications, and vague customs guarantees.
- Use plain language without becoming casual.
- Keep customer-visible tracking messages factual and reassuring.

## Localisation

- English and Italian are first-class, not machine-translated afterthoughts.
- Use stable message keys, locale-aware dates, times, numbers, weights, dimensions, and currencies.
- Do not concatenate translated fragments.
- Allow longer Italian text without layout breakage.
- Record untranslated strings in CI.

## SEO

- Server-render public pages with descriptive titles, descriptions, canonical URLs, sitemap, robots controls, Open Graph data, and English/Italian `hreflang`.
- Use structured data only where accurate.
- Exclude portals, tracking results, payment pages, documents, APIs, and internal searches from indexing.
- Create useful route/service/customs/help content instead of thin duplicated pages.

## Accessibility

- Semantic landmarks and headings.
- Keyboard-complete operation and visible focus.
- Labels, instructions, autocomplete, and error summary for forms.
- Text alternatives for meaningful images.
- Captions/transcripts for media.
- Reduced motion and no time pressure without control.
- Status communicated with text/icon, not colour alone.
- Accessible tables and responsive alternatives.

## Analytics and consent

Record funnel and operational events without sensitive field values. Do not load non-essential analytics or advertising before valid consent. Separate operational and marketing consent.

## References

- `docs/sections/20-18-content-legal-privacy-and-accessibility.md`
- `docs/sections/21-19-analytics-reporting-and-success-measures.md`
- `docs/sections/11-9-public-website-page-specifications.md`

---
name: nauterio-spec-guardian
description: Enforces Nauterio requirements and traceability. Use when interpreting the specification, reviewing scope, handling a change request, resolving ambiguity, or checking whether an implementation matches the approved product.
compatibility: Claude Code project skill for Nauterio requirements governance.
---

# Nauterio Specification Guardian

Protect the approved product from requirement drift.

## Rules

- The complete specification is normative. Use exact headings and page names when discussing scope.
- Distinguish mandatory `must/shall`, recommended `should`, and optional `may` requirements.
- Do not silently reinterpret a business rule to fit existing code.
- When requirements conflict, stop the affected change and present the conflict with the smallest safe options.
- Record every approved deviation in `docs/decisions/` as an ADR and update the traceability ledger.
- Company-specific facts that require evidence remain placeholders until supplied. Mark them `REQUIRES_BUSINESS_EVIDENCE`; never fabricate them.
- A feature is not complete if its empty, loading, validation, provider-failure, permission-denied, session-expired, completed, and archived states are missing where relevant.
- A page is not complete if accessibility, analytics, privacy, localisation, responsive behaviour, and support escalation are omitted.

## Change-control workflow

1. Quote or paraphrase the governing requirement and cite its section heading.
2. State the requested change and why it is needed.
3. List product, operations, data, security, legal, cost, schedule, migration, and testing effects.
4. Classify as clarification, defect correction, enhancement, architectural change, or deferred item.
5. Recommend accept, reject, defer, or run a spike.
6. Do not implement an architectural or legal-policy change until approved.
7. Write an ADR for accepted decisions that affect multiple modules or future work.

## Traceability format

Maintain `docs/implementation/traceability.md` with:

| Requirement | Spec section | Code | Tests | Status | Evidence | Dependency |
|---|---|---|---|---|---|---|

## References

- `docs/sections/01-document-control.md`
- `docs/sections/04-2-research-benchmark-and-design-principles.md`
- `docs/sections/41-39-final-acceptance-criteria.md`

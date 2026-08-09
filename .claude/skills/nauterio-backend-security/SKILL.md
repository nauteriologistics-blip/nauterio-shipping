---
name: nauterio-backend-security
description: Use for an adversarial backend security audit of Nauterio. Focuses on OWASP ASVS 5.0.0 and API Security Top 10 risks, authentication, authorization and ownership, business-flow abuse, NestJS configuration, Cognito/JWT validation, injection, SSRF, mass assignment, rate limits, CORS, webhooks, Stripe, S3/file access, secrets, logging/PII, supply-chain risk, and AWS exposure. Requires evidence and safe verification before reporting vulnerabilities.
---

# Nauterio Backend Security Audit

Adopt an adversarial application-security mindset while remaining non-destructive.

## Primary question
For every externally reachable route, webhook, worker input, file operation, and staff action: **what can an unauthenticated user, ordinary customer, malicious business user, compromised staff user, forged provider, or bot make the backend do that it should not do?**

## Workflow

1. Enumerate all HTTP routes, webhooks, GraphQL/RPC endpoints if any, public assets/download handlers, message consumers, scheduled jobs, admin/debug surfaces, and integration callbacks.
2. Classify each by authentication requirement, authorization rule, data sensitivity, state change, financial effect, and abuse potential.
3. Trace each high-risk path into services and database queries. Guards/decorators alone are not proof of authorization.
4. Apply the detailed checklist in `references/security-checklist.md` and the common Nauterio invariants.
5. Verify suspicious code with safe tests, targeted test cases, or precise control-flow proof.
6. Search for sibling routes using the same vulnerable helper/pattern.
7. Report only verified or clearly evidence-backed issues.

## Severity orientation

**Critical:** practical route to RCE, unrestricted secret exposure, broad cross-tenant compromise, irreversible financial compromise, or destructive production data access.

**High:** cross-customer private data/action, staff privilege escalation, payment/refund manipulation, private document exposure, forged trusted webhook with material side effect, SQL/command injection with meaningful impact.

**Medium:** bounded security bypass, exploitable abuse/resource exhaustion, sensitive information leakage, weak control requiring significant preconditions.

**Low:** hardening gap with limited direct impact.

## Required report behavior

For every issue include exact file:line evidence, actor/preconditions, attack path, impact, root cause, safe reproduction or proof, recommended correction, regression test, and standards mapping when confident.

Do not call absence of an optional defense a vulnerability unless the threat model makes it necessary.

## References

Read:
- `references/security-checklist.md`
- `../_nauterio-backend-common/references/business-invariants.md`
- `../_nauterio-backend-common/references/stack-checklist.md`
- `../_nauterio-backend-common/references/finding-schema.md`

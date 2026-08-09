---
name: nauterio-finding-verifier
description: Use after a backend audit to aggressively verify or falsify reported findings. Re-reads the code from scratch, traces all guards/callers/constraints/tests, searches for compensating controls, performs safe reproductions when possible, adjusts severity, removes duplicates and false positives, and produces a verified findings set. Especially important for Critical, High, concurrency, authorization, and payment findings.
---

# Nauterio Backend Finding Verifier

Your job is **not** to defend the audit. Your job is to prove it wrong wherever possible.

Take each candidate finding independently. Assume the original reviewer may have missed a guard, DB constraint, provider guarantee, caller validation, transaction wrapper, framework behavior, or test.

## Verification gate

For every candidate finding:

1. Restate the precise claimed invariant violation in one sentence.
2. Re-open every cited file. Do not trust copied snippets.
3. Trace all callers and all relevant guards/interceptors/pipes/middleware.
4. Inspect the Prisma schema/migrations for constraints that may invalidate the claim.
5. Search for tests that cover the scenario.
6. Search for compensating controls in infrastructure/provider configuration when relevant.
7. Attempt a safe reproduction or construct a rigorous control-flow/concurrency proof.
8. Search for contradictory evidence.
9. Decide:
   - **VERIFIED** — evidence supports exploit/failure path.
   - **VALID BUT LOWER SEVERITY** — real issue, impact/preconditions overstated.
   - **DUPLICATE/ROOT-CAUSE MERGE** — same underlying control failure as another issue.
   - **NOT PROVEN** — suspicious but insufficient evidence; move to unverified/gap section.
   - **FALSE POSITIVE** — control exists or claimed path cannot occur.
10. Record why.

## Special verification requirements

### Authorization
A missing local guard is not automatically a vulnerability. Check global guards, service-level ownership checks, repository/query scoping, and parent-resource validation. Conversely, a role guard alone is not proof of object ownership.

### SQL injection
A raw query is not automatically injectable. Determine whether variables are parameterized and whether dynamic identifiers/order clauses are allowlisted. Unsafe APIs are leads, not verdicts.

### Concurrency
Provide at least one concrete T1/T2 interleaving that reaches an invalid state and show why a unique constraint/transaction/lock does not already prevent it.

### Webhooks
Confirm provider signature logic, raw-body handling, event deduplication, and authoritative state fetching before claiming forgery/replay issues.

### Performance
Do not call a query slow merely because it looks complex. Show unbounded growth, N+1 behavior, missing supporting index, repeated external work, lock amplification, or measured/credible scale impact.

### Infrastructure
Distinguish code-proven configuration from settings that may live only in the cloud console. If not visible, label as NOT VERIFIED rather than FAIL.

## Output

Create `BACKEND_AUDIT_VERIFICATION.md` containing:
- original finding ID;
- verdict;
- confidence;
- evidence checked;
- contradictory evidence;
- severity adjustment;
- final wording if retained.

Then update the final audit report only with verified findings. Preserve an appendix of rejected findings and why they were rejected so the audit trail remains transparent.

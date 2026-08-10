# apps/web — sign-in, sign-up, language, portal landing: current-state audit

**Status: all four gaps below (§1-4) are now fixed and live-verified in a real browser** — see `docs/implementation/traceability.md` and `docs/implementation/ledger.md` for the implementation and evidence. This document is kept as-is as the original pre-fix findings record, not updated in place, so the file:line references and "does not exist" language below describe the state *before* the fix, not the current state. §5's other gaps (driver/warehouse sign-in, business portal, the booking wizard's hardcoded defaults) were also addressed where in scope for the customer portal; real Stripe payment and real Cognito remain out of scope by explicit decision.

Scope: `apps/web` only (the public site + customer portal). Not `apps/admin` (already rebuilt this session, real auth) or the warehouse/driver PWAs (not built yet — see §5). Read-only analysis, no code changed **at the time this was written**. Every claim below is checked against source as it stood then, file:line referenced.

## 1. Sign-in / sign-up — does not exist

There is no `/signin`, `/register`, `/login`, or equivalent route anywhere under `apps/web/src/app`. The spec (`docs/sections/42-appendix-a-...md` rows 75-76) calls for exactly these two routes; neither was built.

The "Sign In" link in the header (`apps/web/src/components/Header.tsx:72-77`) just navigates to `/portal` — no credential check, no session, nothing gating it:

```tsx
<Link href="/portal" className="...">Sign In</Link>
```

`apps/web/src/app/portal/page.tsx` has no auth guard at all — anyone who types the URL sees a fully "logged in" dashboard. It's not a broken login flow; a login flow was never wired to it.

One place *does* call the real API with a bearer token — `apps/web/src/app/portal/bookings/new/page.tsx:56` — but the token is a hardcoded literal, not a real session:
```tsx
Authorization: "Bearer local-dev-user-id",
```

**Backend reality check:** the API has real Cognito-token verification (`apps/api/src/common/guards/cognito-jwt-verifier.ts`) and a `GET /v1/me` endpoint, but:
- **No real Cognito user pool exists anywhere** — confirmed in `infra/cdk/lib/compute-stack.ts:150` (`// NOT set here: no real Cognito User Pool exists yet`) and `packages/configuration/src/index.ts:13-15` (`COGNITO_USER_POOL_ID` etc. all optional/unset). The only working identity check today is `LOCAL_AUTH_MODE`'s dev passthrough (token = the user's `cognitoSub` literally), which is what `apps/admin`'s login already uses.
- **There is no account-creation endpoint.** `apps/api/src/modules/identity` and `customers.controller.ts` (`@Controller("me")`) only have `GET/PATCH profile` and `GET/POST addresses` — nothing that creates a `User` row. Sign-up isn't just a missing page; the API has nowhere for it to post to.

**The reference pattern that already works** is `apps/admin`'s SEC-015 rebuild: an httpOnly-cookie session, a Next.js Route Handler that verifies the token against `/v1/me` server-side before setting the cookie, a CSRF double-submit cookie, and a catch-all proxy route that reattaches the session as `Authorization` on every API call. Building customer sign-in the same way is straightforward. Sign-up is the harder half — see §6, question 1.

## 2. Language switching — cosmetic, does nothing

`apps/web/src/components/Header.tsx:19,64,112`:
```tsx
const [lang, setLang] = useState<"EN" | "IT">("EN");
...
<button onClick={() => setLang(lang === "EN" ? "IT" : "EN")}>
  <Globe className="w-4 h-4" /><span>{lang}</span>
</button>
```
The button only flips a local label. No i18n library is installed (checked `package.json` — no `next-intl`/`next-i18next`/`react-intl`), no translation files exist anywhere, and every page's copy is hardcoded English JSX. Clicking "IT" changes nothing on the page.

The backend already has a real per-user language field ready to be read: `apps/api/src/modules/identity/identity.module.ts:44` returns `preferredLanguage` from the profile — the frontend just never uses it.

## 3. Portal landing page — hardcoded mock, wrong content

`apps/web/src/app/portal/page.tsx` (243 lines), entirely client-side, **zero data fetching** (no `fetch`, no `useEffect`). Every number on the page is a literal array:
- Header identity is a fake persona, not a session: `<h1>Marco Rossi</h1>` / `Account ID: CUST-90182 | milano.exports@rossi-style.it` (`:67,72`)
- Two fake shipments (`:15-36`), one fake quote (`:38-40`), two fake documents (`:42-45`) — same for every visitor, logged in or not
- The "Upload Document" modal (`handleSimulateUpload`, `:47-54`) does nothing real — flips a boolean after `setTimeout(1500)`, no `fetch` call exists

It's also structurally short of spec. `docs/sections/12-10-customer-portal.md §10.1` specifies the dashboard's exact content order:
1. Action-required banner ✓ (present, but hardcoded)
2. Greeting + New Shipment/Get Quote actions ✓ (present)
3. Active shipments with status/ETA/next action ✓ (present, hardcoded)
4. **Upcoming pickup or delivery cards — missing entirely**
5. **Unpaid or customs charges — missing entirely**
6. Recent documents and invoices — partial (documents tab exists, no invoices)
7. **Recent support/claim updates — missing entirely**
8. **Route/customs guidance — missing entirely**

The component's own state type even has `"payments" | "support"` as valid tabs (`:11`) with no button or content branch ever rendering them — dead code for two of the eight required sections.

This is a real rebuild, not a patch: swap every hardcoded array for real API calls scoped to the logged-in user (once sign-in exists — see §6), and add the four missing sections.

## 4. What already works in `apps/web`

Not everything is fake. These are genuinely wired to the real NestJS API via the `next.config.ts` rewrite (`apps/web/next.config.ts:1-22`, proxies `/api/v1/*` → `NAUTERIO_API_URL`):
- `/quote` — real `POST /api/v1/quotes`, functional anonymous quote flow
- `/tracking` — real `GET /api/v1/tracking/:id`, functional public tracking
- `/portal/bookings/new` — real `POST /api/v1/bookings*` calls, but uses the hardcoded dev bearer token and hardcoded default form values (`senderName: "Acme Italy S.r.l."`) instead of the signed-in user's real data

Marketing pages (`/`, `/services`, `/customs`, `/business`, `/driver`, `/warehouse`, `/privacy`, `/terms`, `/cookies`) are static, finished copy — no lorem ipsum, no TODOs found anywhere in `apps/web/src/app`.

## 5. Other things worth flagging (the "some other things")

- **`/driver` and `/warehouse` marketing pages exist, but no driver/warehouse PWA sign-in exists either** (spec rows 170, 184: `/warehouse/signin`, `/driver/signin`). Same shape of gap as customer sign-in, different app surface — not in `apps/web`'s scope today (those are meant to be separate PWA experiences per the architecture note in `CLAUDE.md`), flagging so it isn't forgotten.
- **No business/organisation portal exists at all** — spec §11 ("Business portal") is a whole separate portal area with its own nav item, webhooks screen, etc.; `apps/web` has no `/business/portal` or equivalent, only the `/business` marketing page.
- **`terms/page.tsx:270`** explicitly promises a "Customer Portal account" registration flow in the legal text — right now that's a promise the product doesn't keep.
- **The booking wizard's hardcoded default values** (`senderName: "Acme Italy S.r.l."` etc. in `portal/bookings/new/page.tsx`) look like leftover dev-testing defaults, not intentional pre-fill — worth a decision on whether to remove them regardless of the auth work.

## 6. What I need from you before building

**1. How should sign-in/sign-up work given there's no real Cognito pool yet?**
Building against real Cognito Hosted UI isn't possible until a user pool is deployed — that's real AWS infrastructure, gated under `CLAUDE.md`'s "no production infra without approval" rule, and needs a decision on hosted-UI vs. custom UI, domain, MFA policy, etc. The fast path is the same one `apps/admin` already proved out: a real httpOnly-cookie session, gated behind `LOCAL_AUTH_MODE`, functional in dev/staging today, swapped for real Cognito later without changing the UI. I'd default to that unless you'd rather wait.

**2. How much of sign-up should I build now?**
The spec's `/register` screen covers both "register an individual" and "start business registration" in one entry. There's no account-creation endpoint at all yet — this is real API work (new endpoint, validation, an actual `User` row, deciding what "email verification" means without SES configured — see below), not just a page. Individual signup is the smaller, self-contained piece; business/organisation registration pulls in the whole unbuilt business-portal surface from §5.

**3. Email verification / password reset — build now or stub?**
Spec §27.1 requires "email verification required before sensitive actions" and short-lived password-reset tokens. Sending real email needs a verified SES sending domain, which isn't configured in this environment (no evidence of it in `infra/cdk` or `.env`) — this would be `REQUIRES_BUSINESS_EVIDENCE` (a real domain, an SES-verified identity) unless you want it stubbed/logged instead of actually sent for now.

**4. Language switching — how much translation, and by whom?**
I can wire up real i18n plumbing (`next-intl` is the standard fit for the App Router) myself — that part's a pure engineering decision, no input needed. The open question is translation *content*: I can produce reasonable Italian copy for UI strings (nav, buttons, portal), but I'd rather not auto-translate the legal pages (`/terms`, `/privacy`, `/cookies`) — mistranslating a legal term is a real risk, and `CLAUDE.md` already asks me to flag anything requiring business/legal judgment rather than invent it. Do you want: (a) plumbing + UI-string translation now, legal pages held back for real review, or (b) everything translated now including legal text, on the understanding it needs a native/legal review pass before launch?

**5. Sequencing.** This is four separable pieces of work (auth, portal rebuild, i18n, the booking-wizard cleanup in §5). Want them done together, or in a specific order? My instinct is auth first (everything else depends on a real logged-in user), then the portal rebuild, then i18n, then the small cleanup — but say if you'd rather prioritize differently.

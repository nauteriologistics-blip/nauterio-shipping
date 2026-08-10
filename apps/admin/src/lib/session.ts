/**
 * SEC-015: cookie/header name constants shared between server Route
 * Handlers and client code (`lib/api.ts` needs `CSRF_HEADER`/
 * `CSRF_PROTECTED_METHODS` to echo the CSRF cookie back as a header, so
 * this file must stay free of server-only imports like `node:crypto` -
 * that lives in `lib/session.server.ts` instead, imported only from Route
 * Handlers).
 *
 * The token itself now lives ONLY in an httpOnly cookie - no browser JS,
 * including a successful XSS payload, can read it (the entire point: a
 * single XSS in this admin app previously meant a full session steal via
 * `localStorage`, per the original finding). All API traffic is proxied
 * through this app's own Route Handlers (`app/api/v1/[...path]/route.ts`),
 * which read the cookie server-side and attach it as the real API's
 * `Authorization` header - the browser never sees the token in a form it
 * could exfiltrate.
 *
 * Real Cognito Hosted UI (ADR 0001 section 11) still doesn't exist in this
 * environment, so `SESSION_COOKIE` currently holds the same LOCAL_AUTH_MODE
 * dev-passthrough token `login/page.tsx` already asked for - only the
 * storage mechanism changes here, not the underlying identity source.
 */
export const SESSION_COOKIE = "nauterio_admin_session";
export const CSRF_COOKIE = "nauterio_admin_csrf";
export const CSRF_HEADER = "x-csrf-token";

/** Methods that mutate state and therefore need CSRF protection - cookies
 * are sent automatically by the browser on cross-site requests too (unlike
 * an Authorization header, which a cross-site page cannot set), so moving
 * auth into a cookie reintroduces the CSRF risk header-based auth didn't
 * have. The double-submit pattern (a non-httpOnly cookie the same-origin
 * page can read and echo back as a header) closes it: a cross-site
 * attacker can trigger the request but cannot read the CSRF cookie to
 * forge the matching header. */
export const CSRF_PROTECTED_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

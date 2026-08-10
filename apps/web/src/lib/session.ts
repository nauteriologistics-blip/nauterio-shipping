/**
 * Cookie/header name constants shared between server Route Handlers and
 * client code, mirroring apps/admin's SEC-015 pattern. Kept free of
 * server-only imports (`node:crypto` lives in `session.server.ts`) so this
 * file is safe to import from client components too.
 *
 * The session token lives ONLY in an httpOnly cookie - no browser JS can
 * read it. Unlike apps/admin (every route requires staff auth),
 * apps/web mixes anonymous public endpoints (quote, tracking, register)
 * with authenticated ones (portal, bookings, profile): the proxy
 * (`app/api/v1/[...path]/route.ts`) attaches the session-derived
 * Authorization header when a session cookie exists, and forwards
 * anonymously otherwise, leaving the real API's own AuthGuard to decide
 * per-route whether auth is actually required.
 *
 * Real Cognito Hosted UI still doesn't exist in this environment (see
 * `infra/cdk/lib/compute-stack.ts`), so `SESSION_COOKIE` currently holds
 * the same LOCAL_AUTH_MODE dev-passthrough token `apps/api`'s new
 * `POST /v1/auth/register` / `POST /v1/auth/verify-email` endpoints
 * generate - only the storage mechanism changes here.
 */
export const SESSION_COOKIE = "nauterio_session";
export const CSRF_COOKIE = "nauterio_csrf";
export const CSRF_HEADER = "x-csrf-token";

/** Methods that mutate state - CSRF-protected only when a session cookie is
 * actually present (see the proxy route's own comment: anonymous requests
 * have no session for a forged cross-site request to abuse). */
export const CSRF_PROTECTED_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

import { randomBytes } from "node:crypto";

/** Server-only (imports `node:crypto`) - import only from Route Handlers,
 * never from client components. See `lib/session.ts` for the shared
 * cookie/header name constants this pairs with. */
export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

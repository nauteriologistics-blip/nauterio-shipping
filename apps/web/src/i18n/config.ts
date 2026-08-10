/** Client-safe i18n constants - no `next/headers` or other server-only
 * imports here, since this is imported from client components (Header)
 * as well as server code. `src/i18n/request.ts` (server-only, reads the
 * cookie via `next/headers`) imports these too rather than duplicating
 * them. */
export const SUPPORTED_LOCALES = ["en", "it"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

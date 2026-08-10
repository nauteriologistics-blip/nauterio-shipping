import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES, type Locale } from "./config";

function isSupportedLocale(value: string | undefined): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value ?? "");
}

/**
 * No locale-prefixed routing (no /en/, /it/ URL segments) - the site's
 * existing routes (/quote, /tracking, etc.) stay exactly as they are.
 * Locale is read from a cookie the header's language switcher sets;
 * switching calls `router.refresh()` so this (and every Server Component
 * that calls `getTranslations`) re-reads it on the next render.
 */
export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get(LOCALE_COOKIE)?.value;
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const isDev = process.env.NODE_ENV !== "production";
const storageOrigin = process.env.NEXT_PUBLIC_OBJECT_STORAGE_ORIGIN ?? "";

// /api/v1/* is handled by this app's own Route Handler
// (`src/app/api/v1/[...path]/route.ts`), not a `rewrites()` passthrough -
// a plain rewrite forwards the browser's request verbatim and can't turn
// an httpOnly session cookie into the real API's `Authorization` header.
const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "Content-Security-Policy", value: `default-src 'self'; script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'${storageOrigin ? ` ${storageOrigin}` : ""}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
    ] }];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// /api/v1/* is handled by this app's own Route Handler
// (`src/app/api/v1/[...path]/route.ts`), not a `rewrites()` passthrough -
// a plain rewrite forwards the browser's request verbatim and can't turn
// an httpOnly session cookie into the real API's `Authorization` header.
const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  transpilePackages: ["@nauterio/contracts"],
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);

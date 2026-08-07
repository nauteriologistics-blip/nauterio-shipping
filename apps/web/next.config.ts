import type { NextConfig } from "next";

// Proxies browser calls to /api/v1/* through to the real NestJS API
// (apps/api) - same-origin from the browser's point of view, so no CORS
// configuration is needed on either side. NAUTERIO_API_URL points at the
// real API's origin (its own routes are already prefixed with /v1 - see
// apps/api/src/main.ts's setGlobalPrefix), defaulting to the local dev port.
const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

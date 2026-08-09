import type { NextConfig } from "next";

// Same reverse-proxy pattern as apps/web (see that app's next.config.ts) -
// browser calls to /api/v1/* are same-origin, forwarded to the real NestJS
// API so no CORS configuration is needed anywhere.
const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  output: "standalone",
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

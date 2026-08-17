import type { NextConfig } from "next";

// SEC-015: the previous `rewrites()` transparent passthrough is gone -
// `/api/v1/*` is now handled by this app's own Route Handler
// (`src/app/api/v1/[...path]/route.ts`), which reads the httpOnly session
// cookie server-side and attaches it as the real API's Authorization
// header. A plain rewrite cannot do that (it forwards the browser's
// request verbatim), so it had to be replaced, not just extended.
const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  transpilePackages: ["@nauterio/contracts"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            // SEC-015: no inline scripts/styles beyond what Next.js itself
            // needs to bootstrap, no third-party script origins, no
            // framing. Tightened further once the exact set of first-party
            // asset origins in a real deployment is known.
            //
            // `unsafe-eval` is added in dev only - Next/React's dev-mode
            // debugging tooling (stack reconstruction, Turbopack HMR) uses
            // eval() and is blocked without it; React never uses eval() in
            // production, so the production policy stays eval-free.
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;

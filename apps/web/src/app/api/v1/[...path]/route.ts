import { NextRequest, NextResponse } from "next/server";
import { CSRF_COOKIE, CSRF_HEADER, CSRF_PROTECTED_METHODS, SESSION_COOKIE } from "@/lib/session";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

/**
 * Replaces the old `next.config.ts` `rewrites()` transparent passthrough -
 * a plain rewrite forwards the browser's request verbatim and cannot turn
 * an httpOnly session cookie into the real API's `Authorization` header.
 *
 * Unlike apps/admin's equivalent proxy (every admin route requires staff
 * auth), apps/web mixes anonymous public endpoints (quote, tracking,
 * register) with authenticated ones (portal, bookings, profile): this
 * proxy attaches the session-derived Authorization header when a session
 * cookie exists, and forwards the request anonymously when it doesn't -
 * the real API's own AuthGuard is what decides, per-route, whether a
 * request without one is rejected. CSRF is checked only when a session
 * cookie is present, for the same reason: an anonymous request has no
 * session for a forged cross-site request to abuse in the first place.
 */
async function proxy(req: NextRequest, path: string[]): Promise<NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (token && CSRF_PROTECTED_METHODS.has(req.method)) {
    const csrfCookie = req.cookies.get(CSRF_COOKIE)?.value;
    const csrfHeader = req.headers.get(CSRF_HEADER);
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return NextResponse.json(
        { code: "FORBIDDEN", message: "Missing or invalid CSRF token.", correlationId: "n/a", retryable: false },
        { status: 403 }
      );
    }
  }

  const upstreamUrl = `${apiOrigin}/v1/${path.join("/")}${req.nextUrl.search}`;
  const forwardHeaders = new Headers();
  if (token) forwardHeaders.set("Authorization", `Bearer ${token}`);
  const contentType = req.headers.get("content-type");
  if (contentType) forwardHeaders.set("content-type", contentType);
  const idempotencyKey = req.headers.get("idempotency-key");
  if (idempotencyKey) forwardHeaders.set("idempotency-key", idempotencyKey);
  const correlationId = req.headers.get("x-correlation-id");
  if (correlationId) forwardHeaders.set("x-correlation-id", correlationId);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: hasBody ? await req.text() : undefined,
      // The real API's own AuthGuard/PermissionGuard remain the authoritative
      // check - this proxy only forwards identity, it does not decide
      // authorization.
      redirect: "manual",
    });
  } catch {
    return NextResponse.json(
      {
        code: "SERVICE_UNAVAILABLE",
        message: "The Nauterio service is temporarily unavailable. Please try again shortly.",
        correlationId: correlationId ?? "n/a",
        retryable: true,
      },
      { status: 503 }
    );
  }

  const responseBody = await upstreamRes.text();
  const res = new NextResponse(responseBody, { status: upstreamRes.status });
  const upstreamContentType = upstreamRes.headers.get("content-type");
  if (upstreamContentType) res.headers.set("content-type", upstreamContentType);
  return res;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await ctx.params).path);
}

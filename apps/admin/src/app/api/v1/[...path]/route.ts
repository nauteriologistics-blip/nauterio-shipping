import { NextRequest, NextResponse } from "next/server";
import { CSRF_COOKIE, CSRF_HEADER, CSRF_PROTECTED_METHODS, SESSION_COOKIE } from "@/lib/session";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

/**
 * SEC-015: replaces the previous `next.config.ts` `rewrites()` transparent
 * passthrough (browser -> real API directly) with a real server-side proxy.
 * A plain rewrite forwards whatever the browser sends verbatim, including
 * cookies - it cannot turn an httpOnly session cookie into the
 * `Authorization` header the real API actually authenticates on. This
 * handler is what makes the httpOnly cookie usable at all: it reads the
 * cookie here, on the server, and attaches it as the header for the
 * upstream request - the browser's own requests to this app carry only the
 * cookie, never the raw token in a readable header.
 */
async function proxy(req: NextRequest, path: string[]): Promise<NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ code: "UNAUTHORIZED", message: "No session.", correlationId: "n/a", retryable: false }, { status: 401 });
  }

  if (CSRF_PROTECTED_METHODS.has(req.method)) {
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
  forwardHeaders.set("Authorization", `Bearer ${token}`);
  const contentType = req.headers.get("content-type");
  if (contentType) forwardHeaders.set("content-type", contentType);
  const idempotencyKey = req.headers.get("idempotency-key");
  if (idempotencyKey) forwardHeaders.set("idempotency-key", idempotencyKey);
  const correlationId = req.headers.get("x-correlation-id");
  if (correlationId) forwardHeaders.set("x-correlation-id", correlationId);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const upstreamRes = await fetch(upstreamUrl, {
    method: req.method,
    headers: forwardHeaders,
    body: hasBody ? await req.text() : undefined,
    // The real API's own AuthGuard is still the authoritative check - this
    // proxy only forwards identity, it does not decide authorization.
    redirect: "manual",
  });

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

import { NextRequest, NextResponse } from "next/server";
import { CSRF_COOKIE, SESSION_COOKIE } from "@/lib/session";
import { generateCsrfToken } from "@/lib/session.server";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

/** Verifies the one-time email token and stores the API's new opaque,
 * expiring session token in an httpOnly cookie. */
export async function POST(req: NextRequest) {
  let token: string;
  try {
    const body = (await req.json()) as { token?: string };
    token = (body.token ?? "").trim();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ message: "Verification token is required." }, { status: 400 });
  }

  let sessionToken: string;
  try {
    const upstreamRes = await fetch(`${apiOrigin}/v1/auth/verify-email`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!upstreamRes.ok) {
      const upstreamBody = await upstreamRes.text();
      return new NextResponse(upstreamBody, {
        status: upstreamRes.status,
        headers: { "content-type": "application/json" },
      });
    }
    const parsed = (await upstreamRes.json()) as { sessionToken: string };
    sessionToken = parsed.sessionToken;
  } catch {
    return NextResponse.json({ message: "Could not reach the API." }, { status: 502 });
  }

  const response = NextResponse.json({ ok: true });
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set(CSRF_COOKIE, generateCsrfToken(), {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

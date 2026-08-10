import { NextRequest, NextResponse } from "next/server";
import { CSRF_COOKIE, SESSION_COOKIE } from "@/lib/session";
import { generateCsrfToken } from "@/lib/session.server";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

/** Verifies the identity server-side against the real API's /v1/me BEFORE
 * ever setting a cookie, same pattern as apps/admin's login route - just
 * without the staff-role gate, since any account in ACTIVE status (which
 * /v1/me itself already requires - AuthGuard rejects PENDING_VERIFICATION)
 * is a legitimate customer-portal user. */
export async function POST(req: NextRequest) {
  let token: string;
  try {
    const body = (await req.json()) as { token?: string };
    token = (body.token ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "Access code is required." }, { status: 400 });
  }

  try {
    const res = await fetch(`${apiOrigin}/v1/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            res.status === 401
              ? "That access code isn't linked to an account, or the account isn't active yet."
              : `Sign-in check failed (HTTP ${res.status}).`,
        },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Could not reach the API." }, { status: 502 });
  }

  const response = NextResponse.json({ ok: true });
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days - a customer portal session, not a staff shift
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

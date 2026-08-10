import { NextRequest, NextResponse } from "next/server";
import { CSRF_COOKIE, SESSION_COOKIE } from "@/lib/session";
import { generateCsrfToken } from "@/lib/session.server";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

/**
 * SEC-015: verifies the identity server-side against the real API BEFORE
 * ever setting a cookie, and enforces the staff-role gate here too - the
 * original finding noted "a customer token entered at /login will
 * authenticate, and the admin UI will render whatever the API returns" with
 * no staff check anywhere. The real API's own permission model is still the
 * authoritative enforcement (this is defence in depth, a usability/early-
 * rejection layer, not a replacement for it) - a non-staff token would
 * still get 403s from every `@RequirePermission`-guarded route even if this
 * check were skipped, but skipping it let the login flow itself look
 * successful for a non-staff account, which is exactly the confusing
 * half-authenticated state this closes.
 */
export async function POST(req: NextRequest) {
  let token: string;
  try {
    const body = (await req.json()) as { token?: string };
    token = (body.token ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "Token is required." }, { status: 400 });
  }

  let profile: { staffRole: string | null } | null = null;
  try {
    const res = await fetch(`${apiOrigin}/v1/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            res.status === 401
              ? "No account is linked to that identity."
              : `Sign-in check failed (HTTP ${res.status}).`,
        },
        { status: 401 }
      );
    }
    profile = (await res.json()) as { staffRole: string | null };
  } catch {
    return NextResponse.json({ error: "Could not reach the API." }, { status: 502 });
  }

  if (!profile.staffRole) {
    return NextResponse.json(
      { error: "This account does not have staff access to the admin console." },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ ok: true });
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours - matches a typical staff shift, not a design requirement carved anywhere else
  });
  // Deliberately NOT httpOnly - the page's own JS must be able to read this
  // to echo it back as the CSRF header (see lib/session.ts's doc comment).
  response.cookies.set(CSRF_COOKIE, generateCsrfToken(), {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}

import { NextRequest, NextResponse } from "next/server";
import { CSRF_COOKIE, SESSION_COOKIE } from "@/lib/session";
import { generateCsrfToken } from "@/lib/session.server";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

export async function POST(req: NextRequest) {
  let credentials: { email: string; password: string };
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    credentials = { email: (body.email ?? "").trim(), password: body.password ?? "" };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!credentials.email || !credentials.password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  let token: string;
  let profile: { staffRole: string | null } | null = null;
  try {
    const authentication = await fetch(`${apiOrigin}/v1/auth/staff-password-login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!authentication.ok) {
      return NextResponse.json(
        { error: authentication.status === 503 ? "Staff password sign-in is temporarily unavailable." : "Invalid email or password." },
        { status: authentication.status === 503 ? 503 : 401 }
      );
    }
    const authBody = (await authentication.json()) as { sessionToken?: string };
    token = authBody.sessionToken ?? "";
    if (!token) return NextResponse.json({ error: "Staff sign-in failed." }, { status: 502 });

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
    maxAge: 60 * 60 * 8,
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

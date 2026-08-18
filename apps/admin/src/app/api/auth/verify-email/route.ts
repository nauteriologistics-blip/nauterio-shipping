import { NextRequest, NextResponse } from "next/server";
import { CSRF_COOKIE, SESSION_COOKIE } from "@/lib/session";
import { generateCsrfToken } from "@/lib/session.server";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

export async function POST(req: NextRequest) {
  let token: string;
  try {
    const body = (await req.json()) as { token?: string };
    token = (body.token ?? "").trim();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }
  if (!token) return NextResponse.json({ message: "Sign-in token is required." }, { status: 400 });

  try {
    const verification = await fetch(`${apiOrigin}/v1/auth/verify-email`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!verification.ok) return new NextResponse(await verification.text(), { status: verification.status, headers: { "content-type": "application/json" } });
    const { sessionToken } = (await verification.json()) as { sessionToken: string };
    const profile = await fetch(`${apiOrigin}/v1/me`, { headers: { Authorization: `Bearer ${sessionToken}` } });
    if (!profile.ok) return NextResponse.json({ message: "Could not verify staff access." }, { status: 401 });
    const user = (await profile.json()) as { staffRole: string | null };
    if (!user.staffRole) return NextResponse.json({ message: "This account does not have staff access." }, { status: 403 });

    const response = NextResponse.json({ ok: true });
    const secure = process.env.NODE_ENV === "production";
    response.cookies.set(SESSION_COOKIE, sessionToken, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
    response.cookies.set(CSRF_COOKIE, generateCsrfToken(), { httpOnly: false, secure, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
    return response;
  } catch {
    return NextResponse.json({ message: "Staff sign-in service is temporarily unavailable." }, { status: 503 });
  }
}

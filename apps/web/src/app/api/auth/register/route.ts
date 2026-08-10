import { NextRequest, NextResponse } from "next/server";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

/** Thin forward to the real API's public POST /v1/auth/register - no
 * session cookie is set here, since a freshly-registered account is
 * PENDING_VERIFICATION and can't authenticate yet (see verify-email/route.ts,
 * which is what actually establishes the session once the account is
 * activated). */
export async function POST(req: NextRequest) {
  const body = await req.text();
  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(`${apiOrigin}/v1/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
  } catch {
    return NextResponse.json({ message: "Could not reach the API." }, { status: 502 });
  }
  const responseBody = await upstreamRes.text();
  return new NextResponse(responseBody, {
    status: upstreamRes.status,
    headers: { "content-type": "application/json" },
  });
}

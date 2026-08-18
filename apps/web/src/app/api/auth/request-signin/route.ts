import { NextRequest, NextResponse } from "next/server";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = (await req.json()) as { email?: string };
    email = (body.email ?? "").trim();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }
  if (!email) return NextResponse.json({ message: "Email address is required." }, { status: 400 });

  try {
    const upstream = await fetch(`${apiOrigin}/v1/auth/request-signin`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "Sign-in email service is temporarily unavailable." }, { status: 503 });
  }
}

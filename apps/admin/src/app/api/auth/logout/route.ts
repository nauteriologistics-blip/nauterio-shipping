import { NextResponse } from "next/server";
import { CSRF_COOKIE, SESSION_COOKIE } from "@/lib/session";

/** httpOnly cookies cannot be cleared by client JS (that is the point) - a
 * server route is required even for sign-out. */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(CSRF_COOKIE);
  return response;
}

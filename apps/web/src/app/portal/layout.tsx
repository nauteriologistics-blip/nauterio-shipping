import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

export interface PortalProfile {
  id: string;
  email: string;
  fullName: string;
  status: string;
  preferredLanguage: string;
  version: number;
}

/**
 * Server-side auth gate for the whole /portal tree - the previous state
 * had none at all (see docs/audit/FRONTEND_UX_GAPS.md §1: anyone typing
 * the URL saw a fully "logged in" dashboard). Checked server-side, before
 * any portal content renders, rather than client-side after a flash of
 * protected content - `/v1/me` is called directly against the real API
 * (not through the BFF proxy, which is for browser requests) since this
 * runs on the server already.
 */
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/signin");
  }

  const res = await fetch(`${apiOrigin}/v1/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/signin?sessionExpired=1");
  }

  return <>{children}</>;
}

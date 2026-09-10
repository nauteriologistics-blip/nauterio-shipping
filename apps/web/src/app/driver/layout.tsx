import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

export default async function DriverLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) redirect("/signin?next=/driver");
  const response = await fetch(`${apiOrigin}/v1/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) redirect("/signin?sessionExpired=1");
  const profile = await response.json() as { staffRole: string | null };
  if (profile.staffRole !== "DRIVER") redirect("/portal");
  return <>{children}</>;
}

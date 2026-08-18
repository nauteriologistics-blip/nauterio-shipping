import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session";
import NewBookingWizard from "./BookingWizard";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

export default async function NewBookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  if (typeof query.quoteId !== "string" || !query.quoteId) {
    redirect("/quote");
  }
  // portal/layout.tsx already verified the session exists and is valid -
  // this just needs the profile's real name to replace the wizard's old
  // hardcoded "Acme Italy S.r.l." sender default.
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? "";
  const res = await fetch(`${apiOrigin}/v1/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const profile = res.ok ? ((await res.json()) as { fullName: string }) : null;

  return <NewBookingWizard senderName={profile?.fullName ?? ""} />;
}

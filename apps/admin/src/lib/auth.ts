/**
 * SEC-015: the token itself is no longer readable from client JS at all -
 * it lives in an httpOnly cookie set by `app/api/auth/login/route.ts` and
 * never leaves the server (see `lib/session.ts`'s doc comment for the full
 * design). This file now only reads the CSRF cookie, which is
 * deliberately NOT httpOnly (the page's own JS must echo it back as a
 * header on mutating requests - the double-submit CSRF pattern).
 */
export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )nauterio_admin_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function requestSignIn(email: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/auth/request-signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string; error?: string } | null;
    return { ok: false, error: body?.message ?? body?.error ?? `Sign-in request failed (HTTP ${res.status}).` };
  }
  return { ok: true };
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

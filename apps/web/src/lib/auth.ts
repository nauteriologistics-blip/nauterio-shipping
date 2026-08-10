/**
 * Client-side helpers for the customer auth flow. All of these go through
 * this app's own Route Handlers (never the real API directly) so the
 * session token is set/read as an httpOnly cookie server-side - see
 * `lib/session.ts`'s doc comment.
 */

export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )nauterio_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export interface RegisterInput {
  email: string;
  fullName: string;
  phone?: string;
  preferredLanguage?: "en" | "it";
  marketingConsent?: boolean;
  acceptedTerms: boolean;
}

export type RegisterResult =
  | { ok: true; devVerificationUrl?: string }
  | { ok: false; error: string };

export async function register(input: RegisterInput): Promise<RegisterResult> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await res.json().catch(() => null)) as
    | { devVerificationUrl?: string; message?: string; error?: string }
    | null;
  if (!res.ok) {
    return { ok: false, error: body?.message ?? body?.error ?? `Registration failed (HTTP ${res.status}).` };
  }
  return { ok: true, devVerificationUrl: body?.devVerificationUrl };
}

export async function verifyEmail(token: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/auth/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string; error?: string } | null;
    return { ok: false, error: body?.message ?? body?.error ?? `Verification failed (HTTP ${res.status}).` };
  }
  return { ok: true };
}

export async function login(token: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: body?.error ?? `Sign-in failed (HTTP ${res.status}).` };
  }
  return { ok: true };
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

const TOKEN_STORAGE_KEY = "nauterio_admin_token";

/**
 * LOCAL DEV ONLY. AuthGuard (apps/api/src/common/guards/auth.guard.ts)
 * currently treats the bearer token as a Cognito sub directly and refuses
 * to run that passthrough outside development - this sign-in page is the
 * admin-side half of that same stopgap, storing the token in localStorage
 * instead of a real Cognito-issued session. Replace both halves together
 * when a real Cognito User Pool + Hosted UI exists (ADR 0001 section 11):
 * this becomes an OAuth redirect into an httpOnly session cookie, not
 * client-readable storage.
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

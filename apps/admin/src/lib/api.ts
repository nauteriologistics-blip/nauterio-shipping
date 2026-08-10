import { getCsrfToken } from "./auth";
import { CSRF_HEADER, CSRF_PROTECTED_METHODS } from "./session";

/** Matches AllExceptionsFilter's StructuredError shape (apps/api/src/common/filters/http-exception.filter.ts). */
export interface ApiErrorBody {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  correlationId: string;
  retryable: boolean;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody
  ) {
    super(body.message);
  }
}

/**
 * Every admin API call goes through here so 401 handling (redirect to
 * sign-in - the session cookie is invalid/expired/absent) and error shape
 * parsing happen in exactly one place.
 *
 * SEC-015: no `Authorization` header is attached here anymore - the
 * session lives in an httpOnly cookie the browser sends automatically, and
 * `app/api/v1/[...path]/route.ts` is what turns it into the real API's
 * Authorization header, server-side. This function's job is now just the
 * CSRF header for mutating requests (double-submit pattern) and the
 * existing error handling.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (CSRF_PROTECTED_METHODS.has(method)) {
    headers.set(CSRF_HEADER, getCsrfToken() ?? "");
  }

  const res = await fetch(`/api/v1${path}`, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login?sessionExpired=1";
    }
    throw new ApiError(401, {
      code: "UNAUTHORIZED",
      message: "Session expired.",
      correlationId: "n/a",
      retryable: false,
    });
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      res.status,
      body ?? { code: "UNKNOWN", message: `Request failed with status ${res.status}`, correlationId: "n/a", retryable: res.status >= 500 }
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

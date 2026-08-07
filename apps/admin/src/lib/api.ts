import { clearStoredToken, getStoredToken } from "./auth";

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
 * sign-in - the stored dev token is invalid/expired) and error shape
 * parsing happen in exactly one place.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const res = await fetch(`/api/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (res.status === 401) {
    clearStoredToken();
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

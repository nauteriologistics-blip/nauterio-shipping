"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setStoredToken } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get("sessionExpired") === "1";

  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    setStatus("checking");
    setErrorMessage("");

    try {
      const res = await fetch("/api/v1/me", {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          res.status === 401
            ? "No staff account is linked to that identity."
            : `Sign-in check failed (HTTP ${res.status}).`
        );
        return;
      }
      setStoredToken(token.trim());
      router.push("/");
    } catch {
      setStatus("error");
      setErrorMessage("Could not reach the API. Is it running on localhost:4000?");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h1 className="text-lg font-bold text-[#081F3D]">Nauterio Staff Admin</h1>
        <p className="mt-1 text-sm text-slate-500">
          Local development sign-in. Enter a seeded user&apos;s Cognito sub as the token - see{" "}
          <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">packages/database/prisma/seed.ts</code>.
        </p>

        {sessionExpired && (
          <p className="mt-4 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-3 py-2" role="status">
            Your session expired. Sign in again.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-[#081F3D]">
              Dev token
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F28C18]"
              placeholder="e.g. test-ops-token"
              autoComplete="off"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "checking" || !token.trim()}
            className="w-full rounded-md bg-[#081F3D] text-white text-sm font-semibold py-2 hover:bg-[#0a2a52] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "checking" ? "Checking..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

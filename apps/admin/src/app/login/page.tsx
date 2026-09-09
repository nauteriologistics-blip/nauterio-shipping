"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth";

const ADMIN_EMAIL = "admin@nauterio.com";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get("sessionExpired") === "1";

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("checking");
    setErrorMessage("");

    if (!password) return;
    const result = await login(ADMIN_EMAIL, password);
    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h1 className="text-lg font-bold text-[#081F3D]">Nauterio Staff Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in with the Nauterio administrator account.</p>

        {sessionExpired && (
          <p className="mt-4 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-3 py-2" role="status">
            Your session expired. Sign in again.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#081F3D]">
              Email
            </label>
            <input
              id="email" type="email" value={ADMIN_EMAIL} readOnly
              className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#081F3D]">
              Password
            </label>
            <input
              id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C18]"
              autoComplete="current-password" required
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "checking" || !password}
            className="w-full rounded-md bg-[#081F3D] text-white text-sm font-semibold py-2 hover:bg-[#0a2a52] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "checking" ? "Signing in..." : "Sign in"}
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

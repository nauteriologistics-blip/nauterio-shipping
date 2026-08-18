"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { requestSignIn } from "@/lib/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get("sessionExpired") === "1";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error" | "sent">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("checking");
    setErrorMessage("");

    const result = await requestSignIn(email.trim());
    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    setStatus("sent");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h1 className="text-lg font-bold text-[#081F3D]">Nauterio Staff Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Use your authorised staff email to receive a secure sign-in link.</p>

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
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C18]"
              autoComplete="email" required
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
              {errorMessage}
            </p>
          )}

          {status === "sent" && (
            <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2" role="status">
              If that address belongs to an active staff account, a single-use link is on its way. It expires in 15 minutes.
            </p>
          )}

          <button
            type="submit"
          disabled={status === "checking" || status === "sent" || !email.trim()}
            className="w-full rounded-md bg-[#081F3D] text-white text-sm font-semibold py-2 hover:bg-[#0a2a52] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "checking" ? "Sending..." : "Email me a sign-in link"}
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

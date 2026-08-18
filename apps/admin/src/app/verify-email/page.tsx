"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyStaffSignIn() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const fired = useRef(false);
  const [error, setError] = useState(token ? "" : "The sign-in link is missing its token.");

  useEffect(() => {
    if (!token || fired.current) return;
    fired.current = true;
    void fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(async (response) => {
      if (response.ok) return router.replace("/");
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message ?? "This sign-in link is invalid or expired.");
    }).catch(() => setError("Staff sign-in is temporarily unavailable."));
  }, [router, token]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <h1 className="text-lg font-bold text-[#081F3D]">Nauterio Staff Admin</h1>
        {error ? <><p role="alert" className="mt-4 text-sm text-red-700">{error}</p><Link href="/login" className="mt-5 inline-block text-sm font-semibold underline">Request a new link</Link></> : <p className="mt-4 text-sm text-slate-500">Verifying your secure sign-in link…</p>}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return <Suspense fallback={null}><VerifyStaffSignIn /></Suspense>;
}

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { login } from "@/lib/auth";

const INPUT_CLASS =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("SignIn");
  const sessionExpired = searchParams.get("sessionExpired") === "1";
  const justRegistered = searchParams.get("registered") === "1";

  const [accessCode, setAccessCode] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessCode.trim()) return;
    setStatus("checking");
    setErrorMessage("");

    const result = await login(accessCode.trim());
    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    router.push("/portal");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#081F3D]">{t("title")}</h1>
        <p className="mt-2 text-sm text-slate-500">{t("subtitle")}</p>

        {justRegistered && (
          <p className="mt-4 text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md px-3 py-2" role="status">
            {t("justRegistered")}
          </p>
        )}
        {sessionExpired && (
          <p className="mt-4 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-3 py-2" role="status">
            {t("sessionExpired")}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-[#081F3D]">
              {t("accessCodeLabel")}
            </label>
            <input
              id="accessCode"
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className={`${INPUT_CLASS} font-mono text-sm`}
              placeholder={t("accessCodePlaceholder")}
              autoComplete="off"
              aria-describedby="accessCode-hint"
            />
            <p id="accessCode-hint" className="mt-1.5 text-xs text-slate-400">
              {t("accessCodeHint")}
            </p>
          </div>

          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "checking" || !accessCode.trim()}
            className="w-full rounded-full bg-[#F28C18] hover:bg-[#d97c14] text-white text-sm font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === "checking" ? t("checking") : t("signInButton")}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500 text-center">
          {t("newToNauterio")}{" "}
          <Link href="/register" className="text-[#081F3D] font-medium hover:underline">
            {t("createAccount")}
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}

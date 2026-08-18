"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { requestSignIn } from "@/lib/auth";

const INPUT_CLASS =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors";

function SignInForm() {
  const searchParams = useSearchParams();
  const t = useTranslations("SignIn");
  const sessionExpired = searchParams.get("sessionExpired") === "1";
  const justRegistered = searchParams.get("registered") === "1";

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
            <label htmlFor="email" className="block text-sm font-medium text-[#081F3D]">
              {t("emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              aria-describedby="email-hint"
            />
            <p id="email-hint" className="mt-1.5 text-xs text-slate-400">
              {t("emailHint")}
            </p>
          </div>

          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
              {errorMessage}
            </p>
          )}

          {status === "sent" && (
            <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2" role="status">
              {t("linkSent")}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "checking" || status === "sent" || !email.trim()}
            className="w-full rounded-full bg-[#F28C18] hover:bg-[#d97c14] text-white text-sm font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === "checking" ? t("sending") : t("signInButton")}
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

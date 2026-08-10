"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { register } from "@/lib/auth";

const INPUT_CLASS =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors";

export default function RegisterPage() {
  const t = useTranslations("Register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "it">("en");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "done">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [devVerificationUrl, setDevVerificationUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptedTerms) {
      setStatus("error");
      setErrorMessage(t("mustAcceptTerms"));
      return;
    }
    setStatus("submitting");
    setErrorMessage("");

    const result = await register({
      email: email.trim(),
      fullName: fullName.trim(),
      phone: phone.trim() || undefined,
      preferredLanguage,
      marketingConsent,
      acceptedTerms,
    });

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }

    setDevVerificationUrl(result.devVerificationUrl ?? null);
    setStatus("done");
  }

  if (status === "done") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-[#081F3D]">{t("checkEmailTitle")}</h1>
          <p className="mt-3 text-sm text-slate-600">{t("checkEmailBody", { email })}</p>

          {devVerificationUrl && (
            <div className="mt-6 text-left bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">{t("devModeLabel")}</p>
              <p className="mt-1 text-xs text-amber-800">{t("devModeBody")}</p>
              <Link
                href={devVerificationUrl.replace(/^https?:\/\/[^/]+/, "")}
                className="mt-3 inline-block text-xs font-mono break-all text-[#081F3D] underline"
              >
                {devVerificationUrl}
              </Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#081F3D]">{t("title")}</h1>
        <p className="mt-2 text-sm text-slate-500">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[#081F3D]">
              {t("fullNameLabel")}
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={INPUT_CLASS}
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#081F3D]">
              {t("emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#081F3D]">
              {t("phoneLabel")} <span className="text-slate-400 font-normal">{t("phoneOptional")}</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={INPUT_CLASS}
              autoComplete="tel"
            />
          </div>

          <div>
            <label htmlFor="preferredLanguage" className="block text-sm font-medium text-[#081F3D]">
              {t("preferredLanguageLabel")}
            </label>
            <select
              id="preferredLanguage"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as "en" | "it")}
              className={INPUT_CLASS}
            >
              <option value="en">{t("languageEnglish")}</option>
              <option value="it">{t("languageItalian")}</option>
            </select>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5"
              />
              <span>{t("marketingConsentLabel")}</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
                className="mt-0.5"
              />
              <span>
                {t("termsPrefix")}{" "}
                <Link href="/terms" className="text-[#081F3D] font-medium hover:underline">
                  {t("termsLink")}
                </Link>{" "}
                {t("termsAnd")}{" "}
                <Link href="/privacy" className="text-[#081F3D] font-medium hover:underline">
                  {t("privacyLink")}
                </Link>
                .
              </span>
            </label>
          </div>

          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting" || !fullName.trim() || !email.trim() || !acceptedTerms}
            className="w-full rounded-full bg-[#F28C18] hover:bg-[#d97c14] text-white text-sm font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === "submitting" ? t("submitting") : t("submitButton")}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500 text-center">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/signin" className="text-[#081F3D] font-medium hover:underline">
            {t("signIn")}
          </Link>
        </p>
      </div>
    </main>
  );
}

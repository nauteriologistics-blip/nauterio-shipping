"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Truck, Headset, Shield, FileCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function BusinessPage() {
  const t = useTranslations("BusinessPage");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/v1/business-inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: String(form.get("companyName") ?? ""),
        monthlyVolume: String(form.get("monthlyVolume") ?? ""),
        workEmail: String(form.get("workEmail") ?? ""),
        message: String(form.get("message") ?? ""),
      }),
    }).catch(() => null);
    setSubmitting(false);
    if (!response?.ok) {
      setError(t("requestError"));
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#081F3D] font-sans">
      {/* Hero Section */}
      <section className="py-24 md:py-32 flex flex-col items-center text-center px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-[#081F3D] font-semibold text-sm mb-6 border border-blue-100 tracking-wide">
            {t("badge")}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-24 px-4 max-w-7xl mx-auto -mt-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Starter */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 h-full flex flex-col">
            <h3 className="text-2xl font-bold mb-2">{t("starterTitle")}</h3>
            <p className="text-slate-500 mb-6">{t("starterVolume")}</p>
            <div className="text-2xl font-bold mb-8 text-slate-700">{t("volumeRatesApply")}</div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> {t("starterFeature1")}</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> {t("starterFeature2")}</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> {t("starterFeature3")}</li>
            </ul>
            <a href="#contact" className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-[#081F3D] font-bold transition-colors text-center">
              {t("getStarted")}
            </a>
          </div>

          {/* Business (Highlighted) */}
          <div className="bg-white rounded-3xl p-10 shadow-lg border-2 border-[#F28C18] relative transform md:-translate-y-4 flex flex-col h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F28C18] text-white py-1 px-4 rounded-full text-sm font-bold">
              {t("businessBadge")}
            </div>
            <h3 className="text-2xl font-bold mb-2">{t("businessTitle")}</h3>
            <p className="text-slate-500 mb-6">{t("businessVolume")}</p>
            <div className="text-2xl font-bold mb-8 text-slate-700">{t("volumeRatesApply")}</div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> {t("businessFeature1")}</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> {t("businessFeature2")}</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> {t("businessFeature3")}</li>
            </ul>
            <a href="#contact" className="w-full py-4 rounded-2xl bg-[#081F3D] hover:bg-[#081F3D]/90 text-white font-bold transition-colors text-center">
              {t("contactSales")}
            </a>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 h-full flex flex-col">
            <h3 className="text-2xl font-bold mb-2">{t("enterpriseTitle")}</h3>
            <p className="text-slate-500 mb-6">{t("enterpriseVolume")}</p>
            <div className="text-2xl font-bold mb-8 text-slate-700">{t("customRates")}</div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> {t("enterpriseFeature1")}</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> {t("enterpriseFeature2")}</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> {t("enterpriseFeature3")}</li>
            </ul>
            <a href="#contact" className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-[#081F3D] font-bold transition-colors text-center">
              {t("contactSales")}
            </a>
          </div>
        </div>
        <p className="text-center text-sm text-slate-400 mt-8">
          {t("tiersDisclaimer")}
        </p>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">{t("whyChooseHeading")}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t("whyChooseSubheading")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm">
              <div className="w-14 h-14 bg-blue-50 text-[#081F3D] rounded-2xl flex items-center justify-center mb-6">
                <Truck className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("corridorTitle")}</h3>
              <p className="text-slate-600 text-lg">{t("corridorBody")}</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm">
              <div className="w-14 h-14 bg-blue-50 text-[#081F3D] rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("riskTitle")}</h3>
              <p className="text-slate-600 text-lg">{t("riskBody")}</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm">
              <div className="w-14 h-14 bg-blue-50 text-[#081F3D] rounded-2xl flex items-center justify-center mb-6">
                <FileCheck className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("customsDataTitle")}</h3>
              <p className="text-slate-600 text-lg">{t("customsDataBody")}</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm">
              <div className="w-14 h-14 bg-blue-50 text-[#081F3D] rounded-2xl flex items-center justify-center mb-6">
                <Headset className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("supportTitle")}</h3>
              <p className="text-slate-600 text-lg">{t("supportBody")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 px-4 max-w-4xl mx-auto scroll-mt-24">
        <div className="bg-[#081F3D] rounded-3xl p-10 md:p-16 shadow-xl text-white">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold mb-4">{t("requestReceivedTitle")}</h2>
              <p className="text-white/80">
                {t("requestReceivedBody")}
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold mb-4">{t("contactHeading")}</h2>
                <p className="text-white/80 text-lg">{t("contactSubheading")}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-semibold text-white/90 mb-2">{t("companyNameLabel")}</label>
                    <input id="companyName" name="companyName" type="text" required autoComplete="organization" className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F28C18] text-white placeholder-white/40" placeholder={t("companyNamePlaceholder")} />
                  </div>
                  <div>
                    <label htmlFor="monthlyVolume" className="block text-sm font-semibold text-white/90 mb-2">{t("monthlyVolumeLabel")}</label>
                    <select id="monthlyVolume" name="monthlyVolume" required className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F28C18] text-white [&>option]:text-black">
                      <option value="">{t("selectVolumePlaceholder")}</option>
                      <option value="0-50">{t("volumeOption1")}</option>
                      <option value="51-500">{t("volumeOption2")}</option>
                      <option value="500+">{t("volumeOption3")}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="workEmail" className="block text-sm font-semibold text-white/90 mb-2">{t("workEmailLabel")}</label>
                  <input id="workEmail" name="workEmail" type="email" required autoComplete="email" className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F28C18] text-white placeholder-white/40" placeholder="jane@acmecorp.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-white/90 mb-2">{t("messageLabel")}</label>
                  <textarea id="message" name="message" rows={4} className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F28C18] text-white placeholder-white/40" placeholder={t("messagePlaceholder")}></textarea>
                </div>
                {error && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p>}
                <button type="submit" disabled={submitting} className="w-full py-4 rounded-xl bg-[#F28C18] hover:bg-[#F28C18]/90 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                  {submitting ? t("submitting") : t("submitRequest")} {!submitting && <ArrowRight className="w-5 h-5" aria-hidden="true" />}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

"use client";

import { AlertCircle, ShieldCheck, CheckCircle2, FileCheck, Calculator, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function CustomsPage() {
  const t = useTranslations("CustomsPage");
  const [declaredValue, setDeclaredValue] = useState("");
  const [estimatedDuty, setEstimatedDuty] = useState<number | null>(null);

  const prohibitedItems = t.raw("prohibitedItems") as string[];
  const restrictedItems = t.raw("restrictedItems") as string[];
  const allowedItems = t.raw("allowedItems") as string[];
  const invoiceItems = t.raw("invoiceItems") as string[];
  const waybillItems = t.raw("waybillItems") as string[];

  const calculateDuty = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(declaredValue);
    if (!isNaN(value)) {
      // Simple mock calculation: 5% duty for values over $800
      setEstimatedDuty(value > 800 ? value * 0.05 : 0);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#081F3D] font-sans">
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-slate-50 flex flex-col items-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Item Categories */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Prohibited */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">{t("prohibitedTitle")}</h2>
            </div>
            <p className="text-slate-600 mb-8 flex-grow">
              {t("prohibitedDesc")}
            </p>
            <ul className="space-y-4">
              {prohibitedItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Restricted */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">{t("restrictedTitle")}</h2>
            </div>
            <p className="text-slate-600 mb-8 flex-grow">
              {t("restrictedDesc")}
            </p>
            <ul className="space-y-4">
              {restrictedItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Allowed */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">{t("allowedTitle")}</h2>
            </div>
            <p className="text-slate-600 mb-8 flex-grow">
              {t("allowedDesc")}
            </p>
            <ul className="space-y-4">
              {allowedItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Required Documentation */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">{t("documentationHeading")}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t("documentationSubheading")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <FileCheck className="text-[#F28C18] w-8 h-8" />
                <h3 className="text-2xl font-bold">{t("invoiceTitle")}</h3>
              </div>
              <p className="text-slate-600 mb-4">{t("invoiceIntro")}</p>
              <ul className="space-y-3 text-slate-700">
                {invoiceItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <FileCheck className="text-[#F28C18] w-8 h-8" />
                <h3 className="text-2xl font-bold">{t("waybillTitle")}</h3>
              </div>
              <p className="text-slate-600 mb-4">{t("waybillIntro")}</p>
              <ul className="space-y-3 text-slate-700">
                {waybillItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Estimator */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <div className="bg-[#081F3D] text-white rounded-3xl p-10 md:p-16 shadow-lg">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6">
                <Calculator className="w-8 h-8 text-[#F28C18]" />
              </div>
              <h2 className="text-4xl font-bold mb-4">{t("estimatorHeading")}</h2>
              <p className="text-white/80 text-lg">
                {t("estimatorSubheading")}
              </p>
            </div>

            <div className="flex-1 w-full bg-white rounded-2xl p-8 text-[#081F3D]">
              <form onSubmit={calculateDuty} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("declaredValueLabel")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      value={declaredValue}
                      onChange={(e) => setDeclaredValue(e.target.value)}
                      placeholder={t("declaredValuePlaceholder")}
                      className="w-full pl-8 pr-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F28C18] focus:border-transparent transition-all"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#F28C18] hover:bg-[#F28C18]/90 text-white font-bold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {t("estimateButton")} <ArrowRight className="w-5 h-5" />
                </button>

                {estimatedDuty !== null && (
                  <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-sm text-slate-500 font-medium mb-1">{t("estimatedDutyLabel")}</p>
                    <p className="text-3xl font-bold text-[#081F3D]">
                      ${estimatedDuty.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">{t("estimatorDisclaimer")}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

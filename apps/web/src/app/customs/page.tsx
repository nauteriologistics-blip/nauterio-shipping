"use client";

import { AlertCircle, ShieldCheck, CheckCircle2, FileCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CustomsPage() {
  const t = useTranslations("CustomsPage");

  const prohibitedItems = t.raw("prohibitedItems") as string[];
  const restrictedItems = t.raw("restrictedItems") as string[];
  const allowedItems = t.raw("allowedItems") as string[];
  const invoiceItems = t.raw("invoiceItems") as string[];
  const waybillItems = t.raw("waybillItems") as string[];

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

      {/* Guidance only: tariff treatment depends on classification, origin,
          declared value and current law; never fabricate a flat duty rate. */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <div className="bg-[#081F3D] text-white rounded-3xl p-10 md:p-16 shadow-lg">
          <h2 className="text-4xl font-bold mb-4">{t("estimatorHeading")}</h2>
          <p className="text-white/80 text-lg">{t("estimatorSubheading")}</p>
          <p className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/80">{t("estimatorDisclaimer")}</p>
        </div>
      </section>
    </div>
  );
}

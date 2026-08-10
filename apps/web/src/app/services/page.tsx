"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { PlaneTakeoff, Ship, Clock, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { SERVICES, type ServiceId } from "@/lib/services";

const SERVICE_ICONS: Record<ServiceId, typeof PlaneTakeoff> = {
  "air-express": PlaneTakeoff,
  "air-economy": PlaneTakeoff,
  "ocean-freight": Ship,
};

const SERVICE_CATALOG_KEYS: Record<ServiceId, string> = {
  "air-express": "airExpress",
  "air-economy": "airEconomy",
  "ocean-freight": "oceanFreight",
};

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");
  const tCatalog = useTranslations("ServiceCatalog");

  return (
    <div className="min-h-screen bg-white text-[#081F3D]">
      {/* Hero */}
      <section className="py-24 lg:py-32 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.id];
            const catalogKey = SERVICE_CATALOG_KEYS[service.id];
            const features = tCatalog.raw(`${catalogKey}.features`) as string[];
            return (
              <div
                key={service.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Left: Info */}
                  <div className="flex-1 p-8 lg:p-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#F28C18]" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{tCatalog(`${catalogKey}.name`)}</h2>
                        <p className="text-sm text-slate-400">{tCatalog(`${catalogKey}.tagline`)}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-6">
                      {tCatalog(`${catalogKey}.description`)}
                    </p>

                    <ul className="space-y-2.5 mb-8">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2.5 text-slate-600">
                          <Check className="w-4 h-4 text-green-500 shrink-0" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/quote?service=${service.id}`}
                      className="inline-flex items-center gap-2 bg-[#F28C18] hover:bg-[#d97c14] text-white px-8 py-3 rounded-full font-medium transition-colors"
                    >
                      {t("getQuote")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>

                  {/* Right: Stats */}
                  <div className="lg:w-72 bg-slate-50 p-8 lg:p-10 flex flex-col justify-center gap-6 border-t lg:border-t-0 lg:border-l border-slate-200">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                        <Clock className="w-4 h-4" aria-hidden="true" />
                        {t("transitTimeLabel")}
                      </div>
                      <p className="text-base font-bold">{tCatalog(`${catalogKey}.transitLabel`)}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                        {t("pricingLabel")}
                      </div>
                      <p className="text-base font-bold">{t("pricingValue")}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{t("pricingNote")}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("compareHeading")}
          </h2>
          <p className="text-slate-500 text-center mb-12">
            {t("compareSubheading")}
          </p>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-sm font-medium text-slate-400">
                    {t("featureColumn")}
                  </th>
                  {SERVICES.map((s) => (
                    <th key={s.id} className="px-6 py-4 text-sm font-semibold text-[#081F3D]">
                      {tCatalog(`${SERVICE_CATALOG_KEYS[s.id]}.name`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  [t("transitTimeLabel"), ...SERVICES.map((s) => tCatalog(`${SERVICE_CATALOG_KEYS[s.id]}.transitLabel`))],
                  [t("trackingLabel"), t("milestoneValue"), t("milestoneValue"), t("milestoneValue")],
                  [t("customsFilingLabel"), t("priorityValue"), t("standardValue"), t("standardValue")],
                  [t("deliveryLabel"), t("doorToDoorValue"), t("airportToDoorValue"), t("portToDoorValue")],
                ].map(([feature, ...values]) => (
                  <tr key={feature as string} className="odd:bg-white even:bg-slate-50/50">
                    <td className="px-6 py-3.5 font-medium text-slate-600">{feature}</td>
                    {values.map((v, i) => (
                      <td key={i} className="px-6 py-3.5 text-slate-700">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">
            {t("pricingDisclaimer")}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t("needHelpHeading")}</h2>
          <p className="text-slate-500 text-lg mb-8">
            {t("needHelpBody")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 bg-[#F28C18] hover:bg-[#d97c14] text-white px-8 py-3.5 rounded-full font-medium transition-colors"
            >
              {t("getInstantQuote")} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/business"
              className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-[#081F3D] text-[#081F3D] px-8 py-3.5 rounded-full font-medium transition-colors"
            >
              {t("businessSolutions")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { SERVICES, type ServiceId } from "@/lib/services";

const SERVICE_CATALOG_KEYS: Record<ServiceId, string> = {
  "air-express": "airExpress",
  "air-economy": "airEconomy",
  "ocean-freight": "oceanFreight",
};

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");
  const catalog = useTranslations("ServiceCatalog");

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#10233f]">
      <header className="border-b border-[#10233f]/15">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#a95d14]">{t("eyebrow")}</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-none tracking-[-0.04em] sm:text-6xl">{t("heroTitle")}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">{t("heroSubtitle")}</p>
        </div>
      </header>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          {SERVICES.map((service, index) => {
            const key = SERVICE_CATALOG_KEYS[service.id];
            const features = catalog.raw(`${key}.features`) as string[];
            return (
              <article key={service.id} className="grid gap-8 border-b border-slate-200 py-10 lg:grid-cols-[5rem_1fr_18rem] lg:py-14">
                <span className="font-mono text-sm text-slate-400">0{index + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-[#a95d14]">{catalog(`${key}.tagline`)}</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">{catalog(`${key}.name`)}</h2>
                  <p className="mt-4 max-w-2xl leading-7 text-slate-600">{catalog(`${key}.description`)}</p>
                  <ul className="mt-6 grid gap-x-8 gap-y-2 text-sm text-slate-600 sm:grid-cols-2">
                    {features.map((feature) => <li key={feature} className="border-t border-slate-200 pt-2">{feature}</li>)}
                  </ul>
                </div>
                <div className="self-start border-l-2 border-[#d77718] pl-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">{t("transitTimeLabel")}</p>
                  <p className="mt-2 leading-6">{catalog(`${key}.transitLabel`)}</p>
                  <p className="mt-5 text-sm leading-6 text-slate-500">{t("pricingNote")}</p>
                  <Link href={`/quote?service=${service.id}`} className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#10233f] px-5 py-3 font-semibold text-white hover:bg-[#18365e]">
                    {t("getQuote")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#10233f]/15 bg-[#f7f6f2] py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:px-10 lg:grid-cols-[0.4fr_0.6fr]">
          <div><h2 className="text-3xl font-semibold tracking-tight">{t("compareHeading")}</h2><p className="mt-4 leading-7 text-slate-600">{t("compareSubheading")}</p></div>
          <div className="overflow-x-auto border-t border-slate-300">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead><tr className="border-b border-slate-300"><th className="py-4 pr-5 font-semibold">{t("featureColumn")}</th>{SERVICES.map((s) => <th key={s.id} className="px-5 py-4 font-semibold">{catalog(`${SERVICE_CATALOG_KEYS[s.id]}.name`)}</th>)}</tr></thead>
              <tbody>
                {[
                  [t("transitTimeLabel"), ...SERVICES.map((s) => catalog(`${SERVICE_CATALOG_KEYS[s.id]}.transitLabel`))],
                  [t("trackingLabel"), t("milestoneValue"), t("milestoneValue"), t("milestoneValue")],
                  [t("customsFilingLabel"), t("priorityValue"), t("standardValue"), t("standardValue")],
                  [t("deliveryLabel"), t("doorToDoorValue"), t("airportToDoorValue"), t("portToDoorValue")],
                ].map(([label, ...values]) => <tr key={label} className="border-b border-slate-300"><th className="py-4 pr-5 font-medium text-slate-500">{label}</th>{values.map((value, i) => <td key={i} className="px-5 py-4 text-slate-700">{value}</td>)}</tr>)}
              </tbody>
            </table>
            <p className="py-4 text-xs leading-5 text-slate-500">{t("pricingDisclaimer")}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 md:px-10 lg:flex-row lg:items-end">
          <div><h2 className="text-3xl font-semibold tracking-tight">{t("needHelpHeading")}</h2><p className="mt-4 max-w-2xl leading-7 text-slate-600">{t("needHelpBody")}</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/quote" className="rounded-md bg-[#d77718] px-6 py-3 font-semibold text-white hover:bg-[#b95f0d]">{t("getInstantQuote")}</Link><Link href="/business" className="rounded-md border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-50">{t("businessSolutions")}</Link></div>
        </div>
      </section>
    </main>
  );
}

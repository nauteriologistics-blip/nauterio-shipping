"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Search } from "lucide-react";
import { SERVICES, type ServiceId } from "@/lib/services";

const SERVICE_CATALOG_KEYS: Record<ServiceId, string> = {
  "air-express": "airExpress",
  "air-economy": "airEconomy",
  "ocean-freight": "oceanFreight",
};

interface StepItem {
  title: string;
  desc: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function Home() {
  const router = useRouter();
  const t = useTranslations("Home");
  const tCatalog = useTranslations("ServiceCatalog");
  const [trackingId, setTrackingId] = useState("");
  const steps = t.raw("steps") as StepItem[];
  const faqs = t.raw("faqs") as FaqItem[];

  function handleQuickTrack(event: React.FormEvent) {
    event.preventDefault();
    const value = trackingId.trim();
    if (value) router.push(`/tracking?id=${encodeURIComponent(value)}`);
  }

  return (
    <div className="bg-[#f7f6f2] text-[#10233f]">
      <section className="border-b border-[#10233f]/15">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#a95d14]">{t("corridorLabel")}</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#10233f] sm:text-6xl lg:text-[4.8rem]">{t("heroTitle")}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">{t("heroSubtitle")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/quote" className="inline-flex items-center gap-2 rounded-md bg-[#d77718] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#b95f0d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10233f]">
                {t("getInstantQuote")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/tracking" className="inline-flex items-center rounded-md border border-[#10233f]/30 px-6 py-3.5 font-semibold text-[#10233f] transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d77718]">
                {t("trackShipmentButton")}
              </Link>
            </div>

            <form onSubmit={handleQuickTrack} className="mt-10 max-w-2xl border-t border-[#10233f]/15 pt-6">
              <label htmlFor="quick-track" className="mb-2 block text-sm font-semibold text-[#10233f]">{t("quickTrackLabel")}</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" aria-hidden="true" />
                  <input id="quick-track" value={trackingId} onChange={(event) => setTrackingId(event.target.value)} placeholder={t("quickTrackPlaceholder")} className="w-full rounded-md border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-[#10233f] focus:ring-2 focus:ring-[#10233f]/10" />
                </div>
                <button type="submit" className="rounded-md bg-[#10233f] px-5 py-3 font-semibold text-white hover:bg-[#18365e]">{t("quickTrackButton")}</button>
              </div>
            </form>
          </div>

          <aside className="border-l-4 border-[#d77718] bg-white p-7 lg:p-9" aria-label={t("routeCardTitle")}>
            <div className="flex items-start justify-between border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{t("routeCardEyebrow")}</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#10233f]">{t("routeCardTitle")}</h2>
              </div>
              <span className="font-mono text-xs text-slate-400">MXP / YYZ</span>
            </div>
            <dl className="divide-y divide-slate-200 text-sm">
              <div className="grid grid-cols-[8rem_1fr] gap-4 py-5"><dt className="text-slate-500">{t("originLabel")}</dt><dd className="font-semibold">{t("milan")}, IT</dd></div>
              <div className="grid grid-cols-[8rem_1fr] gap-4 py-5"><dt className="text-slate-500">{t("destinationLabel")}</dt><dd className="font-semibold">{t("toronto")}, CA</dd></div>
              <div className="grid grid-cols-[8rem_1fr] gap-4 py-5"><dt className="text-slate-500">{t("movementLabel")}</dt><dd>{t("routeCardStep2")}</dd></div>
              <div className="grid grid-cols-[8rem_1fr] gap-4 py-5"><dt className="text-slate-500">{t("nextCheckLabel")}</dt><dd>{t("routeCardStep3")}</dd></div>
            </dl>
            <p className="mt-5 text-xs leading-5 text-slate-500">{t("routeCardNote")}</p>
          </aside>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[0.45fr_0.55fr]">
            <h2 className="text-3xl font-semibold tracking-tight text-[#10233f] sm:text-4xl">{t("servicesHeading")}</h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">{t("servicesSubheading")}</p>
          </div>
          <div className="divide-y divide-slate-200">
            {SERVICES.map((service, index) => {
              const key = SERVICE_CATALOG_KEYS[service.id];
              return (
                <article key={service.id} className="grid gap-4 py-8 md:grid-cols-[4rem_1fr_14rem_8rem] md:items-center">
                  <span className="font-mono text-sm text-slate-400">0{index + 1}</span>
                  <div><h3 className="text-xl font-semibold text-[#10233f]">{tCatalog(`${key}.name`)}</h3><p className="mt-2 max-w-2xl leading-7 text-slate-600">{tCatalog(`${key}.description`)}</p></div>
                  <p className="text-sm leading-6 text-slate-500">{tCatalog(`${key}.transitLabel`)}</p>
                  <Link href={`/quote?service=${service.id}`} className="inline-flex items-center gap-1 font-semibold text-[#a95d14] hover:underline">{t("planService")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#10233f] py-16 text-white lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#efa146]">{t("howItWorksEyebrow")}</p><h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">{t("howItWorksHeading")}</h2><p className="mt-5 max-w-md leading-7 text-slate-300">{t("howItWorksSubheading")}</p></div>
          <ol className="border-t border-white/20">
            {steps.map((step, index) => (
              <li key={step.title} className="grid gap-2 border-b border-white/20 py-6 sm:grid-cols-[3rem_10rem_1fr] sm:gap-5"><span className="font-mono text-sm text-[#efa146]">0{index + 1}</span><h3 className="font-semibold">{step.title}</h3><p className="leading-7 text-slate-300">{step.desc}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#a95d14]">{t("documentsEyebrow")}</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-[#10233f] sm:text-4xl">{t("documentsHeading")}</h2>
            <ol className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
              {(["documentsStep1", "documentsStep2", "documentsStep3", "documentsStep4"] as const).map((key, index) => (
                <li key={key} className="grid grid-cols-[2rem_1fr] gap-4 py-4 text-slate-600"><span className="font-mono text-sm text-slate-400">{index + 1}</span><span className="leading-7">{t(key)}</span></li>
              ))}
            </ol>
          </div>
          <div className="border border-slate-300 bg-[#f7f6f2] p-7 lg:p-9">
            <h2 className="text-2xl font-semibold text-[#10233f]">{t("proofHeading")}</h2>
            <p className="mt-4 leading-7 text-slate-600">{t("proofBody")}</p>
            <dl className="mt-7 divide-y divide-slate-300 border-t border-slate-300">
              <div className="py-5"><dt className="font-semibold text-[#10233f]">{t("proofCustomsTitle")}</dt><dd className="mt-1 text-sm leading-6 text-slate-600">{t("proofCustomsDesc")}</dd></div>
              <div className="py-5"><dt className="font-semibold text-[#10233f]">{t("proofBusinessTitle")}</dt><dd className="mt-1 text-sm leading-6 text-slate-600">{t("proofBusinessDesc")}</dd></div>
            </dl>
            <Link href="/customs" className="mt-2 inline-flex items-center gap-2 font-semibold text-[#a95d14] hover:underline">{t("readCustomsGuide")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#f7f6f2] py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[0.55fr_0.45fr]">
          <div><h2 className="text-3xl font-semibold tracking-tight text-[#10233f]">{t("faqHeading")}</h2><div className="mt-8 divide-y divide-slate-300 border-y border-slate-300">
            {faqs.map((faq) => <details key={faq.question} className="group py-5"><summary className="cursor-pointer list-none pr-8 font-semibold text-[#10233f] marker:hidden">{faq.question}</summary><p className="mt-3 max-w-3xl leading-7 text-slate-600">{faq.answer}</p></details>)}
          </div></div>
          <aside className="self-start border-t-4 border-[#d77718] bg-white p-8"><h2 className="text-3xl font-semibold tracking-tight text-[#10233f]">{t("ctaHeading")}</h2><p className="mt-4 leading-7 text-slate-600">{t("ctaSubtitle")}</p><Link href="/quote" className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#10233f] px-6 py-3.5 font-semibold text-white hover:bg-[#18365e]">{t("ctaButton")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></aside>
        </div>
      </section>
    </div>
  );
}

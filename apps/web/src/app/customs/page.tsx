"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CustomsPage() {
  const t = useTranslations("CustomsPage");
  const groups = [
    { title: "prohibitedTitle", desc: "prohibitedDesc", items: "prohibitedItems", colour: "border-red-600" },
    { title: "restrictedTitle", desc: "restrictedDesc", items: "restrictedItems", colour: "border-amber-500" },
    { title: "allowedTitle", desc: "allowedDesc", items: "allowedItems", colour: "border-emerald-600" },
  ] as const;

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#10233f]">
      <header className="border-b border-[#10233f]/15">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#a95d14]">{t("eyebrow")}</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-none tracking-[-0.04em] sm:text-6xl">{t("heroTitle")}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600">{t("heroSubtitle")}</p>
        </div>
      </header>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <p className="mb-8 max-w-3xl border-l-4 border-[#d77718] pl-5 leading-7 text-slate-600">{t("routeWarning")}</p>
          <div className="grid border-y border-slate-300 lg:grid-cols-3">
            {groups.map((group, index) => (
              <article key={group.title} className={`border-t-4 ${group.colour} py-8 lg:px-8 ${index > 0 ? "lg:border-l lg:border-slate-300" : ""}`}>
                <h2 className="text-2xl font-semibold">{t(group.title)}</h2>
                <p className="mt-4 min-h-24 leading-7 text-slate-600">{t(group.desc)}</p>
                <ul className="mt-6 divide-y divide-slate-200 border-t border-slate-200 text-sm text-slate-700">
                  {(t.raw(group.items) as string[]).map((item) => <li key={item} className="py-3">{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#10233f]/15 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr]"><div><h2 className="text-3xl font-semibold tracking-tight">{t("documentationHeading")}</h2><p className="mt-4 leading-7 text-slate-600">{t("documentationSubheading")}</p></div>
            <div className="grid gap-8 md:grid-cols-2">
              {[{ title: "invoiceTitle", intro: "invoiceIntro", items: "invoiceItems" }, { title: "waybillTitle", intro: "waybillIntro", items: "waybillItems" }].map((section) => <article key={section.title} className="border-t-2 border-[#10233f] pt-5"><h3 className="text-xl font-semibold">{t(section.title)}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{t(section.intro)}</p><ul className="mt-5 divide-y divide-slate-300 border-y border-slate-300 text-sm">{(t.raw(section.items) as string[]).map((item) => <li key={item} className="py-3">{item}</li>)}</ul></article>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#10233f] py-16 text-white lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:px-10 lg:grid-cols-[0.45fr_0.55fr]">
          <h2 className="text-3xl font-semibold tracking-tight">{t("estimatorHeading")}</h2>
          <div><p className="text-lg leading-8 text-slate-200">{t("estimatorSubheading")}</p><p className="mt-6 border-t border-white/20 pt-5 text-sm leading-6 text-slate-300">{t("estimatorDisclaimer")}</p><Link href="/quote" className="mt-7 inline-block rounded-md bg-[#d77718] px-6 py-3 font-semibold text-white hover:bg-[#b95f0d]">{t("prepareShipment")}</Link></div>
        </div>
      </section>
    </main>
  );
}

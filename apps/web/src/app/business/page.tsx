"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function BusinessPage() {
  const t = useTranslations("BusinessPage");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workingPoints = t.raw("workingPoints") as Array<{ title: string; body: string }>;
  const enquiryPoints = t.raw("enquiryPoints") as string[];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(event.currentTarget);
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
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#10233f]">
      <header className="border-b border-[#10233f]/15">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#a95d14]">{t("badge")}</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-none tracking-[-0.04em] sm:text-6xl">{t("heroTitle")}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600">{t("heroSubtitle")}</p>
          <a href="#contact" className="mt-9 inline-flex items-center gap-2 rounded-md bg-[#d77718] px-6 py-3.5 font-semibold text-white hover:bg-[#b95f0d]">{t("contactSales")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
        </div>
      </header>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[0.4fr_0.6fr]">
          <div><h2 className="text-3xl font-semibold tracking-tight">{t("whyChooseHeading")}</h2><p className="mt-4 leading-7 text-slate-600">{t("whyChooseSubheading")}</p></div>
          <div className="border-t border-slate-300">
            {workingPoints.map((point, index) => <article key={point.title} className="grid gap-3 border-b border-slate-300 py-7 sm:grid-cols-[3rem_12rem_1fr]"><span className="font-mono text-sm text-[#a95d14]">0{index + 1}</span><h3 className="font-semibold">{point.title}</h3><p className="leading-7 text-slate-600">{point.body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-y border-[#10233f]/15 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:px-10 lg:grid-cols-2">
          <div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#a95d14]">{t("enquiryEyebrow")}</p><h2 className="mt-4 text-3xl font-semibold tracking-tight">{t("enquiryHeading")}</h2><p className="mt-4 max-w-xl leading-7 text-slate-600">{t("enquiryBody")}</p></div>
          <ul className="divide-y divide-slate-300 border-y border-slate-300">{enquiryPoints.map((point) => <li key={point} className="py-4 leading-7 text-slate-700">{point}</li>)}</ul>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-[#10233f] py-16 text-white lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[0.4fr_0.6fr]">
          <div><h2 className="text-3xl font-semibold tracking-tight">{t("contactHeading")}</h2><p className="mt-4 max-w-md leading-7 text-slate-300">{t("contactSubheading")}</p></div>
          {submitted ? (
            <div className="border-l-4 border-emerald-400 bg-white/5 p-8"><CheckCircle2 className="h-7 w-7 text-emerald-400" aria-hidden="true" /><h3 className="mt-5 text-2xl font-semibold">{t("requestReceivedTitle")}</h3><p className="mt-3 leading-7 text-slate-300">{t("requestReceivedBody")}</p></div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div><label htmlFor="companyName" className="mb-2 block text-sm font-semibold">{t("companyNameLabel")}</label><input id="companyName" name="companyName" required autoComplete="organization" placeholder={t("companyNamePlaceholder")} className="w-full rounded-md border border-white/25 bg-white/10 px-4 py-3.5 text-white placeholder:text-white/40 focus:border-[#efa146] focus:outline-none" /></div>
                <div><label htmlFor="monthlyVolume" className="mb-2 block text-sm font-semibold">{t("monthlyVolumeLabel")}</label><select id="monthlyVolume" name="monthlyVolume" required className="w-full rounded-md border border-white/25 bg-[#18365e] px-4 py-3.5 text-white focus:border-[#efa146] focus:outline-none"><option value="">{t("selectVolumePlaceholder")}</option><option value="0-50">{t("volumeOption1")}</option><option value="51-500">{t("volumeOption2")}</option><option value="500+">{t("volumeOption3")}</option></select></div>
              </div>
              <div><label htmlFor="workEmail" className="mb-2 block text-sm font-semibold">{t("workEmailLabel")}</label><input id="workEmail" name="workEmail" type="email" required autoComplete="email" placeholder="name@company.com" className="w-full rounded-md border border-white/25 bg-white/10 px-4 py-3.5 text-white placeholder:text-white/40 focus:border-[#efa146] focus:outline-none" /></div>
              <div><label htmlFor="message" className="mb-2 block text-sm font-semibold">{t("messageLabel")}</label><textarea id="message" name="message" rows={5} placeholder={t("messagePlaceholder")} className="w-full rounded-md border border-white/25 bg-white/10 px-4 py-3.5 text-white placeholder:text-white/40 focus:border-[#efa146] focus:outline-none" /></div>
              {error && <p role="alert" className="border-l-4 border-red-400 bg-red-950/40 px-4 py-3 text-sm">{error}</p>}
              <button type="submit" disabled={submitting} className="justify-self-start rounded-md bg-[#d77718] px-7 py-3.5 font-semibold text-white hover:bg-[#b95f0d] disabled:opacity-60">{submitting ? t("submitting") : t("submitRequest")}</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

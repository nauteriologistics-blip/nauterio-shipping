"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Search,
  PlaneTakeoff,
  Ship,
  Clock,
  ShieldCheck,
  Headset,
  FileCheck,
  MapPin,
  ChevronDown,
  ChevronUp,
  PackageCheck,
  CheckCircle2,
  ClipboardCheck,
  Building2
} from "lucide-react";
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

interface TrustBarItem {
  title: string;
  desc: string;
}

interface StepItem {
  title: string;
  desc: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ReadinessItem {
  title: string;
  desc: string;
  status: "available" | "pending";
}

export default function Home() {
  const router = useRouter();
  const t = useTranslations("Home");
  const tCatalog = useTranslations("ServiceCatalog");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [trackingId, setTrackingId] = useState("");

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/tracking?id=${encodeURIComponent(trackingId.trim())}`);
    }
  };

  const trustBar = t.raw("trustBar") as TrustBarItem[];
  const steps = t.raw("steps") as StepItem[];
  const faqs = t.raw("faqs") as FaqItem[];
  const readinessItems = t.raw("readinessItems") as ReadinessItem[];
  const trustIcons = [Headset, FileCheck, MapPin, ShieldCheck];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-[78vh] items-center overflow-hidden pb-20 pt-8 sm:pt-12 lg:pb-24 lg:pt-24">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_20%,rgba(242,140,24,0.16),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(8,31,61,0.12),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#ffffff_48%,#fff7ed_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-white to-transparent" />

        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">

            {/* Left Content */}
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#081F3D]/10 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#081F3D] shadow-sm shadow-slate-200/70 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#F28C18]" />
                {t("corridorLabel")}
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-[-0.045em] text-[#081F3D] sm:text-5xl lg:text-7xl lg:leading-[0.98]">
                {t("heroTitle")}
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                {t("heroSubtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-[#F28C18] px-8 py-4 text-lg font-bold text-white shadow-xl shadow-orange-900/15 transition-all hover:-translate-y-0.5 hover:bg-[#d97c14] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#081F3D]"
                >
                  {t("getInstantQuote")}
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/tracking"
                  className="inline-flex items-center justify-center rounded-full border border-[#081F3D]/20 bg-white px-8 py-4 text-lg font-bold text-[#081F3D] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#081F3D]/40 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C18]"
                >
                  {t("trackShipmentButton")}
                </Link>
              </div>

              {/* Tracking Input */}
              <form onSubmit={handleQuickTrack} className="max-w-xl rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-xl shadow-slate-200/60 backdrop-blur">
                <label htmlFor="quick-track" className="mb-3 block px-2 text-sm font-semibold text-slate-600">
                  {t("quickTrackLabel")}
                </label>
                <div className="relative flex max-w-lg gap-2">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                      id="quick-track"
                      type="text"
                      name="trackingId"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder={t("quickTrackPlaceholder")}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3 pl-11 pr-4 shadow-inner shadow-slate-200/40 transition-all focus:border-[#081F3D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#081F3D]/15"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-2xl bg-[#081F3D] px-5 py-3 font-bold text-white transition-all hover:bg-[#0B2E5E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C18]"
                  >
                    {t("quickTrackButton")}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Visual */}
            <div className="relative hidden w-full lg:block">
              <div className="absolute -inset-10 rounded-full bg-gradient-to-br from-orange-100/60 to-blue-100/70 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[#081F3D] p-8 text-white shadow-2xl shadow-blue-950/20">
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#F28C18]/10 blur-3xl" />
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C18]">{t("routeCardEyebrow")}</p>
                    <p className="mt-2 text-2xl font-bold">{t("routeCardTitle")}</p>
                  </div>
                  <PlaneTakeoff className="h-8 w-8 text-[#F28C18]" aria-hidden="true" />
                </div>
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-4xl font-black">MXP</p>
                    <p className="mt-1 text-xs text-blue-100/70">{t("milan")}, IT</p>
                  </div>
                  <div className="relative flex-1">
                    <div className="border-t border-dashed border-white/40" />
                    <div className="absolute -top-1.5 left-[62%] h-3 w-3 rounded-full border-2 border-[#081F3D] bg-[#F28C18]" />
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black">JFK</p>
                    <p className="mt-1 text-xs text-blue-100/70">{t("newYork")}, US</p>
                  </div>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                  {(["routeCardStep1", "routeCardStep2", "routeCardStep3"] as const).map((key, index) => (
                    <div key={key} className="rounded-2xl bg-white/[0.06] p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#F28C18]">0{index + 1}</p>
                      <p className="mt-2 text-sm font-semibold leading-snug">{t(key)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-4 text-[#081F3D]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <PackageCheck className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t("statusUpdateLabel")}</p>
                    <p className="text-sm font-bold">{t("milestoneExample")}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{t("exampleLabel")}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="bg-white">
        <div className="container mx-auto px-6 pb-10 lg:px-12">
          <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 sm:grid-cols-2 lg:grid-cols-4">
            {trustBar.map((item, i) => {
              const Icon = trustIcons[i];
              return (
                <div key={i} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-6">
                  <Icon className="mb-5 h-7 w-7 text-[#F28C18]" aria-hidden="true" />
                  <h3 className="mb-1 font-bold text-slate-950">{item.title}</h3>
                  <p className="text-sm leading-6 text-slate-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SERVICE READINESS */}
      <section className="bg-[#081F3D] py-20 text-white lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28C18]">{t("readinessEyebrow")}</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">{t("readinessHeading")}</h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-blue-100/75">{t("readinessBody")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {readinessItems.map((item) => {
                const available = item.status === "available";
                return (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-lg shadow-blue-950/10">
                    <div className="flex items-start gap-3">
                      {available ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                      ) : (
                        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue-200" aria-hidden="true" />
                      )}
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-blue-100/65">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section className="bg-white py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-black tracking-tight text-[#081F3D] sm:text-4xl">{t("servicesHeading")}</h2>
            <p className="text-lg leading-8 text-slate-500">{t("servicesSubheading")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.id];
              const catalogKey = SERVICE_CATALOG_KEYS[service.id];
              return (
                <div
                  key={service.id}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#081F3D]/15 hover:shadow-2xl hover:shadow-slate-200/80 lg:p-10"
                >
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 transition-colors group-hover:bg-blue-50">
                    <Icon className="h-7 w-7 text-[#081F3D]" aria-hidden="true" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-slate-950">{tCatalog(`${catalogKey}.name`)}</h3>
                  <p className="mb-8 line-clamp-3 text-base leading-7 text-slate-600">
                    {tCatalog(`${catalogKey}.description`)}
                  </p>
                  <div className="mb-8 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <Clock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    <span className="text-sm font-medium text-slate-700">{tCatalog(`${catalogKey}.transitLabel`)}</span>
                  </div>
                  <Link
                    href="/services"
                    className="inline-flex items-center font-bold text-[#F28C18] transition-colors hover:text-[#d97c14]"
                  >
                    {t("learnMore")} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bg-slate-50 py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <h2 className="mb-4 text-3xl font-black tracking-tight text-[#081F3D] sm:text-4xl">{t("howItWorksHeading")}</h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-500">{t("howItWorksSubheading")}</p>
          </div>

          <div className="relative">
            {/* Connecting line (hidden on mobile) */}
            <div className="absolute left-12 right-12 top-8 hidden h-[2px] bg-slate-200 md:block" />

            <div className="relative z-10 grid gap-6 md:grid-cols-4">
              {steps.map((item, i) => (
                <div key={i} className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl font-black text-[#081F3D] shadow-sm">
                    {i + 1}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-950">{item.title}</h3>
                  <p className="leading-7 text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. DOCUMENT READINESS */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-2 lg:items-center lg:px-12">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-inner shadow-white md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#081F3D] text-white">
                <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C18]">{t("documentsEyebrow")}</p>
                <h2 className="mt-1 text-2xl font-bold text-[#081F3D]">{t("documentsHeading")}</h2>
              </div>
            </div>
            <ol className="mt-8 space-y-5">
              {(["documentsStep1", "documentsStep2", "documentsStep3", "documentsStep4"] as const).map((key, index) => (
                <li key={key} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#081F3D] shadow-sm">{index + 1}</span>
                  <span className="text-sm leading-relaxed text-slate-600">{t(key)}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28C18]">{t("proofEyebrow")}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#081F3D] sm:text-4xl">{t("proofHeading")}</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{t("proofBody")}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 p-6 shadow-sm">
                <FileCheck className="h-6 w-6 text-[#F28C18]" aria-hidden="true" />
                <p className="mt-4 font-bold text-[#081F3D]">{t("proofCustomsTitle")}</p>
                <p className="mt-1 text-sm text-slate-500">{t("proofCustomsDesc")}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 p-6 shadow-sm">
                <Building2 className="h-6 w-6 text-[#F28C18]" aria-hidden="true" />
                <p className="mt-4 font-bold text-[#081F3D]">{t("proofBusinessTitle")}</p>
                <p className="mt-1 text-sm text-slate-500">{t("proofBusinessDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ROUTE SHOWCASE */}
      <section className="bg-white py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <h2 className="text-3xl font-black tracking-tight text-[#081F3D] sm:text-4xl">{t("routeHeading")}</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t("routeParagraph")}
              </p>

              <div className="grid sm:grid-cols-2 gap-8 pt-4">
                <div>
                  <FileCheck className="h-7 w-7 text-[#F28C18] mb-2" aria-hidden="true" />
                  <div className="text-slate-900 font-medium mb-1">{t("routeFeature1Title")}</div>
                  <p className="text-sm text-slate-500">{t("routeFeature1Desc")}</p>
                </div>
                <div>
                  <MapPin className="h-7 w-7 text-[#F28C18] mb-2" aria-hidden="true" />
                  <div className="text-slate-900 font-medium mb-1">{t("routeFeature2Title")}</div>
                  <p className="text-sm text-slate-500">{t("routeFeature2Desc")}</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-xl shadow-slate-200/70 md:p-12">
              <div className="absolute right-0 top-0 h-64 w-64 -translate-y-20 translate-x-20 rounded-full bg-white/60 blur-3xl"></div>

              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#081F3D]">MXP</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">{t("milan")}</p>
                  </div>
                  <div className="flex-1 px-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-dashed border-slate-300"></div>
                    </div>
                    <PlaneTakeoff className="h-8 w-8 text-[#F28C18] relative z-10 bg-white px-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#081F3D]">JFK</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">{t("newYork")}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#081F3D]">GOA</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">{t("genoa")}</p>
                  </div>
                  <div className="flex-1 px-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-dashed border-slate-300"></div>
                    </div>
                    <Ship className="h-8 w-8 text-[#081F3D] relative z-10 bg-white px-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#081F3D]">EWR</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">{t("newark")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="bg-white py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-black tracking-tight text-[#081F3D] sm:text-4xl">{t("faqHeading")}</h2>
            <p className="text-lg text-slate-500">{t("faqSubheading")}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const panelId = `faq-panel-${index}`;
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C18]"
                  >
                    <span className="font-semibold text-lg text-slate-900">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" aria-hidden="true" />
                    )}
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CTA SECTION */}
      <section className="relative overflow-hidden bg-[#081F3D] py-24 lg:py-32">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl -mr-[200px] -mt-[200px]" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl -ml-[100px] -mb-[100px]" aria-hidden="true"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-10">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("ctaHeading")}
            </h2>
            <p className="text-xl text-blue-100/80 max-w-xl mx-auto">
              {t("ctaSubtitle")}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-[#F28C18] px-10 py-5 text-xl font-bold text-white shadow-lg shadow-orange-900/50 transition-all hover:-translate-y-0.5 hover:bg-[#d97c14]"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

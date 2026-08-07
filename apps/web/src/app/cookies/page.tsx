"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Database,
  ShieldCheck,
  Sliders,
  Globe,
  Lock,
  ChevronRight,
  Printer,
  FileCheck
} from "lucide-react";

const sections = [
  { id: "what", label: "1. What Are Cookies?" },
  { id: "usage", label: "2. How Nauterio Uses Cookies" },
  { id: "categories", label: "3. Categories & Purposes" },
  { id: "management", label: "4. Managing Cookie Preferences" },
  { id: "contact", label: "5. Contact & Questions" },
];

export default function CookiePolicyPage() {
  const [activeSection, setActiveSection] = useState("what");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-[#081F3D]">
      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-[#F28C18] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-[#081F3D]">Legal</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-[#F28C18]">Cookie Policy</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200">
                <Database className="w-3.5 h-3.5 text-[#F28C18]" /> Web Telemetry &amp; Storage
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#081F3D]">
                Cookie Policy
              </h1>
              <p className="text-slate-500 text-base mt-3 max-w-2xl">
                Clear information on how Nauterio utilizes cookies, local storage, and tracking technologies to deliver our digital freight services.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600">
                <p><strong className="text-[#081F3D]">Last Updated:</strong> August 1, 2026</p>
                <p className="mt-1"><strong className="text-[#081F3D]">Compliance:</strong> ePrivacy Directive / GDPR</p>
              </div>
              <button 
                onClick={() => window.print()} 
                className="hidden sm:flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4 text-slate-500" /> Print / Save
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sticky Navigation Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Document Nav Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollTo(sec.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                        activeSection === sec.id
                          ? "bg-[#081F3D] text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-[#081F3D]"
                      }`}
                    >
                      <span>{sec.label}</span>
                      {activeSection === sec.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18]"></span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Switcher */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Other Policies
                </h3>
                <div className="space-y-2 text-sm">
                  <Link href="/terms" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#F28C18]" /> Terms of Service
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link href="/privacy" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#F28C18]" /> Privacy Policy
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Article Content */}
          <main className="lg:col-span-8 space-y-10">
            
            {/* Section 1 */}
            <section id="what" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold">
                  01
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">What Are Cookies?</h2>
              </div>
              
              <p className="text-slate-600 leading-relaxed text-base">
                Cookies are small text files placed on your computer or mobile device when you interact with web applications. They allow websites to remember user preferences, maintain active login sessions across pages, and analyze platform performance.
              </p>
            </section>

            {/* Section 2 */}
            <section id="usage" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold">
                  02
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">How Nauterio Uses Cookies</h2>
              </div>

              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  On the Nauterio Logistics platform, cookies serve specific operational functions:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Preserving draft package dimensions and addresses as you move through the 4-step Quote Calculator.</li>
                  <li>Maintaining your selected language preference (English / Italian).</li>
                  <li>Securing login sessions to the Customer Portal and Business Dashboard.</li>
                  <li>Preventing automated bot abuse on quote calculation endpoints.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="categories" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold">
                  03
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Categories &amp; Purposes</h2>
              </div>

              <div className="space-y-4">
                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2 font-bold text-[#081F3D] text-base mb-1">
                    <Lock className="w-4 h-4 text-green-600" /> Essential / Strictly Necessary Cookies
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Required for core security, session management, and quote calculation. These cannot be disabled as the platform cannot function without them.
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2 font-bold text-[#081F3D] text-base mb-1">
                    <Globe className="w-4 h-4 text-[#F28C18]" /> Functional Preference Cookies
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Store language selections (EN/IT), unit preferences (kg/cm vs. lb/in), and currency options (EUR/USD).
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2 font-bold text-[#081F3D] text-base mb-1">
                    <Sliders className="w-4 h-4 text-blue-600" /> Privacy-First Analytics Cookies
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Help us measure traffic patterns and identify slow-loading pages. Data is fully anonymized and never shared with third-party ad networks.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="management" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold">
                  04
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Managing Cookie Preferences</h2>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                You can manage or block cookies at any time directly through your web browser settings:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-[#081F3D] block mb-1 font-bold">Google Chrome</strong>
                  Settings &gt; Privacy and Security &gt; Cookies and Site Data
                </div>
                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-[#081F3D] block mb-1 font-bold">Mozilla Firefox</strong>
                  Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection
                </div>
                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-[#081F3D] block mb-1 font-bold">Apple Safari</strong>
                  Preferences &gt; Privacy &gt; Block all cookies
                </div>
                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50">
                  <strong className="text-[#081F3D] block mb-1 font-bold">Microsoft Edge</strong>
                  Settings &gt; Site permissions &gt; Cookies and site data
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="contact" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold">
                  05
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Contact &amp; Questions</h2>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-600">
                <p>A confirmed contact email for cookie and telemetry questions will be published here once available.</p>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

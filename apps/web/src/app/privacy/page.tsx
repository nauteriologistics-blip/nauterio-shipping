"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  UserCheck, 
  FileCheck, 
  ChevronRight,
  Printer,
  Building2,
  CheckCircle2
} from "lucide-react";

const sections = [
  { id: "intro", label: "1. Introduction & Overview" },
  { id: "controller", label: "2. Data Controller & DPO" },
  { id: "collected", label: "3. Categories of Data Collected" },
  { id: "purposes", label: "4. Legal Basis & Processing Purposes" },
  { id: "transfers", label: "5. EU-U.S. Data Transfers" },
  { id: "retention", label: "6. Data Retention Schedule" },
  { id: "rights", label: "7. Your GDPR Rights" },
  { id: "security", label: "8. Security Measures" },
  { id: "contact", label: "9. Privacy Desk Contact" },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("intro");

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
      <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-[#F28C18] transition-colors font-medium">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-500">Legal</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-[#081F3D]">Privacy Policy</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F28C18]" /> GDPR &amp; U.S. Privacy Compliant
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#081F3D]">
                Privacy Policy
              </h1>
              <p className="text-slate-600 text-base mt-3 max-w-2xl leading-relaxed">
                Transparent information regarding how Nauterio collects, processes, protects, and transfers personal data for transatlantic shipping operations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600">
                <p><strong className="text-[#081F3D]">Last Updated:</strong> August 1, 2026</p>
                <p className="mt-1"><strong className="text-[#081F3D]">Framework:</strong> EU GDPR / Italian Codice Privacy</p>
              </div>
              <button 
                onClick={() => window.print()} 
                className="hidden sm:flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4 text-slate-500" /> Print Policy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sticky Navigation Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Document Nav Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Navigation Index
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
                  Related Policies
                </h3>
                <div className="space-y-2 text-sm">
                  <Link href="/terms" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#F28C18]" /> Terms of Service
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link href="/cookies" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#F28C18]" /> Cookie Policy
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* DPO Contact Box */}
              <div className="bg-[#081F3D] text-white rounded-2xl p-6 shadow-md">
                <h4 className="font-bold text-base mb-2">Exercise GDPR Rights</h4>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  Request data access, deletion, or export directly with our Data Protection Officer.
                </p>
                <a 
                  href="mailto:privacy@nauterio.com" 
                  className="inline-block w-full text-center bg-[#F28C18] hover:bg-[#d97c14] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Email privacy@nauterio.com
                </a>
              </div>
            </div>
          </aside>

          {/* Main Article Content */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Section 1 */}
            <section id="intro" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  01
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Introduction &amp; Overview</h2>
              </div>
              
              <div className="text-slate-600 space-y-4 text-sm leading-relaxed">
                <p>
                  Nauterio Logistics S.r.l. (&quot;Nauterio,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the privacy, confidentiality, and security of personal data entrusted to us by shippers, consignees, business partners, and platform visitors.
                </p>
                <p>
                  This Privacy Policy applies to all services provided via our website (nauterio.com), mobile PWAs, quote calculators, API interfaces, and physical sorting hubs in Milan and Newark.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="controller" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  02
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Data Controller &amp; DPO</h2>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#081F3D] text-base mb-2">
                  <Building2 className="w-5 h-5 text-[#F28C18]" /> Data Controller Entity
                </div>
                <p><strong>Entity Name:</strong> Nauterio Logistics S.r.l.</p>
                <p><strong>Registered Address:</strong> Via Larga 15, 20122 Milano (MI), Italy</p>
                <p><strong>P.IVA / Codice Fiscale:</strong> IT09884920961 | EORI: IT09884920961</p>
                <p><strong>Data Protection Officer (DPO):</strong> <a href="mailto:privacy@nauterio.com" className="text-[#F28C18] font-medium hover:underline">privacy@nauterio.com</a></p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="collected" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  03
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Categories of Data Collected</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                  <h3 className="font-bold text-[#081F3D] text-sm mb-2">Shipper &amp; Consignee Details</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Full names, origin pickup addresses in Italy, destination delivery addresses in the U.S., contact phone numbers, and notification email addresses.
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                  <h3 className="font-bold text-[#081F3D] text-sm mb-2">Customs Entry Credentials</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Italian Codice Fiscale or P.IVA, U.S. EIN/SSN (for U.S. CBP import clearance filings), commercial invoice descriptions, commodity values, and FDA prior notice details.
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                  <h3 className="font-bold text-[#081F3D] text-sm mb-2">Billing &amp; Payment Data</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    SEPA bank account details, SWIFT wiring instructions, and credit card tokens (processed securely via PCI-DSS Level 1 compliant payment gateways).
                  </p>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                  <h3 className="font-bold text-[#081F3D] text-sm mb-2">Telemetry &amp; Device Logs</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    IP address, geolocation data for package tracking maps, browser user-agent, session cookies, and portal navigation telemetry.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="purposes" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  04
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Legal Basis &amp; Processing Purposes</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#081F3D] text-sm">Contract Performance (Art. 6.1.b GDPR)</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">Executing freight forwarding, issuing bills of lading, coordinating flight/vessel slots, customs clearance, and door delivery.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#081F3D] text-sm">Legal Obligation (Art. 6.1.c GDPR)</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">Fulfilling Italian tax compliance, U.S. CBP customs recordkeeping, anti-money laundering (AML) checks, and trade embargo sanctions screening.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#081F3D] text-sm">Legitimate Interests (Art. 6.1.f GDPR)</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">Maintaining cargo security, preventing portal fraud, analyzing transit bottleneck metrics, and serving corporate account clients.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="transfers" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  05
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">EU-U.S. Data Transfers</h2>
              </div>

              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  Because Nauterio coordinates shipments between Italy and the United States, your personal data is necessarily transferred to U.S. customs entry systems, local U.S. delivery couriers, and warehouse sorting facilities in Newark, NJ.
                </p>
                <p>
                  All transatlantic transfers are safeguarded under European Commission Standard Contractual Clauses (SCCs) and the EU-U.S. Data Privacy Framework, ensuring equivalence with European privacy standards.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="retention" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  06
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Data Retention Schedule</h2>
              </div>

              {/* Retention Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs mb-4">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[#081F3D] font-bold">
                    <tr>
                      <th className="p-3.5">Data Category</th>
                      <th className="p-3.5">Retention Period</th>
                      <th className="p-3.5">Statutory Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-3.5 font-semibold text-[#081F3D]">Customs Declarations &amp; Invoices</td>
                      <td className="p-3.5 font-bold text-[#081F3D]">10 Years</td>
                      <td className="p-3.5">Italian Tax Code &amp; U.S. CBP 19 CFR regulations</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3.5 font-semibold text-[#081F3D]">Shipment Tracking Telemetry</td>
                      <td className="p-3.5">24 Months</td>
                      <td className="p-3.5">Logistics route optimization &amp; claims audit</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-[#081F3D]">Marketing Subscriptions</td>
                      <td className="p-3.5">Until Consent Withdrawn</td>
                      <td className="p-3.5">Consent (Art. 6.1.a GDPR)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 7 */}
            <section id="rights" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  07
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Your GDPR Rights</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#081F3D] block mb-1 font-bold">Right to Access (Art. 15)</strong>
                  Request a copy of all personal data held by Nauterio.
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#081F3D] block mb-1 font-bold">Right to Erasure (Art. 17)</strong>
                  Request deletion of non-statutory commercial data.
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#081F3D] block mb-1 font-bold">Right to Portability (Art. 20)</strong>
                  Receive data in structured JSON/CSV format.
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#081F3D] block mb-1 font-bold">Right to Object (Art. 21)</strong>
                  Opt-out of direct marketing profiling anytime.
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="security" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  08
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Security Measures</h2>
              </div>

              <div className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs leading-relaxed">
                <Lock className="w-6 h-6 text-[#F28C18] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#081F3D] text-sm block mb-1">Bank-Grade Data Encryption</strong>
                  All data in transit is protected using 256-bit TLS 1.3 encryption. Data at rest is encrypted using AES-256 in AWS EU-South-1 (Milan) data centers with strict multi-factor access control.
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="contact" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  09
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Privacy Desk Contact</h2>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-600 space-y-2">
                <p className="font-bold text-[#081F3D]">Nauterio Data Protection Officer</p>
                <p>Via Larga 15, 20122 Milano (MI), Italy</p>
                <p>Email: <a href="mailto:privacy@nauterio.com" className="text-[#F28C18] font-medium hover:underline">privacy@nauterio.com</a></p>
                <p className="text-xs text-slate-500 mt-2">Supervisory Authority: Garante per la protezione dei dati personali (www.garanteprivacy.it)</p>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

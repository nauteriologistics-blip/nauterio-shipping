"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  ShieldCheck, 
  Scale, 
  Truck, 
  AlertCircle, 
  Globe, 
  Building2, 
  ChevronRight,
  Printer,
  CheckCircle2,
  Lock,
  CreditCard
} from "lucide-react";

const sections = [
  { id: "agreement", label: "1. Agreement to Terms" },
  { id: "services", label: "2. Description of Services" },
  { id: "accounts", label: "3. User Accounts & Security" },
  { id: "carriage", label: "4. Shipping & Terms of Carriage" },
  { id: "liability", label: "5. Insurance & Liability Caps" },
  { id: "payment", label: "6. Payment & Invoicing Terms" },
  { id: "ip", label: "7. Intellectual Property" },
  { id: "disputes", label: "8. Governing Law & Jurisdiction" },
  { id: "contact", label: "9. Legal Contact & Notices" },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("agreement");

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
            <span className="font-semibold text-[#081F3D]">Terms of Service</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200">
                <Scale className="w-3.5 h-3.5 text-[#F28C18]" /> Legal Document v1.0
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#081F3D]">
                Terms of Service
              </h1>
              <p className="text-slate-600 text-base mt-3 max-w-2xl leading-relaxed">
                Comprehensive conditions governing your use of Nauterio Logistics freight forwarding, customs brokerage, and transport services between Italy and the Americas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600">
                <p><strong className="text-[#081F3D]">Effective Date:</strong> August 1, 2026</p>
                <p className="mt-1"><strong className="text-[#081F3D]">Entity:</strong> Nauterio Logistics S.r.l.</p>
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

              {/* Quick Legal Switcher */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Related Policies
                </h3>
                <div className="space-y-2 text-sm">
                  <Link href="/privacy" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#F28C18]" /> Privacy Policy
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link href="/cookies" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#F28C18]" /> Cookie Policy
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* Assistance Box */}
              <div className="bg-[#081F3D] text-white rounded-2xl p-6 shadow-md">
                <h4 className="font-bold text-base mb-2">Legal Team Support</h4>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  For enterprise contract terms, custom SLA inquiries, or legal formal notices:
                </p>
                <a 
                  href="mailto:legal@nauterio.com" 
                  className="inline-block w-full text-center bg-[#F28C18] hover:bg-[#d97c14] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Contact legal@nauterio.com
                </a>
              </div>
            </div>
          </aside>

          {/* Main Article Content */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Section 1 */}
            <section id="agreement" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  01
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Agreement to Terms</h2>
              </div>
              
              <div className="text-slate-600 space-y-4 text-sm leading-relaxed">
                <p>
                  By accessing, browsing, or utilizing the shipping, cargo forwarding, customs brokerage, or digital booking platforms provided by <strong>Nauterio Logistics S.r.l.</strong> (&quot;Nauterio,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you (&quot;Customer,&quot; &quot;Shipper,&quot; or &quot;User&quot;) unreservedly agree to be bound by these Terms of Service (&quot;Terms&quot;).
                </p>
                <p>
                  If you are entering into this agreement on behalf of a corporate entity, you represent and warrant that you possess full legal authority to bind that entity to these Terms. If you do not agree with any part of these Terms, you must immediately cease using our services.
                </p>
                
                {/* Entity Disclosure Box */}
                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
                  <Building2 className="w-6 h-6 text-[#F28C18] shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-[#081F3D]">Corporate Entity &amp; Official Registration:</p>
                    <p><strong>Nauterio Logistics S.r.l.</strong> — Registered Office: Via Larga 15, 20122 Milano (MI), Italy</p>
                    <p>P.IVA / Codice Fiscale: IT09884920961 | EORI: IT09884920961</p>
                    <p>U.S. Operations Hub: 100 Port Street, Newark, NJ 07114, USA</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="services" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  02
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Description of Services</h2>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Nauterio provides digital freight forwarding and logistics coordination specializing in trade lanes connecting Italy and the Americas. Our core services encompass:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#081F3D] mb-1">
                    <Truck className="w-4 h-4 text-[#F28C18]" /> Air Express
                  </div>
                  <p className="text-xs text-slate-500">1–3 business days direct MXP → JFK for time-critical express cargo.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#081F3D] mb-1">
                    <Truck className="w-4 h-4 text-[#F28C18]" /> Air Economy
                  </div>
                  <p className="text-xs text-slate-500">3–5 business days consolidated air freight with economical pricing.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#081F3D] mb-1">
                    <Globe className="w-4 h-4 text-[#F28C18]" /> Ocean LCL
                  </div>
                  <p className="text-xs text-slate-500">12–18 business days containerized sea freight Genoa → Newark.</p>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 list-disc pl-5">
                <li>Automated commercial invoice generation and customs documentation prep.</li>
                <li>Customs brokerage facilitation for U.S. Customs &amp; Border Protection (CBP) filings.</li>
                <li>Real-time telemetry and milestone tracking updates.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="accounts" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  03
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">User Accounts &amp; Security</h2>
              </div>

              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  To manage bookings, view commercial invoices, or access real-time milestone telemetry, users must register for a Customer Portal account. You agree to maintain current, complete, and accurate registration information.
                </p>
                <p>
                  You are solely responsible for protecting password confidentiality and restricting access to your devices. Nauterio is not liable for unauthorized access resulting from credential negligence.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="carriage" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  04
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Shipping &amp; Terms of Carriage</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#081F3D] mb-2">4.1 Rate Quotes &amp; Volumetric Weight Rules</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Quotations generated via the platform are calculated based on user-provided dimensions and weights. Billing uses the greater of actual gross weight or <strong>volumetric weight</strong> (L × W × H in cm / 5000 for air freight). Official re-weighing at origin or destination sorting facilities governs final billing.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#081F3D] mb-2">4.2 Customs Entry &amp; Import Duties</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Shippers must provide accurate commercial invoices, HS commodity codes, and declared values. All imports entering the U.S. undergo U.S. Customs and Border Protection (CBP) audit. Recipients are responsible for duties and taxes unless DDP (Delivery Duty Paid) was explicitly selected at checkout.
                  </p>
                </div>

                {/* Warning Alert Callout */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <strong className="font-bold">Prohibited Cargo Warning:</strong> Narcotics, counterfeit goods, hazardous materials (IATA DGR), firearms, and unapproved food items (FDA prior notice mandatory) are strictly prohibited. Illegal cargo will be seized and reported to Italian Guardia di Finanza &amp; U.S. CBP.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="liability" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  05
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Insurance &amp; Liability Caps</h2>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm mb-6">
                Under standard international transport conventions (Warsaw / Montreal Convention for Air, Hague-Visby Rules for Sea), carrier liability is strictly capped:
              </p>

              {/* Liability Comparison Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[#081F3D] font-bold">
                    <tr>
                      <th className="p-3.5">Service Type</th>
                      <th className="p-3.5">Standard Carrier Limit</th>
                      <th className="p-3.5">Claim Filing Window</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-3.5 font-semibold text-[#081F3D]">Air Express / Air Freight</td>
                      <td className="p-3.5">22 SDR per kg (~€25/kg)</td>
                      <td className="p-3.5">Within 14 calendar days</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3.5 font-semibold text-[#081F3D]">Ocean Freight LCL</td>
                      <td className="p-3.5">$500 per container package unit</td>
                      <td className="p-3.5">Within 7 calendar days</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-[#F28C18]">Full Cargo Insurance Add-On</td>
                      <td className="p-3.5 font-bold text-green-700">100% Declared Commercial Value</td>
                      <td className="p-3.5">Within 30 calendar days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 6 */}
            <section id="payment" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  06
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Payment &amp; Invoicing Terms</h2>
              </div>

              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  Individual bookings must be paid in full prior to cargo dispatch. We accept major payment cards (Visa, Mastercard, AMEX), SEPA Bank Transfers, and SWIFT wires.
                </p>
                <p>
                  Approved corporate B2B account holders receive monthly consolidated statements under Net-30 invoice terms. Overdue accounts accrue statutory interest at 8% per annum above the ECB benchmark rate pursuant to EU Late Payment Directive 2011/7/EU.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="ip" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  07
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Intellectual Property</h2>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                The Nauterio mark, logo, proprietary pricing algorithms, telemetry software, and web UI elements are exclusive property of Nauterio Logistics S.r.l. Unauthorized scraping, reverse engineering, or reproduction is strictly prohibited.
              </p>
            </section>

            {/* Section 8 */}
            <section id="disputes" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  08
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Governing Law &amp; Jurisdiction</h2>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                These Terms are governed by Italian law. Any dispute not resolved through informal mediation shall be submitted to the exclusive jurisdiction of the Courts of Milan (Foro di Milano), Italy.
              </p>
            </section>

            {/* Section 9 */}
            <section id="contact" className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#081F3D] font-bold text-sm">
                  09
                </div>
                <h2 className="text-2xl font-bold text-[#081F3D]">Legal Contact &amp; Notices</h2>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-600 space-y-2">
                <p className="font-bold text-[#081F3D]">Nauterio Logistics S.r.l. Legal Department</p>
                <p>Via Larga 15, 20122 Milano (MI), Italy</p>
                <p>Official Legal Email: <a href="mailto:legal@nauterio.com" className="text-[#F28C18] font-medium hover:underline">legal@nauterio.com</a></p>
                <p>Certified PEC Email: <span className="font-mono text-xs bg-slate-200/60 px-2 py-0.5 rounded text-slate-800">nauterio@pec.it</span></p>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

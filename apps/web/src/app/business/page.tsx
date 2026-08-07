"use client";

import { useState } from "react";
import { Check, Truck, Headset, Shield, FileCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function BusinessPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#081F3D] font-sans">
      {/* Hero Section */}
      <section className="py-24 md:py-32 flex flex-col items-center text-center px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-[#081F3D] font-semibold text-sm mb-6 border border-blue-100 tracking-wide">
            B2B SOLUTIONS
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Business Shipping Solutions
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            Bulk shipment tools, API access, and a dedicated account for businesses shipping
            regularly on the Italy-USA corridor.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-24 px-4 max-w-7xl mx-auto -mt-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Starter */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 h-full flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <p className="text-slate-500 mb-6">Up to 50 shipments/month</p>
            <div className="text-2xl font-bold mb-8 text-slate-700">Volume rates apply</div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> Automated waybills</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> Basic API access</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> Email support</li>
            </ul>
            <a href="#contact" className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-[#081F3D] font-bold transition-colors text-center">
              Get Started
            </a>
          </div>

          {/* Business (Highlighted) */}
          <div className="bg-white rounded-3xl p-10 shadow-lg border-2 border-[#F28C18] relative transform md:-translate-y-4 flex flex-col h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F28C18] text-white py-1 px-4 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2">Business</h3>
            <p className="text-slate-500 mb-6">50 - 500 shipments/month</p>
            <div className="text-2xl font-bold mb-8 text-slate-700">Volume rates apply</div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> Bulk import tools</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> Full API access</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> Priority support queue</li>
            </ul>
            <a href="#contact" className="w-full py-4 rounded-2xl bg-[#081F3D] hover:bg-[#081F3D]/90 text-white font-bold transition-colors text-center">
              Contact Sales
            </a>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 h-full flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-slate-500 mb-6">500+ shipments/month</p>
            <div className="text-2xl font-bold mb-8 text-slate-700">Custom rates</div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> Dedicated account contact</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> Custom integrations</li>
              <li className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#F28C18]" aria-hidden="true" /> Quarterly business reviews</li>
            </ul>
            <a href="#contact" className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-[#081F3D] font-bold transition-colors text-center">
              Contact Sales
            </a>
          </div>
        </div>
        <p className="text-center text-sm text-slate-400 mt-8">
          Volume discounts are agreed per account once contract rates are approved &mdash; figures
          above are placeholders, not published rate cards.
        </p>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why choose Nauterio for Business?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Purpose-built tools for the Italy-USA corridor, not a generic global platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm">
              <div className="w-14 h-14 bg-blue-50 text-[#081F3D] rounded-2xl flex items-center justify-center mb-6">
                <Truck className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Corridor Specialists</h3>
              <p className="text-slate-600 text-lg">We focus exclusively on Italy-USA freight rather than spreading across every global lane, so booking and customs data entry are built around this specific route.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm">
              <div className="w-14 h-14 bg-blue-50 text-[#081F3D] rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Risk Management</h3>
              <p className="text-slate-600 text-lg">Optional cargo protection will be available once insurance terms are finalised with a partner.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm">
              <div className="w-14 h-14 bg-blue-50 text-[#081F3D] rounded-2xl flex items-center justify-center mb-6">
                <FileCheck className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Guided Customs Data</h3>
              <p className="text-slate-600 text-lg">Commercial invoice and HS code guidance is built into the booking flow to help you prepare accurate CBP filings.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm">
              <div className="w-14 h-14 bg-blue-50 text-[#081F3D] rounded-2xl flex items-center justify-center mb-6">
                <Headset className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Dedicated Support</h3>
              <p className="text-slate-600 text-lg">Business accounts get a priority support queue instead of a generic ticket line.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 px-4 max-w-4xl mx-auto scroll-mt-24">
        <div className="bg-[#081F3D] rounded-3xl p-10 md:p-16 shadow-xl text-white">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Request received</h2>
              <p className="text-white/80">
                This is a pre-launch demo &mdash; no message was actually sent. A live enterprise
                contact flow will replace this once support channels are confirmed.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold mb-4">Let&apos;s talk about your volume</h2>
                <p className="text-white/80 text-lg">Tell us about your shipping needs so we can follow up when business accounts open.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-semibold text-white/90 mb-2">Company Name</label>
                    <input id="companyName" name="companyName" type="text" required autoComplete="organization" className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F28C18] text-white placeholder-white/40" placeholder="Acme Corp" />
                  </div>
                  <div>
                    <label htmlFor="monthlyVolume" className="block text-sm font-semibold text-white/90 mb-2">Monthly Volume</label>
                    <select id="monthlyVolume" name="monthlyVolume" required className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F28C18] text-white [&>option]:text-black">
                      <option value="">Select volume...</option>
                      <option value="0-50">0 - 50 shipments</option>
                      <option value="51-500">51 - 500 shipments</option>
                      <option value="500+">500+ shipments</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="workEmail" className="block text-sm font-semibold text-white/90 mb-2">Work Email</label>
                  <input id="workEmail" name="workEmail" type="email" required autoComplete="email" className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F28C18] text-white placeholder-white/40" placeholder="jane@acmecorp.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-white/90 mb-2">Message</label>
                  <textarea id="message" name="message" rows={4} className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F28C18] text-white placeholder-white/40" placeholder="Tell us about your current challenges..."></textarea>
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-[#F28C18] hover:bg-[#F28C18]/90 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                  Submit Request <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

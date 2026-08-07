"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  PackageCheck
} from "lucide-react";
import { SERVICES, type ServiceId } from "@/lib/services";

const SERVICE_ICONS: Record<ServiceId, typeof PlaneTakeoff> = {
  "air-express": PlaneTakeoff,
  "air-economy": PlaneTakeoff,
  "ocean-freight": Ship,
};

export default function Home() {
  const router = useRouter();
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

  const faqs = [
    {
      question: "How long does shipping from Italy to the USA typically take?",
      answer: "Air Express targets 2-5 business days after export acceptance, and Air Economy targets 5-10 business days. Ocean Freight (LCL) is schedule-based, with exact sailing and transit shown when you request a quote."
    },
    {
      question: "Do you handle US Customs clearance?",
      answer: "The platform is built to guide you through commercial invoice and customs data as part of booking. Full customs brokerage requires a confirmed broker partnership, which is not yet finalised."
    },
    {
      question: "Are my shipments insured?",
      answer: "Optional shipment protection will be offered at checkout once insurance terms are finalised with a partner. It is not yet available on this preview site."
    },
    {
      question: "Can I track my shipment in real-time?",
      answer: "You'll receive milestone updates from pickup through delivery on the tracking page. This preview uses sample tracking data; live carrier integration is not yet connected."
    },
    {
      question: "What types of goods can you ship?",
      answer: "We're focused on commercial and personal goods on the Italy-USA lane. See the Customs page for prohibited and restricted item categories before booking."
    }
  ];

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-24 pb-16 overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 -z-10" />
        
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-[#081F3D] leading-[1.1]">
                Ship from Italy to the United States with confidence.
              </h1>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Premium logistics for businesses. Fast customs clearance, real-time tracking, and dedicated support for your transatlantic supply chain.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/quote"
                  className="px-8 py-4 bg-[#F28C18] hover:bg-[#d97c14] text-white rounded-full font-medium transition-colors text-lg flex items-center justify-center"
                >
                  Get Instant Quote
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/tracking"
                  className="px-8 py-4 border-2 border-[#081F3D] text-[#081F3D] hover:bg-slate-50 rounded-full font-medium transition-colors text-lg flex items-center justify-center"
                >
                  Track Shipment
                </Link>
              </div>

              {/* Tracking Input */}
              <form onSubmit={handleQuickTrack} className="pt-8">
                <label htmlFor="quick-track" className="text-sm text-slate-500 mb-3 font-medium block">
                  Quick Track
                </label>
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="quick-track"
                    type="text"
                    name="trackingId"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter tracking number (e.g. NT-782914-US)"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#081F3D]/20 focus:border-[#081F3D] transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:block relative h-[600px] w-full">
              {/* Abstract decorative geometric representation of a route */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-lg mx-auto">
                  {/* Map dots */}
                  <div className="absolute top-[30%] left-[20%] w-6 h-6 bg-[#F28C18] rounded-full shadow-lg shadow-orange-500/40 z-20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute bottom-[40%] right-[20%] w-8 h-8 bg-[#081F3D] rounded-full shadow-lg shadow-blue-900/40 z-20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Connecting Arc (SVG) */}
                  <svg className="absolute inset-0 w-full h-full z-10 drop-shadow-xl" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path 
                      d="M 25 35 Q 60 10, 80 55" 
                      fill="none" 
                      stroke="url(#gradient)" 
                      strokeWidth="0.8" 
                      strokeDasharray="2, 2"
                      className="animate-pulse"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F28C18" />
                        <stop offset="100%" stopColor="#081F3D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Decorative circles */}
                  <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
                  <div className="absolute bottom-[20%] left-[10%] w-72 h-72 bg-orange-50 rounded-full blur-3xl opacity-60"></div>
                  
                  {/* Floating card */}
                  <div className="absolute top-[45%] right-[10%] bg-white p-5 rounded-2xl shadow-xl z-30 border border-slate-100 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <PackageCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Status Update</p>
                      <p className="text-sm font-bold text-[#081F3D]">Cleared US Customs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="border-y border-slate-100 bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-slate-100">
            <div className="flex flex-col items-center text-center px-4">
              <Headset className="h-8 w-8 text-[#F28C18] mb-4" aria-hidden="true" />
              <h3 className="font-semibold text-slate-900 mb-1">Support Built In</h3>
              <p className="text-sm text-slate-500">Ticketed support through the portal</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <FileCheck className="h-8 w-8 text-[#F28C18] mb-4" aria-hidden="true" />
              <h3 className="font-semibold text-slate-900 mb-1">Guided Customs Filing</h3>
              <p className="text-sm text-slate-500">Commercial invoice built into booking</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <MapPin className="h-8 w-8 text-[#F28C18] mb-4" aria-hidden="true" />
              <h3 className="font-semibold text-slate-900 mb-1">Milestone Tracking</h3>
              <p className="text-sm text-slate-500">Updates from pickup to delivery</p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <ShieldCheck className="h-8 w-8 text-[#F28C18] mb-4" aria-hidden="true" />
              <h3 className="font-semibold text-slate-900 mb-1">Optional Protection</h3>
              <p className="text-sm text-slate-500">Shipment protection available at checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[#081F3D] mb-4">Our Shipping Services</h2>
            <p className="text-lg text-slate-500">Tailored logistics solutions for the Italy-USA trade lane, balancing speed and cost efficiency.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.id];
              return (
                <div
                  key={service.id}
                  className="group bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-blue-50 transition-colors">
                    <Icon className="h-7 w-7 text-[#081F3D]" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">{service.name}</h3>
                  <p className="text-base text-slate-600 mb-8 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-3 mb-8">
                    <Clock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    <span className="text-sm font-medium text-slate-700">{service.transitLabel}</span>
                  </div>
                  <Link
                    href="/services"
                    className="inline-flex items-center text-[#F28C18] font-medium hover:text-[#d97c14] transition-colors"
                  >
                    Learn more <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-[#081F3D] mb-4">How it works</h2>
            <p className="text-lg text-slate-500 max-w-2xl">A streamlined digital process designed to save you time and eliminate paperwork.</p>
          </div>

          <div className="relative">
            {/* Connecting line (hidden on mobile) */}
            <div className="hidden md:block absolute top-8 left-12 right-12 h-[2px] bg-slate-200" />
            
            <div className="grid md:grid-cols-4 gap-12 relative z-10">
              {[
                { step: '1', title: 'Quote', desc: 'Get instant transparent pricing.' },
                { step: '2', title: 'Book', desc: 'Confirm your shipment online.' },
                { step: '3', title: 'Ship', desc: 'We pick up and handle customs.' },
                { step: '4', title: 'Deliver', desc: 'Final mile delivery in the US.' },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xl font-bold text-[#081F3D] mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ROUTE SHOWCASE */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-[#081F3D]">The Italy-USA Corridor Experts</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We specialize exclusively in transatlantic shipping between Italy and the United States. By focusing on this single trade lane, we offer unmatched reliability, consolidated customs expertise, and optimized transit times.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 pt-4">
                <div>
                  <FileCheck className="h-7 w-7 text-[#F28C18] mb-2" aria-hidden="true" />
                  <div className="text-slate-900 font-medium mb-1">Guided Customs Filing</div>
                  <p className="text-sm text-slate-500">Commercial invoice built into booking</p>
                </div>
                <div>
                  <MapPin className="h-7 w-7 text-[#F28C18] mb-2" aria-hidden="true" />
                  <div className="text-slate-900 font-medium mb-1">Milestone Tracking</div>
                  <p className="text-sm text-slate-500">Updates from Italian pickup to US delivery</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 md:p-12 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="relative z-10 flex flex-col gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#081F3D]">MXP</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Milan</p>
                  </div>
                  <div className="flex-1 px-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-dashed border-slate-300"></div>
                    </div>
                    <PlaneTakeoff className="h-8 w-8 text-[#F28C18] relative z-10 bg-white px-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#081F3D]">JFK</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">New York</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#081F3D]">GOA</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Genoa</p>
                  </div>
                  <div className="flex-1 px-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-dashed border-slate-300"></div>
                    </div>
                    <Ship className="h-8 w-8 text-[#081F3D] relative z-10 bg-white px-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#081F3D]">EWR</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Newark</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#081F3D] mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-500">Everything you need to know about shipping with Nauterio.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const panelId = `faq-panel-${index}`;
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all duration-200"
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

      {/* 7. CTA SECTION */}
      <section className="py-24 lg:py-32 bg-[#081F3D] relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl -mr-[200px] -mt-[200px]" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl -ml-[100px] -mb-[100px]" aria-hidden="true"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-10">
            <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Ready to ship?
            </h2>
            <p className="text-xl text-blue-100/80 max-w-xl mx-auto">
              Get an instant estimate and start your shipment in minutes.
            </p>
            <Link
              href="/quote"
              className="inline-block px-10 py-5 bg-[#F28C18] hover:bg-[#d97c14] text-white rounded-full font-medium transition-colors text-xl shadow-lg shadow-orange-900/50"
            >
              Get Your Free Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

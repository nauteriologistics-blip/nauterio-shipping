"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Package, MapPin, Plane, Ship, Check, ArrowRight, ArrowLeft,
  Info, Shield, Clock, Calculator, AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { SERVICES, getService, type ServiceId } from "@/lib/services";

const steps = [
  { id: 1, title: "Package Details" },
  { id: 2, title: "Addresses" },
  { id: 3, title: "Service" },
  { id: 4, title: "Review" },
];

const SERVICE_ICONS: Record<ServiceId, typeof Plane> = {
  "air-express": Plane,
  "air-economy": Plane,
  "ocean-freight": Ship,
};

interface QuoteResult {
  service: ServiceId;
  chargeableWeightKg: number;
  volumetricWeightKg: number;
  baseRateEur: number;
  customsFeeEur: number;
  pickupFeeEur: number;
  insuranceFeeEur: number;
  totalPriceEur: number;
  isIndicative: boolean;
  disclaimer: string;
}

interface FormData {
  weight: string;
  length: string;
  width: string;
  height: string;
  value: string;
  pickupCity: string;
  pickupZip: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZip: string;
  serviceId: ServiceId | "";
}

function QuoteCalculator() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isBooked, setIsBooked] = useState(false);
  const [quotesByService, setQuotesByService] = useState<Partial<Record<ServiceId, QuoteResult>>>({});
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);

  const [formData, setFormData] = useState<FormData>(() => {
    const preselected = searchParams.get("service");
    return {
      weight: "",
      length: "",
      width: "",
      height: "",
      value: "",
      pickupCity: "",
      pickupZip: "",
      deliveryCity: "",
      deliveryState: "",
      deliveryZip: "",
      serviceId: preselected && getService(preselected) ? (preselected as ServiceId) : "",
    };
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateVolumetricWeight = () => {
    const l = parseFloat(formData.length) || 0;
    const w = parseFloat(formData.width) || 0;
    const h = parseFloat(formData.height) || 0;
    return (l * w * h) / 5000;
  };

  const volumetricWeight = calculateVolumetricWeight();
  const actualWeight = parseFloat(formData.weight) || 0;
  const chargeableWeight = Math.max(actualWeight, volumetricWeight);
  const selectedService = getService(formData.serviceId);
  const selectedQuote = formData.serviceId ? quotesByService[formData.serviceId] : undefined;

  // Fetch live indicative pricing from the API for every service once the
  // user has entered package details and reaches the service-selection step.
  useEffect(() => {
    if (currentStep < 3 || actualWeight <= 0) return;

    let cancelled = false;

    const fetchQuotes = async () => {
      setIsFetchingQuotes(true);
      setQuoteError(null);
      try {
        const entries = await Promise.all(
          SERVICES.map(async (service) => {
            const res = await fetch("/api/v1/quotes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                weightKg: Number(formData.weight),
                lengthCm: Number(formData.length),
                widthCm: Number(formData.width),
                heightCm: Number(formData.height),
                declaredValueEur: Number(formData.value) || 0,
                service: service.id,
                addCustoms: true,
              }),
            });
            if (!res.ok) throw new Error("Quote request failed");
            const json = (await res.json()) as QuoteResult;
            return [service.id, json] as const;
          })
        );
        if (!cancelled) setQuotesByService(Object.fromEntries(entries));
      } catch {
        if (!cancelled) setQuoteError("Could not calculate pricing. Please check your package details.");
      } finally {
        if (!cancelled) setIsFetchingQuotes(false);
      }
    };

    fetchQuotes();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, formData.weight, formData.length, formData.width, formData.height, formData.value]);

  const handleBook = () => {
    setIsBooked(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#F28C18", "#081F3D", "#ffffff"],
    });
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 max-w-lg w-full text-center shadow-sm">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#081F3D] mb-4 font-inter">Demo booking recorded</h1>
          <p className="text-lg text-slate-600 mb-4">
            This is a pre-launch preview. No real shipment has been created and no email has been
            sent &mdash; booking, payment, and carrier integration are not yet connected.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#F28C18] text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-[#e07a12] transition-colors"
          >
            Start Another Quote
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-24 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#081F3D] mb-4">Get a Quote</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Calculate an indicative shipping estimate for your Italy to USA freight in seconds.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
            {steps.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 bg-white transition-colors duration-200
                    ${isActive ? "border-[#F28C18] text-[#F28C18]" :
                      isCompleted ? "border-[#F28C18] bg-[#F28C18] text-white" :
                      "border-slate-300 text-slate-400"}
                  `}>
                    {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span className={`mt-3 text-sm font-medium ${isActive || isCompleted ? "text-[#081F3D]" : "text-slate-400"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">

              {/* Step 1: Package Details */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-[#081F3D] flex items-center gap-3">
                    <Package className="text-[#F28C18]" aria-hidden="true" />
                    Package Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-slate-700 mb-2">Actual Weight (kg)</label>
                      <input
                        id="weight" type="number" name="weight" value={formData.weight} onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors"
                        placeholder="e.g. 50"
                      />
                    </div>
                    <div>
                      <label htmlFor="value" className="block text-sm font-medium text-slate-700 mb-2">Declared Value (EUR)</label>
                      <input
                        id="value" type="number" name="value" value={formData.value} onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors"
                        placeholder="e.g. 1500"
                      />
                    </div>
                  </div>

                  <fieldset>
                    <legend className="block text-sm font-medium text-slate-700 mb-2">Dimensions (L &times; W &times; H cm)</legend>
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        aria-label="Length in centimetres"
                        type="number" name="length" value={formData.length} onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors"
                        placeholder="Length"
                      />
                      <input
                        aria-label="Width in centimetres"
                        type="number" name="width" value={formData.width} onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors"
                        placeholder="Width"
                      />
                      <input
                        aria-label="Height in centimetres"
                        type="number" name="height" value={formData.height} onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors"
                        placeholder="Height"
                      />
                    </div>
                  </fieldset>

                  {(parseFloat(formData.length) > 0 && parseFloat(formData.width) > 0 && parseFloat(formData.height) > 0) && (
                    <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-4 border border-blue-100">
                      <div className="mt-0.5"><Calculator className="w-5 h-5 text-blue-600" aria-hidden="true" /></div>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900">Volumetric Weight: {volumetricWeight.toFixed(2)} kg</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Airlines charge based on the greater of actual weight or volumetric weight.
                          Your chargeable weight will be <span className="font-semibold">{chargeableWeight.toFixed(2)} kg</span>.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Addresses */}
              {currentStep === 2 && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-bold text-[#081F3D] flex items-center gap-3 mb-6">
                      <MapPin className="text-[#F28C18]" aria-hidden="true" />
                      Pickup Origin (Italy)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="pickupCity" className="block text-sm font-medium text-slate-700 mb-2">City</label>
                        <input
                          id="pickupCity" type="text" name="pickupCity" value={formData.pickupCity} onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors"
                          placeholder="e.g. Milan"
                        />
                      </div>
                      <div>
                        <label htmlFor="pickupZip" className="block text-sm font-medium text-slate-700 mb-2">Postcode</label>
                        <input
                          id="pickupZip" type="text" name="pickupZip" value={formData.pickupZip} onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors"
                          placeholder="e.g. 20121"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#081F3D] flex items-center gap-3 mb-6">
                      <MapPin className="text-[#081F3D]" aria-hidden="true" />
                      Delivery Destination (USA)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="deliveryCity" className="block text-sm font-medium text-slate-700 mb-2">City</label>
                        <input
                          id="deliveryCity" type="text" name="deliveryCity" value={formData.deliveryCity} onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors"
                          placeholder="e.g. New York"
                        />
                      </div>
                      <div>
                        <label htmlFor="deliveryState" className="block text-sm font-medium text-slate-700 mb-2">State</label>
                        <input
                          id="deliveryState" type="text" name="deliveryState" value={formData.deliveryState} onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors"
                          placeholder="e.g. NY"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label htmlFor="deliveryZip" className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                        <input
                          id="deliveryZip" type="text" name="deliveryZip" value={formData.deliveryZip} onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F28C18]/50 focus:border-[#F28C18] transition-colors"
                          placeholder="e.g. 10001"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Service Selection */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-[#081F3D] flex items-center gap-3">
                    <Clock className="text-[#F28C18]" aria-hidden="true" />
                    Select Service Level
                  </h2>

                  {quoteError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-800 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                      {quoteError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {SERVICES.map((service) => {
                      const Icon = SERVICE_ICONS[service.id];
                      const quote = quotesByService[service.id];
                      const isSelected = formData.serviceId === service.id;
                      return (
                        <div
                          key={service.id}
                          onClick={() => setFormData({ ...formData, serviceId: service.id })}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setFormData({ ...formData, serviceId: service.id });
                            }
                          }}
                          className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200
                            ${isSelected
                              ? "border-[#F28C18] bg-orange-50/30 shadow-md"
                              : "border-slate-200 hover:border-[#F28C18]/50 hover:bg-slate-50"}`}
                        >
                          {isSelected && (
                            <div className="absolute top-4 right-4 text-[#F28C18]">
                              <Check className="w-6 h-6" aria-hidden="true" />
                            </div>
                          )}
                          <div className="flex items-start gap-5">
                            <div className={`p-4 rounded-xl ${isSelected ? "bg-[#F28C18] text-white" : "bg-slate-100 text-slate-600"}`}>
                              <Icon className="w-8 h-8" aria-hidden="true" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-[#081F3D]">{service.name}</h3>
                              <p className="text-slate-500 mt-1">{service.transitLabel}</p>
                              <p className="text-sm text-slate-600 mt-2">{service.description}</p>
                            </div>
                            <div className="text-right">
                              {isFetchingQuotes && !quote ? (
                                <div className="text-sm text-slate-400">Calculating&hellip;</div>
                              ) : quote ? (
                                <>
                                  <div className="text-2xl font-bold text-[#081F3D]">&euro;{quote.baseRateEur.toFixed(2)}</div>
                                  <div className="text-sm text-slate-500">Indicative base rate</div>
                                </>
                              ) : (
                                <div className="text-sm text-slate-400">Enter weight in step 1</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-[#081F3D] flex items-center gap-3">
                    <Shield className="text-[#F28C18]" aria-hidden="true" />
                    Review & Book
                  </h2>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-6">
                    <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Origin</p>
                        <p className="font-semibold text-[#081F3D]">{formData.pickupCity || "Milan"}, IT {formData.pickupZip}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Destination</p>
                        <p className="font-semibold text-[#081F3D]">{formData.deliveryCity || "New York"}, {formData.deliveryState || "NY"} {formData.deliveryZip}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Package Specs</p>
                        <p className="font-semibold text-[#081F3D]">{actualWeight || 0} kg</p>
                        <p className="text-sm text-slate-600">{formData.length || 0} &times; {formData.width || 0} &times; {formData.height || 0} cm</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Service Level</p>
                        <p className="font-semibold text-[#081F3D]">{selectedService?.name || "Not selected"}</p>
                        <p className="text-sm text-slate-600">{selectedService?.transitLabel}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 mb-1">Value Protection</p>
                      <p className="font-semibold text-[#081F3D]">Declared Value: &euro;{formData.value || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors
                    ${currentStep === 1
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                  Back
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                    disabled={currentStep === 3 && !formData.serviceId}
                    className="flex items-center gap-2 px-8 py-4 bg-[#F28C18] text-white rounded-full font-medium hover:bg-[#e07a12] transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    onClick={handleBook}
                    className="flex items-center gap-2 px-8 py-4 bg-[#081F3D] text-white rounded-full font-medium hover:bg-[#0a274c] transition-colors shadow-sm"
                  >
                    Confirm Booking
                    <Check className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-[#081F3D] rounded-3xl p-8 shadow-lg text-white sticky top-8">
              <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Quote Summary</h3>

              <div className="space-y-6">
                <div>
                  <div className="text-white/60 text-sm mb-1">Route</div>
                  <div className="font-medium flex items-center justify-between">
                    <span>{formData.pickupCity || "Italy"}</span>
                    <ArrowRight className="w-4 h-4 text-[#F28C18] mx-2" aria-hidden="true" />
                    <span>{formData.deliveryCity || "USA"}</span>
                  </div>
                </div>

                <div>
                  <div className="text-white/60 text-sm mb-1">Chargeable Weight</div>
                  <div className="font-medium">{chargeableWeight > 0 ? `${chargeableWeight.toFixed(2)} kg` : "-"}</div>
                </div>

                {selectedService && (
                  <div>
                    <div className="text-white/60 text-sm mb-1">Service</div>
                    <div className="font-medium text-[#F28C18]">{selectedService.name}</div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Freight Charge</span>
                  <span>{selectedQuote ? `€${selectedQuote.baseRateEur.toFixed(2)}` : "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Customs Filing</span>
                  <span>{selectedQuote ? `€${selectedQuote.customsFeeEur.toFixed(2)}` : "-"}</span>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-lg font-medium">Total Estimate</span>
                  <span className="text-3xl font-bold text-[#F28C18]">
                    {selectedQuote ? `€${selectedQuote.totalPriceEur.toFixed(2)}` : "€0.00"}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <Info className="w-5 h-5 text-[#F28C18] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-white/70">
                  {selectedQuote?.disclaimer ??
                    "This is an illustrative estimate based on the details provided. Final charges require an approved rate card and are not yet confirmed."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <QuoteCalculator />
    </Suspense>
  );
}

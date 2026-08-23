"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package, MapPin, ClipboardCheck, Check,
  ArrowRight, ArrowLeft, AlertCircle, Sparkles
} from "lucide-react";
import { getCsrfToken } from "@/lib/auth";
import { CSRF_HEADER } from "@/lib/session";

function errorMessageOf(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

// Maps this wizard's 1-indexed step number to the real BookingStep enum
// (packages/database/prisma/schema.prisma) - the previous `STEP_${step}`
// literal ("STEP_1", "STEP_2"...) never matched any real enum value, so
// every draft save failed with a 500 the moment this endpoint was actually
// reached through the wizard's real session (previously masked by the
// hardcoded dev bearer token never resolving to a valid session at all).
const BOOKING_STEP_BY_WIZARD_STEP: Record<number, string> = {
  1: "PACKAGE_DETAILS",
  2: "ADDRESSES",
  3: "SERVICE",
  4: "REVIEW",
};

export default function NewBookingWizard({ senderName }: { senderName: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId") ?? undefined;
  const quotedTotalParam = searchParams.get("totalPriceEur");
  const quotedTotal = quotedTotalParam === null ? null : Number(quotedTotalParam);
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state - starts blank/zeroed rather than pre-filled with fake
  // company data (was "Acme Italy S.r.l." / "Acme USA Inc." etc.); only
  // senderName defaults, from the real signed-in profile.
  const [formData, setFormData] = useState({
    senderName,
    senderPhone: "",
    senderEmail: "",
    senderLine1: "",
    senderCity: searchParams.get("pickupCity") ?? "",
    senderPostalCode: "",
    senderCountry: "IT",

    receiverName: "",
    receiverPhone: "",
    receiverEmail: "",
    receiverLine1: "",
    receiverCity: searchParams.get("deliveryCity") ?? "",
    receiverPostalCode: "",
    receiverCountry: "US",

    weightKg: Number(searchParams.get("weightKg")) || 1,
    lengthCm: Number(searchParams.get("lengthCm")) || 10,
    widthCm: Number(searchParams.get("widthCm")) || 10,
    heightCm: Number(searchParams.get("heightCm")) || 10,
    declaredValueEur: Number(searchParams.get("declaredValueEur")) || 0,
    goodsDescription: "",
    packageCount: 1,
    customerReference: "",
    customerNotes: "",

    serviceId: serviceFromQuery(searchParams.get("service")),
  });

  const handleSaveDraft = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      // Update the existing draft once one exists rather than creating a
      // new Booking row on every step transition - the wizard previously
      // always POSTed, leaving 2-3 orphaned draft rows behind every time
      // someone stepped through it once.
      const isUpdate = Boolean(bookingId);
      const res = await fetch(isUpdate ? `/api/v1/bookings/${bookingId}` : "/api/v1/bookings", {
        method: isUpdate ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": `bk-draft-${bookingId ?? "new"}-${step}-${Date.now()}`,
          [CSRF_HEADER]: getCsrfToken() ?? "",
        },
        body: JSON.stringify({
          currentStep: BOOKING_STEP_BY_WIZARD_STEP[step] ?? "PACKAGE_DETAILS",
          draftDataJson: formData,
          ...(quoteId ? { quoteId } : {}),
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to save draft (${res.status})`);
      }

      const data = (await res.json()) as { id: string };
      setBookingId(data.id);
      return data.id;
    } catch (err) {
      setErrorMessage(errorMessageOf(err, "Error saving draft"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Only advances once the draft actually saved - the previous fire-and-
  // forget `handleSaveDraft(); setStep(n)` advanced the wizard even when
  // the save failed, silently losing whatever wasn't persisted.
  const handleContinue = async (nextStep: number) => {
    const validationError = validateStep(step, formData, quoteId);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    const saved = await handleSaveDraft();
    if (saved) setStep(nextStep);
  };

  const handleSubmitRequest = async () => {
    if (!bookingId) {
      setErrorMessage("No draft to submit. Please complete the previous steps.");
      return;
    }
    setConfirming(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/v1/bookings/${bookingId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": `shipment-request-submit-${bookingId}`,
          [CSRF_HEADER]: getCsrfToken() ?? "",
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Submission failed (${res.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      setErrorMessage(errorMessageOf(err, "Failed to submit shipment request"));
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Step Indicator */}
      <div className="flex justify-between items-center bg-[#081F3D] text-white p-6 rounded-2xl border border-blue-900 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-white">Create New Express Shipment</h1>
          <p className="text-xs text-slate-300">Italy → USA Air Freight Booking Portal</p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s
                  ? "bg-[#F28C18] text-[#081F3D]"
                  : step > s
                  ? "bg-emerald-500 text-white"
                  : "bg-[#0B2E5E] text-slate-400"
              }`}
            >
              {step > s ? "✓" : s}
            </div>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-800 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* STEP 1: PACKAGE DETAILS */}
      {step === 1 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-[#081F3D] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#F28C18]" /> Step 1: Package Dimensions & Weight
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Goods description</label>
              <textarea required value={formData.goodsDescription} onChange={(e) => setFormData({ ...formData, goodsDescription: e.target.value })} className="w-full bg-[#F3F6FA] border border-slate-200 rounded-xl px-3 py-2.5" rows={3} placeholder="Describe the goods being shipped" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Actual Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#F3F6FA] border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-[#081F3D]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Declared Goods Value (€ EUR)</label>
              <input
                type="number"
                value={formData.declaredValueEur}
                onChange={(e) => setFormData({ ...formData, declaredValueEur: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#F3F6FA] border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-[#081F3D]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Dimensions (L × W × H cm)</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="L"
                  value={formData.lengthCm}
                  onChange={(e) => setFormData({ ...formData, lengthCm: parseFloat(e.target.value) || 0 })}
                  className="bg-[#F3F6FA] border border-slate-200 rounded-xl px-3 py-2 font-bold text-[#081F3D]"
                />
                <input
                  type="number"
                  placeholder="W"
                  value={formData.widthCm}
                  onChange={(e) => setFormData({ ...formData, widthCm: parseFloat(e.target.value) || 0 })}
                  className="bg-[#F3F6FA] border border-slate-200 rounded-xl px-3 py-2 font-bold text-[#081F3D]"
                />
                <input
                  type="number"
                  placeholder="H"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: parseFloat(e.target.value) || 0 })}
                  className="bg-[#F3F6FA] border border-slate-200 rounded-xl px-3 py-2 font-bold text-[#081F3D]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => void handleContinue(2)}
              disabled={loading}
              className="bg-[#F28C18] text-[#081F3D] font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue to Addresses"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ADDRESSES */}
      {step === 2 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-[#081F3D] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F28C18]" /> Step 2: Origin & Destination Addresses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Sender */}
            <div className="space-y-3 bg-[#F3F6FA] p-5 rounded-xl border border-slate-200">
              <h3 className="font-extrabold text-[#081F3D]">Shipper (Italy)</h3>
              <input
                type="text"
                placeholder="Company/Name"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
              />
              <input type="tel" placeholder="Phone" value={formData.senderPhone} onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold" />
              <input type="email" placeholder="Email (optional)" value={formData.senderEmail} onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold" />
              <input
                type="text"
                placeholder="Street Line 1"
                value={formData.senderLine1}
                onChange={(e) => setFormData({ ...formData, senderLine1: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.senderCity}
                  onChange={(e) => setFormData({ ...formData, senderCity: e.target.value })}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={formData.senderPostalCode}
                  onChange={(e) => setFormData({ ...formData, senderPostalCode: e.target.value })}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>
            </div>

            {/* Receiver */}
            <div className="space-y-3 bg-[#F3F6FA] p-5 rounded-xl border border-slate-200">
              <h3 className="font-extrabold text-[#081F3D]">Recipient (USA)</h3>
              <input
                type="text"
                placeholder="Company/Name"
                value={formData.receiverName}
                onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
              />
              <input type="tel" placeholder="Phone" value={formData.receiverPhone} onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold" />
              <input type="email" placeholder="Email (optional)" value={formData.receiverEmail} onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold" />
              <input
                type="text"
                placeholder="Street Line 1"
                value={formData.receiverLine1}
                onChange={(e) => setFormData({ ...formData, receiverLine1: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.receiverCity}
                  onChange={(e) => setFormData({ ...formData, receiverCity: e.target.value })}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.receiverPostalCode}
                  onChange={(e) => setFormData({ ...formData, receiverPostalCode: e.target.value })}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => void handleContinue(3)}
              disabled={loading}
              className="bg-[#F28C18] text-[#081F3D] font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Select Service Level"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SERVICE SELECTION */}
      {step === 3 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-[#081F3D] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F28C18]" /> Step 3: Service Selection & Add-ons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div
              onClick={() => setFormData({ ...formData, serviceId: "AIR_EXPRESS" })}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                formData.serviceId === "AIR_EXPRESS"
                  ? "border-[#F28C18] bg-amber-50/50 shadow-md"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="font-extrabold text-base text-[#081F3D]">Air Express</h3>
              <p className="text-slate-500 my-2">24 - 48h Transit Time</p>
              <span className="text-sm font-bold text-[#081F3D]">{formData.serviceId === "AIR_EXPRESS" && quotedTotal !== null && Number.isFinite(quotedTotal) ? `Quoted total: €${quotedTotal.toFixed(2)}` : "Generate a quote first"}</span>
            </div>

            <div
              onClick={() => setFormData({ ...formData, serviceId: "AIR_ECONOMY" })}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                formData.serviceId === "AIR_ECONOMY"
                  ? "border-[#F28C18] bg-amber-50/50 shadow-md"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="font-extrabold text-base text-[#081F3D]">Air Economy</h3>
              <p className="text-slate-500 my-2">3 - 5 Business Days</p>
              <span className="text-sm font-bold text-[#081F3D]">{formData.serviceId === "AIR_ECONOMY" && quotedTotal !== null && Number.isFinite(quotedTotal) ? `Quoted total: €${quotedTotal.toFixed(2)}` : "Generate a quote first"}</span>
            </div>

            <div
              onClick={() => setFormData({ ...formData, serviceId: "OCEAN_FREIGHT" })}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                formData.serviceId === "OCEAN_FREIGHT"
                  ? "border-[#F28C18] bg-amber-50/50 shadow-md"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="font-extrabold text-base text-[#081F3D]">Ocean Freight</h3>
              <p className="text-slate-500 my-2">12 - 16 Days Container</p>
              <span className="text-sm font-bold text-[#081F3D]">{formData.serviceId === "OCEAN_FREIGHT" && quotedTotal !== null && Number.isFinite(quotedTotal) ? `Quoted total: €${quotedTotal.toFixed(2)}` : "Generate a quote first"}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => void handleContinue(4)}
              disabled={loading}
              className="bg-[#F28C18] text-[#081F3D] font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Review Request"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW AND SUBMIT */}
      {step === 4 && !submitted && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-[#081F3D] flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[#F28C18]" /> Step 4: Review Shipment Request
          </h2>
          <div className="bg-[#F3F6FA] p-5 rounded-2xl border border-slate-200 text-sm space-y-3">
            <p><strong>Goods:</strong> {formData.goodsDescription || "Not provided"}</p>
            <p><strong>Route:</strong> {formData.senderCity}, {formData.senderCountry} → {formData.receiverCity}, {formData.receiverCountry}</p>
            <p><strong>Package:</strong> {formData.weightKg} kg · {formData.lengthCm} × {formData.widthCm} × {formData.heightCm} cm</p>
            <p><strong>Preferred service:</strong> {formData.serviceId.replace(/_/g, " ")}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>An operations administrator will review this request. A tracking number is issued only after approval.</span>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => void handleSubmitRequest()}
              disabled={confirming}
              className="font-black px-8 py-3.5 rounded-xl text-xs flex items-center gap-2 transition-all bg-[#F28C18] text-[#081F3D] hover:bg-[#e07a12] hover:text-white disabled:opacity-50"
            >
              {confirming ? "Submitting…" : "Submit for Review"}
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="bg-white p-10 rounded-2xl border border-green-200 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-[#081F3D]">Request Submitted</h2>
          <p className="text-slate-600 text-sm">Your request is awaiting operations review. After approval, your invoice and tracking number will appear in your dashboard. Payment is not collected through the website.</p>
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => router.push("/portal")}
              className="bg-slate-100 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function serviceFromQuery(value: string | null): "AIR_EXPRESS" | "AIR_ECONOMY" | "OCEAN_FREIGHT" {
  if (value === "air-economy") return "AIR_ECONOMY";
  if (value === "ocean-freight") return "OCEAN_FREIGHT";
  return "AIR_EXPRESS";
}

function validateStep(step: number, data: Record<string, string | number>, quoteId?: string): string | null {
  if (step === 1) {
    if (!String(data.goodsDescription).trim()) return "Describe the goods before continuing.";
    if ([data.weightKg, data.lengthCm, data.widthCm, data.heightCm].some((value) => Number(value) <= 0)) return "Weight and all dimensions must be greater than zero.";
    if (Number(data.declaredValueEur) <= 0) return "Declared goods value must be greater than zero.";
  }
  if (step === 2) {
    const required = [data.senderName, data.senderPhone, data.senderLine1, data.senderCity, data.senderPostalCode, data.receiverName, data.receiverPhone, data.receiverLine1, data.receiverCity, data.receiverPostalCode];
    if (required.some((value) => !String(value).trim())) return "Complete all required shipper and recipient address fields.";
    const optionalEmails = [data.senderEmail, data.receiverEmail].filter((value) => String(value).trim());
    if (optionalEmails.some((value) => !/^\S+@\S+\.\S+$/.test(String(value)))) return "Enter valid email addresses or leave the optional email fields blank.";
  }
  if (step === 3 && !quoteId) return "Generate and select a quote before reviewing this request.";
  return null;
}

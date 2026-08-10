"use client";

import { useState } from "react";
import {
  Package, MapPin, CreditCard,
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
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state - starts blank/zeroed rather than pre-filled with fake
  // company data (was "Acme Italy S.r.l." / "Acme USA Inc." etc.); only
  // senderName defaults, from the real signed-in profile.
  const [formData, setFormData] = useState({
    senderName,
    senderLine1: "",
    senderCity: "",
    senderPostalCode: "",
    senderCountry: "IT",

    receiverName: "",
    receiverLine1: "",
    receiverCity: "",
    receiverPostalCode: "",
    receiverCountry: "US",

    weightKg: 1,
    lengthCm: 10,
    widthCm: 10,
    heightCm: 10,
    declaredValueEur: 0,

    serviceId: "AIR_EXPRESS",
    addCustomsClearance: true,
    addInsurance: false,

    paymentMethod: "CARD",
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
          ...(isUpdate ? {} : { "Idempotency-Key": `bk-draft-${Date.now()}` }),
          [CSRF_HEADER]: getCsrfToken() ?? "",
        },
        body: JSON.stringify({
          currentStep: BOOKING_STEP_BY_WIZARD_STEP[step] ?? "PACKAGE_DETAILS",
          draftDataJson: formData,
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
    const saved = await handleSaveDraft();
    if (saved) setStep(nextStep);
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
              <span className="text-lg font-black text-[#081F3D]">€65.00</span>
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
              <span className="text-lg font-black text-[#081F3D]">€42.50</span>
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
              <span className="text-lg font-black text-[#081F3D]">€24.00</span>
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
              {loading ? "Saving..." : "Proceed to Payment"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PAYMENT & CONFIRM */}
      {step === 4 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-[#081F3D] flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#F28C18]" /> Step 4: Checkout & Payment
          </h2>

          <div className="bg-[#F3F6FA] p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between font-bold text-[#081F3D]">
              <span>Selected Service ({formData.serviceId}):</span>
              <span>€65.00</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Customs Formalities (US CBP Entry):</span>
              <span>€18.50</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-[#081F3D]">
              <span>Total Due:</span>
              <span className="text-[#F28C18]">€83.50 EUR</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="font-bold text-slate-700 block">Select Payment Provider</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 border border-slate-200 p-3 rounded-xl cursor-pointer bg-white">
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === "CARD"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "CARD" })}
                />
                <span className="font-bold text-[#081F3D]">Stripe Credit Card / Debit</span>
              </label>
            </div>
          </div>

          {/* Real Stripe payment integration isn't wired up in this
              environment - the API correctly rejects a booking confirmation
              without genuine provider-confirmed payment (never infers
              payment success from the browser alone), so this can't be
              faked here either. Disclosed rather than left as a confusing
              400 error behind a button that looks like it should work. */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Real payment processing isn&apos;t connected in this environment yet, so bookings can&apos;t be
              confirmed end-to-end from here. Your addresses and package details above are saved as a draft you
              can resume once payment is available.
            </span>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              disabled
              title="Real payment processing isn't connected in this environment yet"
              className="bg-slate-300 text-slate-500 font-black px-8 py-3.5 rounded-xl text-xs flex items-center gap-2 cursor-not-allowed"
            >
              Confirm &amp; Pay €83.50
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

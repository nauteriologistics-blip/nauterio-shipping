"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Truck, MapPin, CheckCircle2, Phone, PenTool } from "lucide-react";

export default function DriverPWA() {
  const t = useTranslations("DriverPage");
  const [activeTask, setActiveTask] = useState<"pickup" | "delivery">("delivery");
  const [signedName, setSignedName] = useState<string>("John Smith");
  const [deliveredSuccess, setDeliveredSuccess] = useState<boolean>(false);

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    setDeliveredSuccess(true);
    setTimeout(() => {
      setDeliveredSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

      {/* PWA Mobile Header */}
      <div className="bg-[#081F3D] text-white p-5 rounded-2xl border border-blue-900 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2E5E] flex items-center justify-center text-[#F28C18]">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">{t("headerTitle")}</h1>
            <p className="text-[11px] text-slate-300">{t("headerSubtitle")}</p>
          </div>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-1 rounded border border-emerald-500/40">
          {t("gpsLive")}
        </span>
      </div>

      {/* Task Toggle */}
      <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-xl border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTask("pickup")}
          className={`py-2.5 rounded-lg transition-colors ${
            activeTask === "pickup" ? "bg-[#081F3D] text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t("pickupTab")}
        </button>
        <button
          onClick={() => setActiveTask("delivery")}
          className={`py-2.5 rounded-lg transition-colors ${
            activeTask === "delivery" ? "bg-[#081F3D] text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t("deliveryTab")}
        </button>
      </div>

      {/* DELIVERY TASK DETAILS */}
      {activeTask === "delivery" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-mono font-black text-[#081F3D]">NT-782914-US</span>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {t("outForDelivery")}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#F28C18] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#081F3D] block text-sm">{t("addressLine1")}</span>
                <span className="text-slate-500">{t("addressLine2")}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a href="tel:+12125550199" className="bg-[#F3F6FA] text-[#081F3D] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 border border-slate-200">
                <Phone className="w-3.5 h-3.5 text-[#0B2E5E]" /> {t("callRecipient")}
              </a>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">{t("contactLabel")}</span>
            </div>
          </div>

          {/* Signature Capture Canvas Simulator */}
          <form onSubmit={handleConfirmDelivery} className="space-y-4 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-extrabold text-[#081F3D] flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-[#F28C18]" /> {t("signatureHeading")}
            </h3>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">{t("recipientNameLabel")}</label>
              <input
                type="text"
                value={signedName}
                onChange={(e) => setSignedName(e.target.value)}
                className="w-full bg-[#F3F6FA] text-xs font-bold text-[#081F3D] rounded-xl px-3 py-2 border border-slate-200"
              />
            </div>

            {/* Signature Box */}
            <div className="border-2 border-slate-300 rounded-xl bg-slate-50 p-6 text-center space-y-1 relative">
              <span className="text-slate-400 text-xs font-serif italic block select-none">
                {signedName || t("signPrompt")}
              </span>
              <span className="text-[10px] text-slate-400 block">{t("signInsideBox")}</span>
            </div>

            {deliveredSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {t("deliveredSuccess")}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#F28C18] hover:bg-[#D97706] text-[#081F3D] font-black py-3.5 px-4 rounded-xl transition-colors text-sm shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> {t("confirmDelivery")}
            </button>
          </form>
        </div>
      )}

      {/* PICKUP TASK LIST */}
      {activeTask === "pickup" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4 text-xs">
          <h3 className="font-extrabold text-[#081F3D] text-sm">{t("todaysPickupsHeading")}</h3>

          <div className="p-3 bg-[#F3F6FA] rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between font-bold text-[#081F3D]">
              <span>{t("pickup1Address")}</span>
              <span className="text-[#F28C18]">10:00 - 12:00</span>
            </div>
            <p className="text-slate-500">{t("pickup1Detail")}</p>
          </div>

          <div className="p-3 bg-[#F3F6FA] rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between font-bold text-[#081F3D]">
              <span>{t("pickup2Address")}</span>
              <span className="text-[#F28C18]">14:00 - 16:00</span>
            </div>
            <p className="text-slate-500">{t("pickup2Detail")}</p>
          </div>
        </div>
      )}

    </div>
  );
}

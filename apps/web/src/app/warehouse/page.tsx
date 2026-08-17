"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { QrCode, Scale, Package, Printer, CheckCircle2, Barcode, AlertCircle, Loader2 } from "lucide-react";
import { getCsrfToken } from "@/lib/auth";
import { CSRF_HEADER } from "@/lib/session";

interface Warehouse {
  id: string;
  name: string;
  code: string;
  city: string;
  countryCode: string;
}

interface IntakeResult {
  trackingNumber: string;
  status: string;
}

export default function WarehousePWA() {
  const t = useTranslations("WarehousePage");
  const [scannedId, setScannedId] = useState<string>("");
  const [measuredWeight, setMeasuredWeight] = useState<number>(0);
  const [measuredL, setMeasuredL] = useState<number>(0);
  const [measuredW, setMeasuredW] = useState<number>(0);
  const [measuredH, setMeasuredH] = useState<number>(0);

  const [scanSuccess, setScanSuccess] = useState<IntakeResult | null>(null);
  const [uldContainer, setUldContainer] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch warehouses on mount
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await fetch("/api/v1/admin/warehouses");
        if (res.ok) {
          const data = (await res.json()) as Warehouse[];
          setWarehouses(data);
          if (data.length > 0) setSelectedWarehouse(data[0].id);
        }
      } catch {
        // Warehouses may not be available if user isn't admin
      } finally {
        setLoadingWarehouses(false);
      }
    };
    fetchWarehouses();
  }, []);

  const handleProcessIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedId.trim()) {
      setError("Please enter a tracking number to process.");
      return;
    }
    setProcessing(true);
    setError(null);
    setScanSuccess(null);

    try {
      const trackingNumber = scannedId.trim().toUpperCase();
      const intakeRes = await fetch("/api/v1/admin/warehouses/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": `warehouse-intake-${trackingNumber}-${Date.now()}`,
          [CSRF_HEADER]: getCsrfToken() ?? "",
        },
        body: JSON.stringify({
          trackingNumber,
          warehouseId: selectedWarehouse,
          measuredWeight,
          measuredL,
          measuredW,
          measuredH,
          uldContainer,
        }),
      });
      if (!intakeRes.ok) {
        const body = await intakeRes.json().catch(() => null);
        throw new Error(body?.message || `Intake could not be recorded (${intakeRes.status})`);
      }

      setScanSuccess({
        trackingNumber,
        status: "RECEIVED_AT_WAREHOUSE",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process intake");
    } finally {
      setProcessing(false);
    }
  };

  const calculatedVol = parseFloat(((measuredL * measuredW * measuredH) / 5000).toFixed(2));
  const billableWeight = Math.max(measuredWeight, calculatedVol);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

      {/* PWA Mobile Header */}
      <div className="bg-[#081F3D] text-white p-5 rounded-2xl border border-blue-900 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2E5E] flex items-center justify-center text-[#F28C18]">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">{t("headerTitle")}</h1>
            <p className="text-[11px] text-slate-300">{t("headerSubtitle")}</p>
          </div>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-1 rounded border border-emerald-500/40">
          {t("scaleOnline")}
        </span>
      </div>

      {/* Warehouse Selection */}
      {!loadingWarehouses && warehouses.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <label className="text-xs font-bold text-[#081F3D] block mb-2">Active Facility</label>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="w-full bg-[#F3F6FA] font-mono text-xs font-bold rounded-xl px-3 py-2.5 border border-slate-200"
          >
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name} ({wh.code}) — {wh.city}, {wh.countryCode}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Barcode Scanner Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
        <h2 className="text-sm font-extrabold text-[#081F3D] flex items-center gap-2">
          <Barcode className="w-5 h-5 text-[#F28C18]" /> {t("scanHeading")}
        </h2>

        <div className="border-2 border-dashed border-[#0B2E5E] bg-[#F3F6FA] p-6 rounded-xl text-center space-y-2">
          <QrCode className="w-12 h-12 text-[#081F3D] mx-auto animate-pulse" />
          <span className="text-xs font-bold text-[#081F3D] block">{t("cameraActive")}</span>
          <span className="text-[10px] text-slate-500 block">{t("positionBarcode")}</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">{t("manualEntryLabel")}</label>
          <input
            type="text"
            value={scannedId}
            onChange={(e) => setScannedId(e.target.value)}
            placeholder="e.g. NT-A1B2C3D4"
            className="w-full bg-[#F3F6FA] font-mono font-bold text-[#081F3D] text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Scale & Measure Verification Form */}
      <form onSubmit={(e) => void handleProcessIntake(e)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
        <h2 className="text-sm font-extrabold text-[#081F3D] flex items-center gap-2 border-b border-slate-100 pb-3">
          <Scale className="w-5 h-5 text-[#F28C18]" /> {t("calibrationHeading")}
        </h2>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#081F3D]">{t("scaleWeightLabel")}</label>
          <input
            type="number"
            step="0.01"
            value={measuredWeight || ""}
            onChange={(e) => setMeasuredWeight(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full bg-[#F3F6FA] font-mono text-lg font-black text-[#081F3D] rounded-xl px-4 py-3 border border-slate-200 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block mb-1">{t("lengthLabel")}</span>
            <input
              type="number"
              value={measuredL || ""}
              onChange={(e) => setMeasuredL(parseFloat(e.target.value) || 0)}
              placeholder="cm"
              className="w-full bg-[#F3F6FA] font-mono font-bold rounded-lg p-2 border border-slate-200 text-center"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block mb-1">{t("widthLabel")}</span>
            <input
              type="number"
              value={measuredW || ""}
              onChange={(e) => setMeasuredW(parseFloat(e.target.value) || 0)}
              placeholder="cm"
              className="w-full bg-[#F3F6FA] font-mono font-bold rounded-lg p-2 border border-slate-200 text-center"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block mb-1">{t("heightLabel")}</span>
            <input
              type="number"
              value={measuredH || ""}
              onChange={(e) => setMeasuredH(parseFloat(e.target.value) || 0)}
              placeholder="cm"
              className="w-full bg-[#F3F6FA] font-mono font-bold rounded-lg p-2 border border-slate-200 text-center"
            />
          </div>
        </div>

        {(measuredWeight > 0 || calculatedVol > 0) && (
          <div className="bg-[#081F3D] text-white p-3.5 rounded-xl space-y-1 text-xs border border-blue-900 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-300">{t("volumetricWeightLabel")}</span>
              <span>{calculatedVol} kg</span>
            </div>
            <div className="flex justify-between font-bold text-[#F28C18]">
              <span>{t("billableWeightLabel")}</span>
              <span>{billableWeight} kg</span>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#081F3D]">{t("assignUldLabel")}</label>
          <input
            type="text"
            value={uldContainer}
            onChange={(e) => setUldContainer(e.target.value)}
            placeholder="e.g. ULD-MXP-AZ604-09"
            className="w-full bg-[#F3F6FA] font-mono text-xs font-bold rounded-xl px-3 py-2 border border-slate-200"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            {error}
          </div>
        )}

        {scanSuccess && (
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {t("intakeVerified")} — {scanSuccess.trackingNumber} ({scanSuccess.status})
          </div>
        )}

        <button
          type="submit"
          disabled={processing}
          className="w-full bg-[#F28C18] hover:bg-[#D97706] text-[#081F3D] font-black py-3.5 px-4 rounded-xl transition-colors text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {processing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
          ) : (
            <><Printer className="w-4 h-4" /> {t("verifyAndPrint")}</>
          )}
        </button>
      </form>

    </div>
  );
}

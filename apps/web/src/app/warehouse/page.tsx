"use client";

import React, { useState } from "react";
import { QrCode, Scale, Package, Printer, CheckCircle2, Barcode } from "lucide-react";

export default function WarehousePWA() {
  const [scannedId, setScannedId] = useState<string>("NT-782914-US");
  const [measuredWeight, setMeasuredWeight] = useState<number>(3.25);
  const [measuredL, setMeasuredL] = useState<number>(32);
  const [measuredW, setMeasuredW] = useState<number>(22);
  const [measuredH, setMeasuredH] = useState<number>(16);

  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [uldContainer, setUldContainer] = useState<string>("ULD-MXP-AZ604-09");

  const handleProcessIntake = (e: React.FormEvent) => {
    e.preventDefault();
    setScanSuccess(true);
    setTimeout(() => setScanSuccess(false), 2500);
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
            <h1 className="text-lg font-black text-white">Warehouse Intake PWA</h1>
            <p className="text-[11px] text-slate-300">Nauterio Hub Milan (Lombardy, IT)</p>
          </div>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-1 rounded border border-emerald-500/40">
          Scale #04 Online
        </span>
      </div>

      {/* Barcode Scanner Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
        <h2 className="text-sm font-extrabold text-[#081F3D] flex items-center gap-2">
          <Barcode className="w-5 h-5 text-[#F28C18]" /> Scan Package Barcode / QR Code
        </h2>

        <div className="border-2 border-dashed border-[#0B2E5E] bg-[#F3F6FA] p-6 rounded-xl text-center space-y-2">
          <QrCode className="w-12 h-12 text-[#081F3D] mx-auto animate-pulse" />
          <span className="text-xs font-bold text-[#081F3D] block">Camera Scanner Active</span>
          <span className="text-[10px] text-slate-500 block">Position barcode inside camera frame</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Manual Barcode Entry</label>
          <input
            type="text"
            value={scannedId}
            onChange={(e) => setScannedId(e.target.value)}
            className="w-full bg-[#F3F6FA] font-mono font-bold text-[#081F3D] text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Scale & Measure Verification Form */}
      <form onSubmit={handleProcessIntake} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
        <h2 className="text-sm font-extrabold text-[#081F3D] flex items-center gap-2 border-b border-slate-100 pb-3">
          <Scale className="w-5 h-5 text-[#F28C18]" /> Intake Scale & Dimension Calibration
        </h2>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#081F3D]">Actual Digital Scale Weight (kg)</label>
          <input
            type="number"
            step="0.01"
            value={measuredWeight}
            onChange={(e) => setMeasuredWeight(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#F3F6FA] font-mono text-lg font-black text-[#081F3D] rounded-xl px-4 py-3 border border-slate-200 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block mb-1">Length (cm)</span>
            <input
              type="number"
              value={measuredL}
              onChange={(e) => setMeasuredL(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#F3F6FA] font-mono font-bold rounded-lg p-2 border border-slate-200 text-center"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block mb-1">Width (cm)</span>
            <input
              type="number"
              value={measuredW}
              onChange={(e) => setMeasuredW(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#F3F6FA] font-mono font-bold rounded-lg p-2 border border-slate-200 text-center"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block mb-1">Height (cm)</span>
            <input
              type="number"
              value={measuredH}
              onChange={(e) => setMeasuredH(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#F3F6FA] font-mono font-bold rounded-lg p-2 border border-slate-200 text-center"
            />
          </div>
        </div>

        <div className="bg-[#081F3D] text-white p-3.5 rounded-xl space-y-1 text-xs border border-blue-900 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-300">Volumetric Weight:</span>
            <span>{calculatedVol} kg</span>
          </div>
          <div className="flex justify-between font-bold text-[#F28C18]">
            <span>Audited Billable Weight:</span>
            <span>{billableWeight} kg</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#081F3D]">Assign to Flight ULD Container</label>
          <input
            type="text"
            value={uldContainer}
            onChange={(e) => setUldContainer(e.target.value)}
            className="w-full bg-[#F3F6FA] font-mono text-xs font-bold rounded-xl px-3 py-2 border border-slate-200"
          />
        </div>

        {scanSuccess && (
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Intake Verified & Thermal Barcode Printed!
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#F28C18] hover:bg-[#D97706] text-[#081F3D] font-black py-3.5 px-4 rounded-xl transition-colors text-sm shadow-md flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" /> Verify Intake & Print Label
        </button>
      </form>

    </div>
  );
}

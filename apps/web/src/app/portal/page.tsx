"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User, Package, FileText, Upload, Plus,
  CheckCircle2, AlertTriangle, ArrowRight
} from "lucide-react";

export default function CustomerPortal() {
  const [activeTab, setActiveTab] = useState<"shipments" | "quotes" | "documents" | "payments" | "support">("shipments");
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const activeShipments = [
    {
      id: "NT-782914-US",
      service: "Air Express Courier",
      origin: "Milan (IT)",
      dest: "New York (US)",
      status: "In Transit",
      statusBadge: "bg-[#F28C18] text-[#081F3D]",
      eta: "7 Aug 2026",
      action: "Track Flight AZ604"
    },
    {
      id: "NT-902148-US",
      service: "Air Economy Freight",
      origin: "Florence (IT)",
      dest: "Chicago (US)",
      status: "Action Required",
      statusBadge: "bg-amber-500 text-white animate-pulse",
      eta: "8 Aug 2026",
      action: "Upload Food/Wine Invoice"
    }
  ];

  const quotes = [
    { id: "QT-88210-IT", route: "Rome to Miami", weight: "12 kg", total: "€108.40", date: "5 Aug 2026", status: "Valid (Expires 12 Aug)" }
  ];

  const documents = [
    { name: "Commercial_Invoice_NT-782914.pdf", size: "245 KB", type: "Invoice", date: "5 Aug 2026", status: "Verified" },
    { name: "Packing_List_NT-782914.pdf", size: "120 KB", type: "Packing List", date: "5 Aug 2026", status: "Verified" }
  ];

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadModal(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Customer Header Bar */}
      <div className="bg-[#081F3D] text-white p-6 sm:p-8 rounded-2xl border border-blue-900 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B2E5E] border border-blue-400/30 flex items-center justify-center text-white text-xl font-bold">
            <User className="w-7 h-7 text-[#F28C18]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Marco Rossi</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                Verified Customer
              </span>
            </div>
            <p className="text-xs text-slate-300">Account ID: CUST-90182 | milano.exports@rossi-style.it</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/quote"
            className="bg-[#F28C18] hover:bg-[#D97706] text-[#081F3D] font-extrabold px-5 py-2.5 rounded-xl transition-colors text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Book New Shipment
          </Link>
        </div>
      </div>

      {/* Action Required Alert Banner (Spec 10.1 Order) */}
      <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-xl flex items-center justify-between gap-4 text-amber-950 text-xs">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span><strong>Action Required:</strong> Shipment <code>NT-902148-US</code> requires FDA Prior Notice invoice submission.</span>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg text-xs shrink-0"
        >
          Upload Document
        </button>
      </div>

      {/* Portal Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab("shipments")}
          className={`pb-3 px-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "shipments"
              ? "border-b-2 border-[#F28C18] text-[#081F3D] font-black"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Package className="w-4 h-4" /> Active Shipments ({activeShipments.length})
        </button>
        <button
          onClick={() => setActiveTab("quotes")}
          className={`pb-3 px-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "quotes"
              ? "border-b-2 border-[#F28C18] text-[#081F3D] font-black"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" /> Saved Quotes ({quotes.length})
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`pb-3 px-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "documents"
              ? "border-b-2 border-[#F28C18] text-[#081F3D] font-black"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Upload className="w-4 h-4" /> Customs Documents ({documents.length})
        </button>
      </div>

      {/* TAB CONTENT: SHIPMENTS */}
      {activeTab === "shipments" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          <div className="p-4 bg-[#F3F6FA] font-extrabold text-xs text-[#081F3D] flex justify-between items-center">
            <span>Shipment Records</span>
            <span className="text-slate-500">2 total orders</span>
          </div>

          {activeShipments.map((s) => (
            <div key={s.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-base text-[#081F3D]">{s.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${s.statusBadge}`}>
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{s.service} • {s.origin} → {s.dest}</p>
                <p className="text-[11px] text-slate-400">Estimated Arrival: {s.eta}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/tracking?id=${s.id}`}
                  className="bg-[#081F3D] hover:bg-[#0B2E5E] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  {s.action} <ArrowRight className="w-3.5 h-3.5 text-[#F28C18]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: DOCUMENTS */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#081F3D] text-sm">Stored Customs & Shipping Files</h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-[#F28C18] text-[#081F3D] font-extrabold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" /> Upload File
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {documents.map((d, idx) => (
              <div key={idx} className="p-3 bg-[#F3F6FA] rounded-xl flex items-center justify-between border border-slate-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#0B2E5E]" />
                  <div>
                    <p className="font-bold text-[#081F3D]">{d.name}</p>
                    <p className="text-[10px] text-slate-500">{d.type} • {d.size} • Uploaded {d.date}</p>
                  </div>
                </div>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal Simulator */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-black text-[#081F3D]">Upload Customs Document</h3>
            <p className="text-xs text-slate-600">Select PDF or JPG commercial invoice for US CBP / FDA clearance.</p>

            <form onSubmit={handleSimulateUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 p-8 rounded-xl text-center bg-[#F3F6FA] cursor-pointer hover:border-[#F28C18]">
                <Upload className="w-8 h-8 text-[#0B2E5E] mx-auto mb-2" />
                <span className="text-xs font-bold text-[#081F3D] block">Drop Commercial Invoice PDF here</span>
                <span className="text-[10px] text-slate-400 block mt-1">Maximum file size 10MB</span>
              </div>

              {uploadSuccess && (
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Document uploaded and transmitted to CBP!
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F28C18] text-[#081F3D] font-extrabold rounded-xl text-xs"
                >
                  Submit File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

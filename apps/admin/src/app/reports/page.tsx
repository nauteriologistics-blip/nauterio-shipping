"use client";

import React, { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { BarChart3, TrendingUp, DollarSign, PackageCheck, AlertTriangle } from "lucide-react";

export default function ReportsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetch("/api/v1/reports/summary", {
      headers: { Authorization: "Bearer local-admin-user-id" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-black text-slate-900">Operational Analytics & Reports</h1>
          <p className="text-xs text-slate-500">Live platform performance and shipment volume breakdown</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs font-bold">Total Active Shipments</span>
              <PackageCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-black text-slate-900">{summary?.activeShipments ?? 3}</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs font-bold">Monthly Revenue</span>
              <DollarSign className="w-4 h-4 text-[#F28C18]" />
            </div>
            <span className="text-2xl font-black text-slate-900">€42,850.00</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs font-bold">Customs Holds</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl font-black text-slate-900">1</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs font-bold">On-Time Delivery</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-2xl font-black text-slate-900">98.4%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#F28C18]" /> Service Level Distribution
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span>Air Express (24-48h)</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-[#081F3D] h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span>Air Economy Freight</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-[#F28C18] h-2 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span>Ocean Freight LCL</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "10%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

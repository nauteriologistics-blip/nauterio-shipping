"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Sliders, Eye } from "lucide-react";

export default function AdminPage() {
  const [activeQueue, setActiveQueue] = useState<"all" | "customs_hold" | "in_transit" | "delivered">("all");
  const [searchFilter, setSearchFilter] = useState("");

  const shipments = [
    { id: "NT-782914-US", customer: "Marco Rossi", route: "Milan (MXP) → New York (JFK)", weight: "3.20 kg", status: "In Transit", queue: "in_transit", time: "17:45 CET", priority: "Normal" },
    { id: "NT-902148-US", customer: "Chiara Bianchi", route: "Florence → Chicago (ORD)", weight: "14.50 kg", status: "Customs Hold", queue: "customs_hold", time: "15:30 EST", priority: "High (FDA Invoice)" },
    { id: "NT-112349-US", customer: "Giuseppe Verdi", route: "Venice → Los Angeles (LAX)", weight: "1.80 kg", status: "Delivered", queue: "delivered", time: "14:12 PST", priority: "Normal" },
    { id: "NT-550192-US", customer: "Ferrari Exporters", route: "Genoa Port → Newark Port", weight: "420.00 kg", status: "In Transit", queue: "in_transit", time: "08:00 CET", priority: "Normal (Ocean Container)" },
  ];

  const filteredShipments = shipments.filter(s => {
    const matchesQueue = activeQueue === "all" || s.queue === activeQueue;
    const matchesSearch = s.id.toLowerCase().includes(searchFilter.toLowerCase()) || s.customer.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesQueue && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Operations Header */}
      <div className="bg-[#081F3D] text-white p-6 sm:p-8 rounded-2xl border border-blue-900 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#F28C18] text-[#081F3D] text-[10px] font-black uppercase px-2 py-0.5 rounded">
              Internal Ops Control
            </span>
            <span className="text-xs font-mono text-slate-300">AWS eu-south-1 (Milan)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Nauterio Logistics Staff Operations Centre</h1>
          <p className="text-xs text-slate-300">Italy-to-US Customs Queues & Transatlantic Air/Ocean Clearance Desk</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-950 text-green-300 text-xs font-bold rounded-xl border border-green-800">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
            US CBP EDI Gateway Active
          </span>
        </div>
      </div>

      {/* Metrics Row (Spec 12 Requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase">Today&apos;s Receipts (IT)</span>
          <p className="text-2xl font-black text-[#081F3D]">142 Packages</p>
          <span className="text-[11px] text-emerald-600 font-semibold">MXP: 84 • FCO: 42 • Genoa: 16</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase">Flights En Route (US)</span>
          <p className="text-2xl font-black text-[#081F3D]">6 Direct Flights</p>
          <span className="text-[11px] text-slate-500">AZ604, IT881, UA902, DL104</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/50 shadow-sm space-y-1">
          <span className="text-amber-900 text-xs font-bold uppercase">Customs Exception Queue</span>
          <p className="text-2xl font-black text-amber-900">3 Holds</p>
          <span className="text-[11px] text-amber-700 font-semibold">2 FDA Notices • 1 Duty Override</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-bold uppercase">US De Minimis Section 321</span>
          <p className="text-2xl font-black text-emerald-700">91.4% Exempt</p>
          <span className="text-[11px] text-slate-500">Under $800 USD threshold</span>
        </div>

      </div>

      {/* Operations Table Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#F28C18]" />
            <h2 className="text-lg font-black text-[#081F3D]">Shipment Queue Management</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setActiveQueue("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeQueue === "all" ? "bg-[#081F3D] text-white" : "bg-[#F3F6FA] text-slate-700"
              }`}
            >
              All (4)
            </button>
            <button
              onClick={() => setActiveQueue("customs_hold")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeQueue === "customs_hold" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-800"
              }`}
            >
              Customs Hold (1)
            </button>
            <button
              onClick={() => setActiveQueue("in_transit")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeQueue === "in_transit" ? "bg-blue-800 text-white" : "bg-[#F3F6FA] text-slate-700"
              }`}
            >
              In Transit (2)
            </button>
          </div>
        </div>

        {/* Filter Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Tracking ID or Shipper Name..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-[#F3F6FA] text-[#081F3D] text-xs font-mono font-medium rounded-xl pl-9 pr-4 py-2 border border-slate-200 focus:outline-none"
          />
        </div>

        {/* Operational Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#081F3D] text-white uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="p-3">Tracking ID</th>
                <th className="p-3">Shipper</th>
                <th className="p-3">Route Corridor</th>
                <th className="p-3">Billable Weight</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredShipments.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-black text-[#081F3D]">{s.id}</td>
                  <td className="p-3 text-slate-800">{s.customer}</td>
                  <td className="p-3 text-slate-600">{s.route}</td>
                  <td className="p-3 font-mono">{s.weight}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                      s.status === "Customs Hold"
                        ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                        : s.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-blue-100 text-blue-900"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      href={`/tracking?id=${s.id}`}
                      className="inline-flex items-center gap-1 bg-[#F3F6FA] hover:bg-slate-200 text-[#081F3D] font-bold px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

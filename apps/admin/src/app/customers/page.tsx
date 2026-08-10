"use client";

import React, { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { Users, Building2, Search, CheckCircle2 } from "lucide-react";

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulated fetching accounts
    setTimeout(() => {
      setCustomers([
        {
          id: "00000000-0000-7000-8000-000000000100",
          fullName: "Dev Customer",
          email: "customer@example.com",
          organisation: "Acme Logistics S.r.l.",
          status: "ACTIVE",
          shipmentsCount: 3,
        },
        {
          id: "00000000-0000-7000-8000-000000000101",
          fullName: "Marco Rossi",
          email: "milano.exports@rossi-style.it",
          organisation: "Rossi Style S.p.A.",
          status: "ACTIVE",
          shipmentsCount: 12,
        },
      ]);
      setLoading(false);
    }, 300);
  }, []);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-slate-900">Customer & Organisation Accounts</h1>
            <p className="text-xs text-slate-500">Manage registered shippers and corporate accounts</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          <div className="p-4 bg-[#F3F6FA] flex justify-between items-center text-xs font-bold text-[#081F3D]">
            <span>Registered Accounts</span>
            <span>{customers.length} total</span>
          </div>

          {customers.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#081F3D] text-white flex items-center justify-center font-bold">
                  <Users className="w-4 h-4 text-[#F28C18]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{c.fullName}</h3>
                  <p className="text-slate-500">{c.email} • {c.organisation}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-slate-600 font-semibold">{c.shipmentsCount} Shipments</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

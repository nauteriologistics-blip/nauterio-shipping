"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";
import { Users, CheckCircle2 } from "lucide-react";

interface AdminCustomer {
  id: string;
  fullName: string;
  email: string;
  status: string;
  createdAt: string;
  organisationName: string | null;
  shipmentsCount: number;
}

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<AdminCustomer[]>("/admin/customers")
      .then(setCustomers)
      .catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 403) {
          setError("Your role does not have permission to view customer accounts.");
        } else if (e instanceof ApiError) {
          setError(e.body.message);
        } else {
          setError("Could not load customer accounts.");
        }
      })
      .finally(() => setLoading(false));
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

        {loading && (
          <p className="text-sm text-slate-500" role="status">
            Loading customer accounts...
          </p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 max-w-md" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            <div className="p-4 bg-[#F3F6FA] flex justify-between items-center text-xs font-bold text-[#081F3D]">
              <span>Registered Accounts</span>
              <span>{customers.length} total</span>
            </div>

            {customers.length === 0 && (
              <div className="p-6 text-sm text-slate-500 text-center">No customer accounts yet.</div>
            )}

            {customers.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#081F3D] text-white flex items-center justify-center font-bold">
                    <Users className="w-4 h-4 text-[#F28C18]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{c.fullName}</h3>
                    <p className="text-slate-500">
                      {c.email}
                      {c.organisationName ? ` • ${c.organisationName}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-semibold">{c.shipmentsCount} Shipments</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      c.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" /> {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}

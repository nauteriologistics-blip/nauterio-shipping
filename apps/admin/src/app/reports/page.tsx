"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";
import { BarChart3, PackageCheck, AlertTriangle, FileCheck2, Headphones, ClipboardCheck, ReceiptText, BadgeCheck } from "lucide-react";

interface OperationalSummary {
  activeShipments: number;
  actionRequired: number;
  deliveredShipments: number;
  openClaims: number;
  awaitingDocuments: number;
  openSupport: number;
  pendingRequests: number;
  issuedInvoices: number;
  paidInvoices: number;
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<OperationalSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<OperationalSummary>("/admin/reports/operational-summary")
      .then(setSummary)
      .catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 403) {
          setError("Your role does not have permission to view operational reports.");
        } else if (e instanceof ApiError) {
          setError(e.body.message);
        } else {
          setError("Could not load the operational summary.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-black text-slate-900">Operational Analytics & Reports</h1>
          <p className="text-xs text-slate-500">Live platform performance and shipment volume breakdown</p>
        </div>

        {loading && (
          <p className="text-sm text-slate-500" role="status">
            Loading summary...
          </p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 max-w-md" role="alert">
            {error}
          </p>
        )}

        {summary && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Counter label="Active shipments" value={summary.activeShipments} icon={<PackageCheck className="w-4 h-4 text-emerald-600" />} />
            <Counter label="Action required" value={summary.actionRequired} icon={<AlertTriangle className="w-4 h-4 text-amber-500" />} />
            <Counter label="Delivered shipments" value={summary.deliveredShipments} icon={<BadgeCheck className="w-4 h-4 text-emerald-600" />} />
            <Counter label="Pending shipment requests" value={summary.pendingRequests} icon={<ClipboardCheck className="w-4 h-4 text-blue-600" />} />
            <Counter label="Documents awaiting review" value={summary.awaitingDocuments} icon={<FileCheck2 className="w-4 h-4 text-violet-600" />} />
            <Counter label="Support awaiting staff" value={summary.openSupport} icon={<Headphones className="w-4 h-4 text-cyan-600" />} />
            <Counter label="Open claims" value={summary.openClaims} icon={<BarChart3 className="w-4 h-4 text-blue-600" />} />
            <Counter label="Invoices issued" value={summary.issuedInvoices} icon={<ReceiptText className="w-4 h-4 text-slate-600" />} />
            <Counter label="Invoices paid" value={summary.paidInvoices} icon={<BadgeCheck className="w-4 h-4 text-emerald-600" />} />
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function Counter({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1"><div className="flex justify-between items-center text-slate-500"><span className="text-xs font-bold">{label}</span>{icon}</div><span className="text-2xl font-black text-slate-900">{value}</span></div>;
}

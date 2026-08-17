"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";
import { BarChart3, PackageCheck, AlertTriangle, Info } from "lucide-react";

interface OperationalSummary {
  activeShipments: number;
  actionRequired: number;
  openClaims: number;
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-xs font-bold">Active Shipments</span>
                <PackageCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-black text-slate-900">{summary.activeShipments}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-xs font-bold">Action Required</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl font-black text-slate-900">{summary.actionRequired}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-xs font-bold">Open Claims</span>
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-2xl font-black text-slate-900">{summary.openClaims}</span>
            </div>
          </div>
        )}

        {/* Revenue, on-time delivery, and service-level distribution require billing/carrier
            data that isn't wired to a real reporting pipeline yet (spec section 24: large
            exports belong on the worker's reports queue, not a request-serving endpoint).
            Showing invented numbers here would violate the "no fabricated statistics" brand
            rule, so this is disclosed rather than faked. */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-3 text-sm text-slate-600">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            Revenue, on-time delivery, and service-level distribution reporting are not yet
            connected to a real data pipeline in this environment. Only the operational counts
            above reflect live data.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}

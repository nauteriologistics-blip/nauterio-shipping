"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";

interface OperationalSummary {
  activeShipments: number;
  actionRequired: number;
  openClaims: number;
}

export default function DashboardPage() {
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
      <h1 className="text-xl font-bold text-[#081F3D]">Operations dashboard</h1>

      {loading && (
        <p className="mt-6 text-sm text-slate-500" role="status">
          Loading summary...
        </p>
      )}

      {error && !loading && (
        <p className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 max-w-md" role="alert">
          {error}
        </p>
      )}

      {summary && !loading && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
          <SummaryCard label="Active shipments" value={summary.activeShipments} />
          <SummaryCard label="Action required" value={summary.actionRequired} accent />
          <SummaryCard label="Open claims" value={summary.openClaims} />
        </div>
      )}
    </AdminShell>
  );
}

function SummaryCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border p-5 ${accent && value > 0 ? "border-amber-300 bg-amber-50" : "border-slate-200"}`}>
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent && value > 0 ? "text-amber-800" : "text-[#081F3D]"}`}>{value}</p>
    </div>
  );
}

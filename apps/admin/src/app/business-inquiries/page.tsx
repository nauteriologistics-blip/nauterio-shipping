"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";

interface BusinessInquiry {
  id: string;
  companyName: string;
  monthlyVolume: string;
  workEmail: string;
  message: string | null;
  status: "OPEN" | "CONTACTED" | "CLOSED";
  createdAt: string;
}

export default function BusinessInquiriesPage() {
  const [inquiries, setInquiries] = useState<BusinessInquiry[]>([]);
  const [status, setStatus] = useState<"OPEN" | "CONTACTED" | "CLOSED" | "ALL">("OPEN");
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const query = status === "ALL" ? "" : `?status=${status}`;
      const page = await apiFetch<{ items: BusinessInquiry[] }>(`/admin/business-inquiries${query}`);
      setInquiries(page.items);
      setError(null);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not load business inquiries.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(initialLoad);
  }, [load]);

  async function updateInquiry(inquiry: BusinessInquiry, nextStatus: BusinessInquiry["status"]) {
    setWorkingId(inquiry.id);
    try {
      await apiFetch(`/admin/business-inquiries/${inquiry.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setInquiries((current) => current.map((item) => item.id === inquiry.id ? { ...item, status: nextStatus } : item));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not update inquiry.");
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-xl font-bold text-[#081F3D]">Business inquiries</h1>
          <p className="mt-1 text-sm text-slate-500">Follow up on companies asking about recurring shipments and partner-coordinated delivery.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="OPEN">Open</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CLOSED">Closed</option>
            <option value="ALL">All</option>
          </select>
          <button onClick={() => void load()} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#081F3D]">Refresh</button>
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-slate-500">Loading inquiries…</p>}
      {error && <p role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {!loading && inquiries.length === 0 && <p className="mt-6 text-sm text-slate-500">No inquiries match this view.</p>}

      <div className="mt-6 space-y-4">
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <strong className="text-[#081F3D]">{inquiry.companyName}</strong>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{inquiry.status}</span>
                </div>
                <p><strong>Email:</strong> <a className="text-[#081F3D] underline" href={`mailto:${inquiry.workEmail}`}>{inquiry.workEmail}</a></p>
                <p><strong>Monthly volume:</strong> {inquiry.monthlyVolume}</p>
                {inquiry.message && <p className="max-w-3xl whitespace-pre-wrap text-slate-600">{inquiry.message}</p>}
                <p className="text-xs text-slate-400">Submitted {new Date(inquiry.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button disabled={workingId === inquiry.id} onClick={() => void updateInquiry(inquiry, "CONTACTED")} className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-50">Mark contacted</button>
                <button disabled={workingId === inquiry.id} onClick={() => void updateInquiry(inquiry, "CLOSED")} className="rounded-lg bg-[#081F3D] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Close</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}

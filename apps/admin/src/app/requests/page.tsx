"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";

interface ShipmentRequest {
  id: string;
  requestStatus: string;
  submittedAt: string | null;
  draftDataJson: Record<string, unknown>;
  user: { fullName: string; email: string } | null;
}

export default function ShipmentRequestsPage() {
  const [requests, setRequests] = useState<ShipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const page = await apiFetch<{ items: ShipmentRequest[] }>("/bookings/admin/requests?status=SUBMITTED&limit=100");
      setRequests(page.items);
      setError(null);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not load shipment requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(initialLoad);
  }, [load]);

  async function decide(request: ShipmentRequest, decision: "approve" | "reject") {
    const reason = decision === "reject" ? window.prompt("Reason shown to the customer:")?.trim() : undefined;
    if (decision === "reject" && !reason) return;
    setWorkingId(request.id);
    try {
      await apiFetch(`/bookings/${request.id}/${decision}`, {
        method: "POST",
        headers: { "Idempotency-Key": `request-${decision}-${request.id}` },
        body: JSON.stringify(reason ? { reason } : {}),
      });
      setRequests((current) => current.filter((item) => item.id !== request.id));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : `Could not ${decision} request.`);
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <AdminShell>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#081F3D]">Shipment requests</h1>
          <p className="mt-1 text-sm text-slate-500">Review customer details before issuing the invoice and tracking number.</p>
        </div>
        <button onClick={() => void load()} className="text-sm font-semibold text-[#081F3D] hover:underline">Refresh</button>
      </div>
      {loading && <p className="mt-6 text-sm text-slate-500">Loading requests…</p>}
      {error && <p role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {!loading && requests.length === 0 && <p className="mt-6 text-sm text-slate-500">No requests are waiting for review.</p>}
      <div className="mt-6 space-y-4">
        {requests.map((request) => {
          const data = request.draftDataJson;
          return (
            <article key={request.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2 text-sm">
                  <div><strong className="text-[#081F3D]">{request.user?.fullName ?? "Customer"}</strong> <span className="text-slate-500">{request.user?.email}</span></div>
                  <p><strong>Goods:</strong> {String(data.goodsDescription ?? "—")}</p>
                  <p><strong>Route:</strong> {String(data.senderCity ?? "—")}, {String(data.senderCountry ?? "—")} → {String(data.receiverCity ?? "—")}, {String(data.receiverCountry ?? "—")}</p>
                  <p><strong>Package:</strong> {String(data.weightKg ?? "—")} kg · {String(data.lengthCm ?? "—")} × {String(data.widthCm ?? "—")} × {String(data.heightCm ?? "—")} cm</p>
                  <p><strong>Service:</strong> {String(data.serviceId ?? "—").replace(/_/g, " ")}</p>
                  <p className="text-xs text-slate-400">Submitted {request.submittedAt ? new Date(request.submittedAt).toLocaleString() : "recently"}</p>
                </div>
                <div className="flex gap-2">
                  <button disabled={workingId === request.id} onClick={() => void decide(request, "reject")} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">Reject</button>
                  <button disabled={workingId === request.id} onClick={() => void decide(request, "approve")} className="rounded-lg bg-[#F28C18] px-4 py-2 text-sm font-bold text-[#081F3D] disabled:opacity-50">Approve & issue invoice/tracking</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}

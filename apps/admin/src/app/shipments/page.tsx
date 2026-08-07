"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";

interface ShipmentListItem {
  id: string;
  trackingNumber: string;
  lifecycleStatus: string;
  senderAddressSnapshot: { city?: string; countryCode?: string };
  receiverAddressSnapshot: { city?: string; countryCode?: string };
  totalChargeableWeightKg: number;
  totalAmountMinorUnits: string;
  currency: string;
  createdAt: string;
}

interface ShipmentPage {
  items: ShipmentListItem[];
  nextCursor: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  DELIVERED: "bg-emerald-100 text-emerald-900",
  ACTION_REQUIRED: "bg-amber-100 text-amber-900",
  ACTIVE: "bg-blue-100 text-blue-900",
  CANCELLED: "bg-slate-200 text-slate-700",
  ARCHIVED: "bg-slate-100 text-slate-500",
  DRAFT: "bg-slate-100 text-slate-500",
};

export default function ShipmentsListPage() {
  const [items, setItems] = useState<ShipmentListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (cursor?: string) => {
    const query = cursor ? `?cursor=${encodeURIComponent(cursor)}&limit=25` : "?limit=25";
    return apiFetch<ShipmentPage>(`/shipments${query}`);
  }, []);

  useEffect(() => {
    loadPage()
      .then((page) => {
        setItems(page.items);
        setNextCursor(page.nextCursor);
      })
      .catch((e: unknown) => setError(e instanceof ApiError ? e.body.message : "Could not load shipments."))
      .finally(() => setLoading(false));
  }, [loadPage]);

  async function handleLoadMore() {
    if (!nextCursor) return;
    setLoadingMore(true);
    try {
      const page = await loadPage(nextCursor);
      setItems((prev) => [...prev, ...page.items]);
      setNextCursor(page.nextCursor);
    } catch (e) {
      setError(e instanceof ApiError ? e.body.message : "Could not load more shipments.");
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <AdminShell>
      <h1 className="text-xl font-bold text-[#081F3D]">Shipments</h1>

      {loading && (
        <p className="mt-6 text-sm text-slate-500" role="status">
          Loading shipments...
        </p>
      )}

      {error && !loading && (
        <p className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 max-w-md" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">No shipments in scope for your account yet.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Tracking number</th>
                <th className="p-3">Route</th>
                <th className="p-3">Weight</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <Link href={`/shipments/${s.id}`} className="font-mono font-semibold text-[#081F3D] hover:underline">
                      {s.trackingNumber}
                    </Link>
                  </td>
                  <td className="p-3 text-slate-600">
                    {s.senderAddressSnapshot.city ?? "?"}, {s.senderAddressSnapshot.countryCode ?? "?"} &rarr;{" "}
                    {s.receiverAddressSnapshot.city ?? "?"}, {s.receiverAddressSnapshot.countryCode ?? "?"}
                  </td>
                  <td className="p-3 font-mono">{s.totalChargeableWeightKg.toFixed(2)} kg</td>
                  <td className="p-3 font-mono">
                    {(Number(s.totalAmountMinorUnits) / 100).toFixed(2)} {s.currency}
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[s.lifecycleStatus] ?? "bg-slate-100 text-slate-700"}`}>
                      {s.lifecycleStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {nextCursor && (
            <div className="p-4 border-t border-slate-100 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="text-sm font-semibold text-[#081F3D] hover:underline disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { getCsrfToken } from "@/lib/auth";
import { CSRF_HEADER } from "@/lib/session";

interface NotificationItem {
  id: string;
  templateCode: string;
  renderedSubject: string | null;
  readAt: string | null;
  createdAt: string;
  deliveryAttempts: Array<{ status: string }>;
}

async function notificationFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if ((init?.method ?? "GET") !== "GET") headers.set(CSRF_HEADER, getCsrfToken() ?? "");
  const response = await fetch(`/api/v1/me/notifications${path}`, { ...init, headers });
  if (!response.ok) throw new Error("Notification request failed");
  return response.json() as Promise<T>;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const page = await notificationFetch<{ items: NotificationItem[] }>("?limit=50");
      setItems(page.items);
      setError(null);
    } catch {
      setError("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(initialLoad);
  }, [load]);

  async function markRead(id: string) {
    await notificationFetch(`/${id}/read`, { method: "PATCH", body: "{}" });
    setItems((current) => current.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item));
    window.dispatchEvent(new Event("nauterio:notifications-changed"));
  }

  async function markAllRead() {
    await notificationFetch("/read-all", { method: "PATCH", body: "{}" });
    const now = new Date().toISOString();
    setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt ?? now })));
    window.dispatchEvent(new Event("nauterio:notifications-changed"));
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-[#081F3D]"><Bell className="h-6 w-6 text-[#F28C18]" /> Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">Shipment approvals, movements, exceptions, and delivery updates.</p>
        </div>
        {items.some((item) => !item.readAt) && <button onClick={() => void markAllRead()} className="flex items-center gap-1.5 text-sm font-semibold text-[#0B2E5E] hover:underline"><CheckCheck className="h-4 w-4" /> Mark all read</button>}
      </div>
      {loading && <p className="mt-8 text-sm text-slate-500">Loading notifications…</p>}
      {error && <p role="alert" className="mt-8 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {!loading && !error && items.length === 0 && <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No notifications yet.</div>}
      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <button key={item.id} onClick={() => !item.readAt && void markRead(item.id)} className={`block w-full rounded-xl border p-4 text-left transition ${item.readAt ? "border-slate-200 bg-white" : "border-amber-300 bg-amber-50"}`}>
            <div className="flex items-start justify-between gap-4">
              <div><p className="font-bold text-[#081F3D]">{item.renderedSubject ?? item.templateCode.replace(/_/g, " ")}</p><p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p></div>
              {!item.readAt && <span className="rounded-full bg-[#F28C18] px-2 py-0.5 text-[10px] font-bold text-[#081F3D]">NEW</span>}
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}

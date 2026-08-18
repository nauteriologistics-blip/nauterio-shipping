"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";

interface ReviewItem {
  id: string; type: string; reviewStatus: string; createdAt: string;
  ownerUser: { fullName: string; email: string } | null;
  shipment: { trackingNumber: string } | null;
  currentVersion: { fileSizeBytes: number; contentType: string; malwareScanResult: string } | null;
}

export default function DocumentReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const load = useCallback(async () => { try { setItems(await apiFetch<ReviewItem[]>("/admin/documents?status=PROCESSING")); setError(null); } catch (cause) { setError(cause instanceof ApiError ? cause.body.message : "Could not load documents."); } finally { setLoading(false); } }, []);
  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(initialLoad);
  }, [load]);

  async function inspect(id: string) {
    const tab = window.open("", "_blank", "noopener,noreferrer");
    try { const result = await apiFetch<{ downloadUrl: string }>(`/admin/documents/${id}/review-url`); if (tab) tab.location.href = result.downloadUrl; else window.location.assign(result.downloadUrl); }
    catch (cause) { tab?.close(); setError(cause instanceof ApiError ? cause.body.message : "Could not open document."); }
  }

  async function decide(item: ReviewItem, decision: "APPROVED" | "REJECTED" | "REPLACEMENT_REQUIRED") {
    const reason = decision === "APPROVED" ? undefined : window.prompt(decision === "REJECTED" ? "Reason for rejection:" : "What must the customer replace?")?.trim();
    if (decision !== "APPROVED" && !reason) return;
    setWorking(item.id);
    try {
      await apiFetch(`/admin/documents/${item.id}/review`, { method: "POST", headers: { "Idempotency-Key": `document-review-${item.id}` }, body: JSON.stringify({ decision, reason }) });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
    } catch (cause) { setError(cause instanceof ApiError ? cause.body.message : "Could not save review decision."); }
    finally { setWorking(null); }
  }

  return <AdminShell>
    <div className="flex items-end justify-between gap-4"><div><h1 className="text-xl font-bold text-[#081F3D]">Document review</h1><p className="mt-1 text-sm text-slate-500">Only malware-cleared files can be opened or approved.</p></div><button onClick={() => void load()} className="text-sm font-semibold text-[#081F3D] hover:underline">Refresh</button></div>
    {loading && <p className="mt-6 text-sm text-slate-500">Loading documents…</p>}
    {error && <p role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    {!loading && items.length === 0 && <p className="mt-6 text-sm text-slate-500">No documents are waiting for review.</p>}
    <div className="mt-6 space-y-4">{items.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-5 lg:flex-row"><div className="space-y-1 text-sm"><p className="font-bold text-[#081F3D]">{item.type.replace(/_/g, " ")}</p><p>{item.ownerUser?.fullName ?? "Unknown customer"} · {item.ownerUser?.email ?? "No email"}</p><p className="text-slate-500">{item.shipment?.trackingNumber ? `Shipment ${item.shipment.trackingNumber}` : "Not linked to a shipment"}</p><p className="text-xs text-slate-400">{item.currentVersion?.contentType} · {item.currentVersion ? `${(item.currentVersion.fileSizeBytes / 1024).toFixed(1)} KB` : "No file"} · Scan: {item.currentVersion?.malwareScanResult ?? "PENDING"}</p></div><div className="flex flex-wrap gap-2"><button disabled={working === item.id || item.currentVersion?.malwareScanResult !== "CLEAN"} onClick={() => void inspect(item.id)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold disabled:opacity-40">Inspect</button><button disabled={working === item.id || item.currentVersion?.malwareScanResult !== "CLEAN"} onClick={() => void decide(item, "REPLACEMENT_REQUIRED")} className="rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-800 disabled:opacity-40">Request replacement</button><button disabled={working === item.id || item.currentVersion?.malwareScanResult !== "CLEAN"} onClick={() => void decide(item, "REJECTED")} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-40">Reject</button><button disabled={working === item.id || item.currentVersion?.malwareScanResult !== "CLEAN"} onClick={() => void decide(item, "APPROVED")} className="rounded-lg bg-[#F28C18] px-4 py-2 text-xs font-bold text-[#081F3D] disabled:opacity-40">Approve</button></div></div></article>)}</div>
  </AdminShell>;
}

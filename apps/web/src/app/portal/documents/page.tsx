"use client";

import { useEffect, useState } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { getCsrfToken } from "@/lib/auth";
import { CSRF_HEADER } from "@/lib/session";

interface DocumentItem {
  id: string;
  type: string;
  reviewStatus: string;
  reviewReason: string | null;
  reviewedAt: string | null;
  shipmentId: string | null;
  createdAt: string;
  currentVersion: { fileSizeBytes: number; contentType: string; malwareScanResult: string } | null;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    const response = await fetch("/api/v1/documents", { cache: "no-store" });
    if (!response.ok) throw new Error();
    setDocuments(await response.json() as DocumentItem[]);
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void refresh()
        .catch(() => setError("Could not load documents."))
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(initialLoad);
  }, []);

  async function upload(file: File, replacementId?: string) {
    setUploading(true); setError(null);
    try {
      const headers = { "Content-Type": "application/json", [CSRF_HEADER]: getCsrfToken() ?? "" };
      const endpoint = replacementId ? `/api/v1/documents/${replacementId}/replacements/initiate` : "/api/v1/documents/uploads/initiate";
      const start = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify({ type: "OTHER", contentType: file.type, fileSizeBytes: file.size }) });
      const intent = await start.json() as { documentId?: string; uploadUrl?: string; message?: string };
      if (!start.ok || !intent.documentId || !intent.uploadUrl) throw new Error(intent.message ?? "Could not prepare upload.");
      const put = await fetch(intent.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) throw new Error("The encrypted storage upload failed.");
      const complete = await fetch(`/api/v1/documents/${intent.documentId}/uploads/complete`, { method: "POST", headers });
      if (!complete.ok) { const body = await complete.json().catch(() => ({})) as { message?: string }; throw new Error(body.message ?? "Security scanning could not start."); }
      await refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not upload document."); }
    finally { setUploading(false); }
  }

  async function download(id: string) {
    const response = await fetch(`/api/v1/documents/${id}/download`, { cache: "no-store" });
    const body = await response.json().catch(() => ({})) as { downloadUrl?: string; message?: string };
    if (!response.ok || !body.downloadUrl) { setError(body.message ?? "Document is not ready for download."); return; }
    window.location.assign(body.downloadUrl);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="flex items-center gap-2 text-2xl font-black text-[#081F3D]"><FileText className="h-6 w-6 text-[#F28C18]" /> Documents</h1>
      <p className="mt-1 text-sm text-slate-500">Supporting documents attached to your shipment requests and shipments.</p>
      <label className="mt-6 inline-flex cursor-pointer items-center rounded-lg bg-[#081F3D] px-4 py-2 text-sm font-bold text-white hover:bg-[#0b2b54]">
        {uploading ? "Uploading securely…" : "Upload document"}
        <input className="sr-only" type="file" accept="application/pdf,image/jpeg,image/png" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.target.value = ""; }} />
      </label>
      <p className="mt-2 text-xs text-slate-500">PDF, JPEG or PNG. Maximum 10 MB. Files are quarantined until malware scanning passes.</p>
      {loading && <p className="mt-8 text-sm text-slate-500">Loading documents…</p>}
      {error && <p role="alert" className="mt-8 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {!loading && !error && documents.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <ShieldCheck className="mx-auto h-9 w-9 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-[#081F3D]">No documents have been attached yet.</p>
          <p className="mt-1 text-xs text-slate-500">Upload a PDF, JPEG or PNG to begin.</p>
        </div>
      )}
      <div className="mt-8 space-y-3">
        {documents.map((document) => (
          <div key={document.id} className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
            <div><p className="font-bold text-[#081F3D]">{document.type.replace(/_/g, " ")}</p><p className="mt-1 text-xs text-slate-500">{new Date(document.createdAt).toLocaleString()} · {document.currentVersion?.contentType ?? "Processing"}</p>{document.reviewReason && <p className="mt-2 text-xs font-medium text-red-700">Review note: {document.reviewReason}</p>}</div>
            <div className="flex items-center gap-2"><span className={`self-start rounded-full px-3 py-1 text-[10px] font-extrabold ${document.currentVersion?.malwareScanResult === "CLEAN" ? "bg-emerald-100 text-emerald-800" : document.currentVersion?.malwareScanResult === "INFECTED" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{document.currentVersion?.malwareScanResult ?? "PROCESSING"}</span>{document.currentVersion?.malwareScanResult === "CLEAN" && <button type="button" onClick={() => void download(document.id)} className="text-xs font-bold text-[#081F3D] underline">Download</button>}{document.reviewStatus === "REPLACEMENT_REQUIRED" && <label className="cursor-pointer text-xs font-bold text-[#F28C18] underline">Upload replacement<input className="sr-only" type="file" accept="application/pdf,image/jpeg,image/png" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, document.id); event.target.value = ""; }} /></label>}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

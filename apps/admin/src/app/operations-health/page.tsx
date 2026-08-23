"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";

interface Summary {
  pilotCustomers: number;
  submittedRequests: number;
  activeShipments: number;
  actionRequired: number;
  deliveredToday: number;
  documentsScanning: number;
  documentsAwaitingReview: number;
  failedEvents: number;
  openIssues: number;
  criticalIssues: number;
  oldestPendingEventSeconds: number;
  generatedAt: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  createdAt: string;
  shipment: { trackingNumber: string } | null;
  reportedByUser: { fullName: string };
  assignedToUser: { fullName: string } | null;
}

export default function OperationsHealthPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [nextSummary, nextIssues] = await Promise.all([
        apiFetch<Summary>("/admin/pilot/summary"),
        apiFetch<Issue[]>("/admin/pilot/issues"),
      ]);
      setSummary(nextSummary);
      setIssues(nextIssues);
      setError(null);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not load operations health data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(), 60_000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
    };
  }, [load]);

  async function createIssue() {
    const title = window.prompt("Issue title:")?.trim();
    if (!title) return;
    const description = window.prompt("What happened and what is the impact?")?.trim();
    if (!description) return;
    const severity = (window.prompt("Severity: LOW, MEDIUM, HIGH, or CRITICAL", "MEDIUM") ?? "").trim().toUpperCase();
    if (!["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(severity)) return setError("Invalid severity.");

    try {
      await apiFetch("/admin/pilot/issues", {
        method: "POST",
        headers: { "Idempotency-Key": `ops-issue-${crypto.randomUUID()}` },
        body: JSON.stringify({ title, description, severity }),
      });
      await load();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not record issue.");
    }
  }

  async function update(issue: Issue, status: "INVESTIGATING" | "RESOLVED" | "CLOSED") {
    const resolution = status === "INVESTIGATING" ? undefined : window.prompt("Resolution or closure note:")?.trim();
    if (status !== "INVESTIGATING" && !resolution) return;

    try {
      await apiFetch(`/admin/pilot/issues/${issue.id}`, {
        method: "PATCH",
        headers: { "Idempotency-Key": `ops-${issue.id}-${status}` },
        body: JSON.stringify({ status, resolution }),
      });
      await load();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not update issue.");
    }
  }

  const metrics = summary
    ? ([
        ["Customer accounts", summary.pilotCustomers],
        ["Submitted requests", summary.submittedRequests],
        ["Active shipments", summary.activeShipments],
        ["Action required", summary.actionRequired],
        ["Delivered today", summary.deliveredToday],
        ["Scanning", summary.documentsScanning],
        ["Awaiting document review", summary.documentsAwaitingReview],
        ["Failed events", summary.failedEvents],
        ["Open issues", summary.openIssues],
        ["Critical issues", summary.criticalIssues],
      ] as const)
    : [];

  return (
    <AdminShell>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#081F3D]">Operations health</h1>
          <p className="mt-1 text-sm text-slate-500">Live operational health and issue register.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => void load()} className="text-sm font-semibold text-[#081F3D]">
            Refresh
          </button>
          <button onClick={() => void createIssue()} className="rounded-lg bg-[#F28C18] px-4 py-2 text-sm font-bold text-[#081F3D]">
            Record issue
          </button>
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-slate-500">Loading operations data…</p>}
      {error && <p role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {summary && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {metrics.map(([label, value]) => (
              <div key={label} className={`rounded-xl border p-4 ${((label === "Critical issues" || label === "Failed events") && value > 0) ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"}`}>
                <p className="text-xs font-semibold text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-black text-[#081F3D]">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Oldest pending event: {summary.oldestPendingEventSeconds}s · Updated {new Date(summary.generatedAt).toLocaleString()}</p>
        </>
      )}

      <h2 className="mt-10 text-base font-bold text-[#081F3D]">Issue register</h2>
      <div className="mt-4 space-y-3">
        {issues.map((issue) => (
          <article key={issue.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              <div>
                <div className="flex gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${issue.severity === "CRITICAL" ? "bg-red-100 text-red-800" : issue.severity === "HIGH" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>
                    {issue.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{issue.status}</span>
                </div>
                <p className="mt-2 font-bold text-[#081F3D]">{issue.title}</p>
                <p className="mt-1 text-sm text-slate-600">{issue.description}</p>
                <p className="mt-2 text-xs text-slate-400">Reported by {issue.reportedByUser.fullName}{issue.shipment ? ` · ${issue.shipment.trackingNumber}` : ""}</p>
              </div>
              {!["RESOLVED", "CLOSED"].includes(issue.status) && (
                <div className="flex gap-2">
                  <button onClick={() => void update(issue, "INVESTIGATING")} className="rounded-lg border px-3 py-2 text-xs font-semibold">
                    Investigate
                  </button>
                  <button onClick={() => void update(issue, "RESOLVED")} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">
                    Resolve
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
        {!loading && issues.length === 0 && <p className="text-sm text-slate-500">No operational issues recorded.</p>}
      </div>
    </AdminShell>
  );
}

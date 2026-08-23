"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";

interface InvoiceLine {
  id: string;
  description: string;
  amountMinorUnits: string;
  currency: string;
  shipment?: { id: string; trackingNumber: string; lifecycleStatus: string } | null;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: "DRAFT" | "ISSUED" | "PAID" | "OVERDUE" | "VOID";
  totalAmountMinorUnits: string;
  currency: string;
  issuedAt: string | null;
  dueAt: string | null;
  createdAt: string;
  customerUser?: { id: string; fullName: string; email: string } | null;
  organisation?: { id: string; legalName: string } | null;
  lines: InvoiceLine[];
}

interface InvoicePage {
  items: Invoice[];
  nextCursor: string | null;
}

interface Profile {
  staffRole: string | null;
}

const STATUS_STYLES: Record<Invoice["status"], string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  ISSUED: "bg-blue-100 text-blue-900",
  PAID: "bg-emerald-100 text-emerald-900",
  OVERDUE: "bg-amber-100 text-amber-900",
  VOID: "bg-slate-200 text-slate-600",
};

const MANAGED_STATUSES: Array<Invoice["status"]> = ["ISSUED", "PAID", "OVERDUE", "VOID"];

function formatMoney(minorUnits: string, currency: string): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(minorUnits) / 100);
}

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleDateString() : "—";
}

export default function AdminInvoicesPage() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Invoice["status"] | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (cursor?: string) => {
    const query = cursor ? `?after=${encodeURIComponent(cursor)}&limit=50` : "?limit=50";
    return apiFetch<InvoicePage>(`/invoices${query}`);
  }, []);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const [page, nextProfile] = await Promise.all([loadPage(), apiFetch<Profile>("/me")]);
      setItems(page.items);
      setNextCursor(page.nextCursor);
      setProfile(nextProfile);
      setError(null);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not load invoices.");
    } finally {
      setLoading(false);
    }
  }, [loadPage]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadInitial(), 0);
    return () => window.clearTimeout(initialLoad);
  }, [loadInitial]);

  const filteredItems = useMemo(
    () => (statusFilter === "ALL" ? items : items.filter((invoice) => invoice.status === statusFilter)),
    [items, statusFilter]
  );
  const canManageInvoices = profile?.staffRole ? ["SUPER_ADMIN", "OPERATIONS", "FINANCE"].includes(profile.staffRole) : false;

  async function loadMore() {
    if (!nextCursor) return;
    setLoadingMore(true);
    try {
      const page = await loadPage(nextCursor);
      setItems((current) => [...current, ...page.items]);
      setNextCursor(page.nextCursor);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not load more invoices.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function updateStatus(invoice: Invoice, status: Invoice["status"]) {
    const note = window.prompt(`Internal note for changing ${invoice.invoiceNumber} to ${status.replace("_", " ")}:`)?.trim();
    if (note === undefined) return;
    setWorkingId(invoice.id);
    try {
      const updated = await apiFetch<Invoice>(`/invoices/${invoice.id}/status`, {
        method: "PATCH",
        headers: { "Idempotency-Key": `invoice-status-${invoice.id}-${status}-${crypto.randomUUID()}` },
        body: JSON.stringify({ status, note: note || undefined }),
      });
      setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setError(null);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not update invoice status.");
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#F28C18]">Finance control</p>
          <h1 className="mt-2 text-2xl font-bold text-[#081F3D]">Invoices</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Review issued shipment invoices and record offline outcomes. Nauterio does not collect card payments in this console.
          </p>
        </div>
        <button onClick={() => void loadInitial()} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#081F3D] hover:bg-slate-50">
          Refresh
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["ALL", "ISSUED", "PAID", "OVERDUE", "VOID"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              statusFilter === status ? "bg-[#081F3D] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {status === "ALL" ? "All" : status}
          </button>
        ))}
      </div>

      {loading && <p className="mt-6 text-sm text-slate-500">Loading invoices…</p>}
      {error && <p role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {!loading && filteredItems.length === 0 && <p className="mt-6 text-sm text-slate-500">No invoices match this view.</p>}

      {!loading && filteredItems.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-3">Invoice</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Shipment</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">{canManageInvoices ? "Admin action" : "Access"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((invoice) => {
                const firstShipment = invoice.lines.find((line) => line.shipment)?.shipment;
                return (
                  <tr key={invoice.id} className="align-top hover:bg-slate-50">
                    <td className="p-3">
                      <p className="font-mono font-semibold text-[#081F3D]">{invoice.invoiceNumber}</p>
                      <p className="mt-1 text-xs text-slate-500">{invoice.lines.length} line item{invoice.lines.length === 1 ? "" : "s"}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-slate-800">{invoice.customerUser?.fullName ?? invoice.organisation?.legalName ?? "Customer"}</p>
                      <p className="text-xs text-slate-500">{invoice.customerUser?.email ?? "—"}</p>
                    </td>
                    <td className="p-3">
                      {firstShipment ? (
                        <>
                          <Link href={`/shipments/${firstShipment.id}`} className="font-mono font-semibold text-[#081F3D] hover:underline">
                            {firstShipment.trackingNumber}
                          </Link>
                          <p className="mt-1 text-xs text-slate-500">{firstShipment.lifecycleStatus.replace(/_/g, " ")}</p>
                        </>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-3 font-mono">{formatMoney(invoice.totalAmountMinorUnits, invoice.currency)}</td>
                    <td className="p-3 text-xs text-slate-600">
                      <p>Issued: {formatDate(invoice.issuedAt)}</p>
                      <p>Due: {formatDate(invoice.dueAt)}</p>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_STYLES[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {canManageInvoices ? (
                        <div className="flex flex-wrap justify-end gap-2">
                          {MANAGED_STATUSES.filter((status) => status !== invoice.status).map((status) => (
                            <button
                              key={status}
                              disabled={workingId === invoice.id || invoice.status === "VOID"}
                              onClick={() => void updateStatus(invoice, status)}
                              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Mark {status.toLowerCase()}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-right text-xs font-semibold text-slate-400">Read only</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {nextCursor && (
            <div className="border-t border-slate-100 p-4 text-center">
              <button onClick={() => void loadMore()} disabled={loadingMore} className="text-sm font-semibold text-[#081F3D] hover:underline disabled:opacity-50">
                {loadingMore ? "Loading…" : "Load more invoices"}
              </button>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

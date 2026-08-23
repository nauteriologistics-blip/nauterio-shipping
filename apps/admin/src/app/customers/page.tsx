"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";
import { AlertTriangle, CheckCircle2, Clock3, FileText, Package, ReceiptText, Search, Truck, Users } from "lucide-react";

interface AdminCustomer {
  id: string;
  fullName: string;
  email: string;
  status: string;
  createdAt: string;
  organisationName: string | null;
  shipmentsCount: number;
  bookingsCount: number;
  invoicesCount: number;
  supportConversationsCount: number;
  activeShipmentsCount: number;
  actionRequiredShipmentsCount: number;
  deliveredShipmentsCount: number;
  submittedRequestsCount: number;
  draftRequestsCount: number;
  openInvoicesCount: number;
  overdueInvoicesCount: number;
  operationsStatus:
    | "ACCOUNT_NOT_ACTIVE"
    | "NEEDS_ATTENTION"
    | "AWAITING_REVIEW"
    | "SHIPPING_NOW"
    | "INVOICE_OPEN"
    | "DRAFT_ONLY"
    | "DELIVERED_BEFORE"
    | "REGISTERED_ONLY";
  latestBooking: {
    id: string;
    requestStatus: string;
    currentStep: string;
    submittedAt: string | null;
    updatedAt: string;
  } | null;
  latestShipment: {
    id: string;
    trackingNumber: string;
    lifecycleStatus: string;
    currentTrackingCode: string;
    actionRequiredReason: string | null;
    operationalHold: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  latestInvoice: {
    id: string;
    invoiceNumber: string;
    status: string;
    totalAmountMinorUnits: string;
    currency: string;
    dueAt: string | null;
    createdAt: string;
  } | null;
}

const OPERATIONS_STATUS_LABELS: Record<AdminCustomer["operationsStatus"], string> = {
  ACCOUNT_NOT_ACTIVE: "Account not active",
  NEEDS_ATTENTION: "Needs attention",
  AWAITING_REVIEW: "Awaiting review",
  SHIPPING_NOW: "Shipping now",
  INVOICE_OPEN: "Invoice open",
  DRAFT_ONLY: "Draft only",
  DELIVERED_BEFORE: "Delivered before",
  REGISTERED_ONLY: "Registered only",
};

const OPERATIONS_STATUS_STYLES: Record<AdminCustomer["operationsStatus"], string> = {
  ACCOUNT_NOT_ACTIVE: "bg-slate-100 text-slate-700",
  NEEDS_ATTENTION: "bg-red-100 text-red-800",
  AWAITING_REVIEW: "bg-amber-100 text-amber-900",
  SHIPPING_NOW: "bg-blue-100 text-blue-900",
  INVOICE_OPEN: "bg-purple-100 text-purple-900",
  DRAFT_ONLY: "bg-orange-100 text-orange-900",
  DELIVERED_BEFORE: "bg-emerald-100 text-emerald-900",
  REGISTERED_ONLY: "bg-slate-100 text-slate-600",
};

const STATUS_FILTERS = [
  "ALL",
  "NEEDS_ATTENTION",
  "AWAITING_REVIEW",
  "SHIPPING_NOW",
  "INVOICE_OPEN",
  "DRAFT_ONLY",
  "REGISTERED_ONLY",
] as const;

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("ALL");

  useEffect(() => {
    apiFetch<AdminCustomer[]>("/admin/customers")
      .then(setCustomers)
      .catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 403) {
          setError("Your role does not have permission to view customer accounts.");
        } else if (e instanceof ApiError) {
          setError(e.body.message);
        } else {
          setError("Could not load customer accounts.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesStatus = statusFilter === "ALL" || customer.operationsStatus === statusFilter;
    const searchable = `${customer.fullName} ${customer.email} ${customer.organisationName ?? ""} ${customer.latestShipment?.trackingNumber ?? ""}`.toLowerCase();
    return matchesStatus && searchable.includes(query.trim().toLowerCase());
  });

  const totals = customers.reduce(
    (acc, customer) => ({
      registered: acc.registered + 1,
      shippingNow: acc.shippingNow + customer.activeShipmentsCount,
      awaitingReview: acc.awaitingReview + customer.submittedRequestsCount,
      needsAttention: acc.needsAttention + customer.actionRequiredShipmentsCount + customer.overdueInvoicesCount,
      openInvoices: acc.openInvoices + customer.openInvoicesCount,
    }),
    { registered: 0, shippingNow: 0, awaitingReview: 0, needsAttention: 0, openInvoices: 0 }
  );

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F28C18]">Customer control</p>
            <h1 className="mt-2 text-2xl font-black text-slate-900">Customer & organisation accounts</h1>
            <p className="mt-1 text-sm text-slate-500">See who registered, who is shipping, who is waiting for review, and who needs operations follow-up.</p>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-slate-500" role="status">
            Loading customer accounts...
          </p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 max-w-md" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-3 md:grid-cols-5">
              <SummaryCard icon={Users} label="Registered" value={totals.registered} />
              <SummaryCard icon={Truck} label="Shipping now" value={totals.shippingNow} />
              <SummaryCard icon={Clock3} label="Awaiting review" value={totals.awaitingReview} accent />
              <SummaryCard icon={AlertTriangle} label="Needs attention" value={totals.needsAttention} danger />
              <SummaryCard icon={ReceiptText} label="Open invoices" value={totals.openInvoices} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <label className="relative block max-w-md flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#F28C18] focus:ring-2 focus:ring-[#F28C18]/20"
                    placeholder="Search name, email, company, tracking number"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTERS.map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        statusFilter === status ? "bg-[#081F3D] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {status === "ALL" ? "All" : OPERATIONS_STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between bg-[#F3F6FA] p-4 text-xs font-bold text-[#081F3D]">
                <span>Customer operations view</span>
                <span>{filteredCustomers.length} shown / {customers.length} total</span>
              </div>

              {filteredCustomers.length === 0 && <div className="p-6 text-center text-sm text-slate-500">No customer accounts match this view.</div>}

              <div className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <article key={customer.id} className="p-4">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#081F3D] text-white">
                          <Users className="h-4 w-4 text-[#F28C18]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900">{customer.fullName}</h3>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${OPERATIONS_STATUS_STYLES[customer.operationsStatus]}`}>
                              {OPERATIONS_STATUS_LABELS[customer.operationsStatus]}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                customer.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <CheckCircle2 className="mr-1 inline h-3 w-3" /> {customer.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            {customer.email}
                            {customer.organisationName ? ` • ${customer.organisationName}` : ""}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-400">Registered {new Date(customer.createdAt).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid gap-2 text-xs sm:grid-cols-2 xl:w-[620px] xl:grid-cols-4">
                        <Metric label="Shipments" value={`${customer.shipmentsCount} total`} detail={`${customer.activeShipmentsCount} active · ${customer.actionRequiredShipmentsCount} action`} />
                        <Metric label="Requests" value={`${customer.bookingsCount} total`} detail={`${customer.submittedRequestsCount} submitted · ${customer.draftRequestsCount} drafts`} />
                        <Metric label="Invoices" value={`${customer.invoicesCount} total`} detail={`${customer.openInvoicesCount} open · ${customer.overdueInvoicesCount} overdue`} />
                        <Metric label="Support" value={`${customer.supportConversationsCount} thread${customer.supportConversationsCount === 1 ? "" : "s"}`} detail="Customer conversations" />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      <ActivityCard
                        icon={Package}
                        title="Latest shipment"
                        empty="No shipment yet"
                        body={
                          customer.latestShipment ? (
                            <>
                              <Link href={`/shipments/${customer.latestShipment.id}`} className="font-mono font-bold text-[#081F3D] hover:underline">
                                {customer.latestShipment.trackingNumber}
                              </Link>
                              <p className="mt-1 text-xs text-slate-500">
                                {customer.latestShipment.lifecycleStatus.replace(/_/g, " ")} · {customer.latestShipment.currentTrackingCode.replace(/_/g, " ")}
                              </p>
                              {customer.latestShipment.actionRequiredReason && <p className="mt-1 text-xs text-red-700">{customer.latestShipment.actionRequiredReason}</p>}
                            </>
                          ) : null
                        }
                      />
                      <ActivityCard
                        icon={FileText}
                        title="Latest request"
                        empty="No booking request yet"
                        body={
                          customer.latestBooking ? (
                            <>
                              <p className="font-bold text-slate-800">{customer.latestBooking.requestStatus.replace(/_/g, " ")}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                Step: {customer.latestBooking.currentStep.replace(/_/g, " ")} · Updated {new Date(customer.latestBooking.updatedAt).toLocaleString()}
                              </p>
                            </>
                          ) : null
                        }
                      />
                      <ActivityCard
                        icon={ReceiptText}
                        title="Latest invoice"
                        empty="No invoice yet"
                        body={
                          customer.latestInvoice ? (
                            <>
                              <Link href="/invoices" className="font-mono font-bold text-[#081F3D] hover:underline">
                                {customer.latestInvoice.invoiceNumber}
                              </Link>
                              <p className="mt-1 text-xs text-slate-500">
                                {customer.latestInvoice.status} · {(Number(customer.latestInvoice.totalAmountMinorUnits) / 100).toFixed(2)} {customer.latestInvoice.currency}
                              </p>
                            </>
                          ) : null
                        }
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}

function SummaryCard({ icon: Icon, label, value, accent, danger }: { icon: typeof Users; label: string; value: number; accent?: boolean; danger?: boolean }) {
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm ${danger && value > 0 ? "border-red-200 bg-red-50" : accent && value > 0 ? "border-amber-200 bg-amber-50" : "border-slate-200"}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
        <Icon className={`h-4 w-4 ${danger && value > 0 ? "text-red-600" : accent && value > 0 ? "text-amber-700" : "text-slate-400"}`} />
      </div>
      <p className={`mt-2 text-2xl font-black ${danger && value > 0 ? "text-red-800" : accent && value > 0 ? "text-amber-900" : "text-[#081F3D]"}`}>{value}</p>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-[11px] text-slate-500">{detail}</p>
    </div>
  );
}

function ActivityCard({ icon: Icon, title, empty, body }: { icon: typeof Users; title: string; empty: string; body: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      {body ?? <p className="text-xs text-slate-400">{empty}</p>}
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  AlertTriangle, ArrowRight, Package, Truck, Receipt, FileText,
  LifeBuoy, Compass, Plus, ShieldCheck,
} from "lucide-react";
import { SERVICES } from "@nauterio/contracts";
import { getPortalDashboardData, type ShipmentSummary } from "@/lib/portal-data.server";
import { formatMoney, formatDate, formatDateRange } from "./format";

const UNPAID_INVOICE_STATUSES = new Set(["ISSUED", "OVERDUE"]);

function serviceName(serviceId: string): string {
  return SERVICES.find((s) => s.id === serviceId)?.name ?? serviceId;
}

function routeLabel(s: ShipmentSummary): string {
  const origin = s.senderAddressSnapshot?.city ?? s.senderAddressSnapshot?.countryCode ?? "Italy";
  const dest = s.receiverAddressSnapshot?.city ?? s.receiverAddressSnapshot?.countryCode ?? "United States";
  return `${origin} → ${dest}`;
}

export default async function CustomerPortal() {
  const [data, t] = await Promise.all([getPortalDashboardData(), getTranslations("Portal")]);
  // portal/layout.tsx already verified the session before rendering this
  // page - a null result here means the token expired between the layout
  // check and this fetch (a narrow race, not the common case).
  if (!data) redirect("/signin?sessionExpired=1");

  const { profile, shipments, invoices, claims, documents, upcomingPickups, upcomingDeliveries } = data;

  const activeShipments = shipments.filter(
    (s) => s.lifecycleStatus === "ACTIVE" || s.lifecycleStatus === "ACTION_REQUIRED"
  );
  const actionRequiredShipments = shipments.filter((s) => s.lifecycleStatus === "ACTION_REQUIRED");
  const unpaidInvoices = invoices.filter((i) => UNPAID_INVOICE_STATUSES.has(i.status));
  const shipmentsWithOutstanding = shipments.filter((s) => Number(s.outstandingAmountMinorUnits) > 0);
  const hasBillingAction = unpaidInvoices.length > 0 || shipmentsWithOutstanding.length > 0;
  const destinationCountries = Array.from(
    new Set(activeShipments.map((s) => s.receiverAddressSnapshot?.countryCode).filter(Boolean))
  ) as string[];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 42. Action-required banner, if any. */}
      {(actionRequiredShipments.length > 0 || hasBillingAction) && (
        <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-xl flex flex-col gap-3 text-amber-950 text-sm">
          {actionRequiredShipments.map((s) => (
            <div key={s.id} className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>{s.trackingNumber}</strong> {t("actionRequiredPrefix")} {s.actionRequiredReason ?? t("actionRequired")}.{" "}
                <Link href={`/tracking?id=${s.trackingNumber}`} className="underline font-semibold">
                  {t("viewShipment")}
                </Link>
              </span>
            </div>
          ))}
          {hasBillingAction && (
            <div className="flex items-start gap-3">
              <Receipt className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>{t("outstandingCharges", { count: unpaidInvoices.length || shipmentsWithOutstanding.length })}</span>
            </div>
          )}
        </div>
      )}

      {/* 43. Greeting and New Shipment/Get Quote actions. */}
      <div className="bg-[#081F3D] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">{t("welcomeBack", { name: profile.fullName.split(" ")[0] })}</h1>
            {profile.status === "ACTIVE" && (
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {t("verified")}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-1">{profile.email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/quote"
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-xs border border-white/20"
          >
            {t("getQuote")}
          </Link>
          <Link
            href="/portal/bookings/new"
            className="bg-[#F28C18] hover:bg-[#d97c14] text-[#081F3D] font-extrabold px-5 py-2.5 rounded-xl transition-colors text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {t("newShipment")}
          </Link>
        </div>
      </div>

      {/* 44. Active shipments with status, ETA and next action. */}
      <section aria-labelledby="active-shipments-heading">
        <h2 id="active-shipments-heading" className="text-sm font-extrabold text-[#081F3D] uppercase tracking-wide mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" /> {t("activeShipmentsHeading")}
        </h2>
        {activeShipments.length === 0 ? (
          <EmptyState
            message={t("noActiveShipments")}
            action={{ href: "/quote", label: t("getQuoteToBookOne") }}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {activeShipments.map((s) => (
              <div key={s.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-black text-base text-[#081F3D]">{s.trackingNumber}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        s.lifecycleStatus === "ACTION_REQUIRED"
                          ? "bg-amber-500 text-white"
                          : "bg-[#F28C18] text-[#081F3D]"
                      }`}
                    >
                      {s.lifecycleStatus === "ACTION_REQUIRED" ? t("actionRequiredBadge") : t("inProgressBadge")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {serviceName(s.serviceId)} &bull; {routeLabel(s)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {t("estimatedDelivery")} {formatDateRange(s.estimatedDeliveryFrom, s.estimatedDeliveryTo)}
                  </p>
                </div>
                <Link
                  href={`/tracking?id=${s.trackingNumber}`}
                  className="bg-[#081F3D] hover:bg-[#0B2E5E] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                >
                  {t("trackShipment")} <ArrowRight className="w-3.5 h-3.5 text-[#F28C18]" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 45. Upcoming pickup or delivery cards. */}
      <section aria-labelledby="pickups-heading">
        <h2 id="pickups-heading" className="text-sm font-extrabold text-[#081F3D] uppercase tracking-wide mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4" /> {t("pickupsHeading")}
        </h2>
        {upcomingPickups.length === 0 && upcomingDeliveries.length === 0 ? (
          <EmptyState message={t("nothingScheduled")} />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {upcomingPickups.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 text-xs">
                <p className="font-bold text-[#081F3D]">{p.status === "SCHEDULED" ? t("pickupScheduled") : t("pickupRequested")}</p>
                <p className="text-slate-500 mt-1">{formatDateRange(p.windowStart, p.windowEnd)}</p>
              </div>
            ))}
            {upcomingDeliveries.map((d) => (
              <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-4 text-xs">
                <p className="font-bold text-[#081F3D]">
                  {d.status === "OUT_FOR_DELIVERY" ? t("deliveryOutForDelivery") : t("deliveryScheduled")}
                </p>
                <p className="text-slate-500 mt-1">{formatDateRange(d.windowStart, d.windowEnd)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 46. Unpaid or customs charges. */}
      <section aria-labelledby="charges-heading">
        <h2 id="charges-heading" className="text-sm font-extrabold text-[#081F3D] uppercase tracking-wide mb-3 flex items-center gap-2">
          <Receipt className="w-4 h-4" /> {t("chargesHeading")}
        </h2>
        {unpaidInvoices.length === 0 && shipmentsWithOutstanding.length === 0 ? (
          <EmptyState message={t("noOutstandingBalances")} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {unpaidInvoices.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#081F3D]">{inv.invoiceNumber}</p>
                  <p className="text-slate-500">{inv.status === "OVERDUE" ? t("overdue") : t("due")} {inv.dueAt ? formatDate(inv.dueAt) : ""}</p>
                </div>
                <span className="font-bold text-amber-700">{formatMoney(inv.totalAmountMinorUnits, inv.currency)}</span>
              </div>
            ))}
            {shipmentsWithOutstanding.map((s) => (
              <div key={s.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#081F3D]">{s.trackingNumber}</p>
                  <p className="text-slate-500">{t("customsBalance")}</p>
                </div>
                <span className="font-bold text-amber-700">{formatMoney(s.outstandingAmountMinorUnits, s.currency)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 47. Recent documents and invoices. */}
      <section aria-labelledby="documents-heading" className="grid sm:grid-cols-2 gap-6">
        <div>
          <h2 id="documents-heading" className="text-sm font-extrabold text-[#081F3D] uppercase tracking-wide mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" /> {t("documentsHeading")}
          </h2>
          {documents.length === 0 ? (
            <EmptyState message={t("noDocuments")} note={t("uploadUnavailable")} />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              {documents.slice(0, 5).map((d) => (
                <div key={d.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#081F3D]">{d.type.replace(/_/g, " ")}</p>
                    <p className="text-slate-500">{formatDate(d.createdAt)}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      d.reviewStatus === "APPROVED"
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                        : "text-slate-500 bg-slate-50 border-slate-200"
                    }`}
                  >
                    {d.reviewStatus === "PROCESSING" ? t("processing") : d.reviewStatus.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-[#081F3D] uppercase tracking-wide mb-3 flex items-center gap-2">
            <Receipt className="w-4 h-4" /> {t("invoicesHeading")}
          </h2>
          {invoices.length === 0 ? (
            <EmptyState message={t("noInvoices")} />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              {invoices.slice(0, 5).map((inv) => (
                <div key={inv.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#081F3D]">{inv.invoiceNumber}</p>
                    <p className="text-slate-500">{inv.issuedAt ? formatDate(inv.issuedAt) : t("draft")}</p>
                  </div>
                  <span className="font-bold text-[#081F3D]">{formatMoney(inv.totalAmountMinorUnits, inv.currency)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 48. Recent support/claim updates. */}
      <section aria-labelledby="claims-heading">
        <h2 id="claims-heading" className="text-sm font-extrabold text-[#081F3D] uppercase tracking-wide mb-3 flex items-center gap-2">
          <LifeBuoy className="w-4 h-4" /> {t("claimsHeading")}
        </h2>
        {claims.length === 0 ? (
          <EmptyState message={t("noClaims")} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {claims.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#081F3D]">{c.reasonCategory.replace(/_/g, " ")} {t("claimSuffix")}</p>
                  <p className="text-slate-500">{t("updated")} {formatDate(c.updatedAt)}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold border text-slate-600 bg-slate-50 border-slate-200">
                  {c.status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 49. Helpful route/customs guidance based on active shipments. */}
      {destinationCountries.length > 0 && (
        <section aria-labelledby="guidance-heading" className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h2 id="guidance-heading" className="text-sm font-extrabold text-[#081F3D] uppercase tracking-wide mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4" /> {t("guidanceHeading")}
          </h2>
          <p className="text-sm text-slate-600">
            {t("guidanceBody", { countries: destinationCountries.join(", ") })}{" "}
            <Link href="/customs" className="text-[#081F3D] font-medium hover:underline">
              {t("guidanceLink")}
            </Link>{" "}
            {t("guidanceSuffix")}
          </p>
        </section>
      )}
    </div>
  );
}

function EmptyState({ message, action, note }: { message: string; action?: { href: string; label: string }; note?: string }) {
  return (
    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
      <p className="text-sm text-slate-500">{message}</p>
      {note && <p className="text-xs text-slate-400 mt-1">{note}</p>}
      {action && (
        <Link href={action.href} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#081F3D] hover:underline">
          {action.label} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AlertTriangle, ArrowRight, Package, Plus, ShieldCheck } from "lucide-react";
import { getPortalDashboardData, type ShipmentSummary } from "@/lib/portal-data.server";
import { formatDateRange } from "./format";
import { PayInvoiceButton } from "./PayInvoiceButton";

const SERVICE_NAMES: Record<string, string> = {
  "air-express": "Air Express",
  "air-economy": "Air Economy",
  "ocean-freight": "Ocean Freight (LCL)",
};

function routeLabel(shipment: ShipmentSummary): string {
  const origin = shipment.senderAddressSnapshot?.city ?? shipment.senderAddressSnapshot?.countryCode ?? "Origin";
  const destination = shipment.receiverAddressSnapshot?.city ?? shipment.receiverAddressSnapshot?.countryCode ?? "Destination";
  return `${origin} → ${destination}`;
}

export default async function CustomerPortal() {
  const [data, t] = await Promise.all([getPortalDashboardData(), getTranslations("Portal")]);
  if (!data) redirect("/signin?sessionExpired=1");

  const activeShipments = data.shipments.filter(
    (shipment) => shipment.lifecycleStatus === "ACTIVE" || shipment.lifecycleStatus === "ACTION_REQUIRED",
  );
  const actionRequired = activeShipments.filter((shipment) => shipment.lifecycleStatus === "ACTION_REQUIRED");
  const unpaidInvoices = data.invoices.filter((invoice) => invoice.status === "ISSUED" || invoice.status === "PARTIALLY_PAID");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {actionRequired.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-xl space-y-3 text-amber-950 text-sm">
          {actionRequired.map((shipment) => (
            <div key={shipment.id} className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>{shipment.trackingNumber}</strong> {t("actionRequiredPrefix")}{" "}
                {shipment.actionRequiredReason ?? t("actionRequired")}.{" "}
                <Link href={`/tracking?id=${shipment.trackingNumber}`} className="underline font-semibold">
                  {t("viewShipment")}
                </Link>
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#081F3D] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">
              {t("welcomeBack", { name: data.profile.fullName.split(" ")[0] })}
            </h1>
            {data.profile.status === "ACTIVE" && (
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {t("verified")}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-1">{data.profile.email}</p>
        </div>
        <Link href="/portal/bookings/new" className="bg-[#F28C18] hover:bg-[#d97c14] text-[#081F3D] font-extrabold px-5 py-2.5 rounded-xl transition-colors text-xs flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t("newShipment")}
        </Link>
      </div>

      <section aria-labelledby="active-shipments-heading">
        <h2 id="active-shipments-heading" className="text-sm font-extrabold text-[#081F3D] uppercase tracking-wide mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" /> {t("activeShipmentsHeading")}
        </h2>
        {activeShipments.length === 0 ? (
          <EmptyState message={t("noActiveShipments")} action={{ href: "/portal/bookings/new", label: t("newShipment") }} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {activeShipments.map((shipment) => (
              <div key={shipment.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-black text-base text-[#081F3D]">{shipment.trackingNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${shipment.lifecycleStatus === "ACTION_REQUIRED" ? "bg-amber-500 text-white" : "bg-[#F28C18] text-[#081F3D]"}`}>
                      {shipment.lifecycleStatus === "ACTION_REQUIRED" ? t("actionRequiredBadge") : t("inProgressBadge")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {SERVICE_NAMES[shipment.serviceId] ?? shipment.serviceId} &bull; {routeLabel(shipment)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {t("estimatedDelivery")} {formatDateRange(shipment.estimatedDeliveryFrom, shipment.estimatedDeliveryTo)}
                  </p>
                </div>
                <Link href={`/tracking?id=${shipment.trackingNumber}`} className="bg-[#081F3D] hover:bg-[#0B2E5E] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0">
                  {t("trackShipment")} <ArrowRight className="w-3.5 h-3.5 text-[#F28C18]" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {unpaidInvoices.length > 0 && <section aria-labelledby="payment-heading">
        <h2 id="payment-heading" className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[#081F3D]">Payment required</h2>
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-amber-300 bg-white shadow-sm">
          {unpaidInvoices.map((invoice) => <div key={invoice.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div><p className="font-bold text-[#081F3D]">Invoice {invoice.invoiceNumber}</p><p className="mt-1 text-xs text-slate-500">Pay this invoice to receive your tracking number.</p><p className="mt-2 text-lg font-black text-[#081F3D]">{new Intl.NumberFormat("en", { style: "currency", currency: invoice.currency }).format(Number(invoice.totalAmountMinorUnits) / 100)}</p></div>
            <PayInvoiceButton invoiceId={invoice.id} />
          </div>)}
        </div>
      </section>}

      <section aria-labelledby="shipment-requests-heading">
        <h2 id="shipment-requests-heading" className="text-sm font-extrabold text-[#081F3D] uppercase tracking-wide mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" /> Shipment requests
        </h2>
        {data.requests.filter((request) => request.requestStatus !== "CONVERTED").length === 0 ? (
          <EmptyState message="No shipment requests are awaiting review." />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {data.requests.filter((request) => request.requestStatus !== "CONVERTED").map((request) => (
              <div key={request.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[#081F3D]">{request.draftDataJson.goodsDescription ?? "Shipment request"}</p>
                  <p className="mt-1 text-xs text-slate-500">{request.draftDataJson.serviceId?.replace(/_/g, " ") ?? "Service pending"}</p>
                  {request.decisionReason && <p className="mt-2 text-xs text-red-700">{request.decisionReason}</p>}
                </div>
                <span className={`self-start rounded-full px-3 py-1 text-[10px] font-extrabold ${request.requestStatus === "REJECTED" ? "bg-red-100 text-red-800" : request.requestStatus === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  {request.requestStatus.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ message, action }: { message: string; action?: { href: string; label: string } }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
      <p>{message}</p>
      {action && <Link href={action.href} className="inline-flex mt-3 font-bold text-[#0B2E5E] hover:underline">{action.label}</Link>}
    </div>
  );
}

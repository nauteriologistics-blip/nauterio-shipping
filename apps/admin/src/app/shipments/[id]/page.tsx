"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";

interface TrackingEvent {
  id: string;
  canonicalCode: string;
  publicTitleEn: string;
  eventTime: string;
  visibility: string;
}

interface ShipmentDetail {
  id: string;
  trackingNumber: string;
  lifecycleStatus: string;
  senderNameSnapshot: string;
  senderAddressSnapshot: { city?: string; countryCode?: string; line1?: string };
  receiverNameSnapshot: string;
  receiverAddressSnapshot: { city?: string; countryCode?: string; line1?: string };
  totalChargeableWeightKg: number;
  totalAmountMinorUnits: string;
  currency: string;
  declaredValueAmountMinorUnits: string;
  declaredValueCurrency: string;
  actionRequiredReason: string | null;
  trackingEvents: TrackingEvent[];
}

export default function ShipmentDetailPage() {
  const params = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<ShipmentDetail>(`/shipments/${params.id}`)
      .then(setShipment)
      .catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 404) {
          setError("Shipment not found.");
        } else if (e instanceof ApiError && e.status === 403) {
          setError("You do not have permission to view this shipment.");
        } else {
          setError("Could not load this shipment.");
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminShell>
      <Link href="/shipments" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#081F3D]">
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        Back to shipments
      </Link>

      {loading && (
        <p className="mt-6 text-sm text-slate-500" role="status">
          Loading shipment...
        </p>
      )}

      {error && !loading && (
        <p className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 max-w-md" role="alert">
          {error}
        </p>
      )}

      {shipment && !loading && (
        <div className="mt-4 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-[#081F3D] font-mono">{shipment.trackingNumber}</h1>
            <p className="text-sm text-slate-500 mt-1">{shipment.lifecycleStatus.replace(/_/g, " ")}</p>
            {shipment.actionRequiredReason && (
              <p className="mt-2 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-3 py-2 max-w-lg">
                {shipment.actionRequiredReason}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">Sender</p>
              <p className="mt-1 text-sm font-medium text-[#081F3D]">{shipment.senderNameSnapshot}</p>
              <p className="text-sm text-slate-600">
                {shipment.senderAddressSnapshot.line1}, {shipment.senderAddressSnapshot.city}, {shipment.senderAddressSnapshot.countryCode}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">Receiver</p>
              <p className="mt-1 text-sm font-medium text-[#081F3D]">{shipment.receiverNameSnapshot}</p>
              <p className="text-sm text-slate-600">
                {shipment.receiverAddressSnapshot.line1}, {shipment.receiverAddressSnapshot.city}, {shipment.receiverAddressSnapshot.countryCode}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Chargeable weight" value={`${shipment.totalChargeableWeightKg.toFixed(2)} kg`} />
            <Stat label="Total" value={`${(Number(shipment.totalAmountMinorUnits) / 100).toFixed(2)} ${shipment.currency}`} />
            <Stat
              label="Declared value"
              value={`${(Number(shipment.declaredValueAmountMinorUnits) / 100).toFixed(2)} ${shipment.declaredValueCurrency}`}
            />
          </div>

          <div>
            <h2 className="text-sm font-bold text-[#081F3D] uppercase">Tracking history</h2>
            {shipment.trackingEvents.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No tracking events recorded yet.</p>
            ) : (
              <ol className="mt-3 space-y-2">
                {shipment.trackingEvents.map((e) => (
                  <li key={e.id} className="bg-white rounded-lg border border-slate-200 px-4 py-2.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-[#081F3D]">{e.publicTitleEn}</span>
                    <span className="text-slate-500 font-mono text-xs">{new Date(e.eventTime).toLocaleString()}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-base font-bold text-[#081F3D] font-mono">{value}</p>
    </div>
  );
}

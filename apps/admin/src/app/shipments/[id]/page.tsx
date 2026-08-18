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

interface TrackingStatusOption {
  code: string;
  labelEn: string;
  requiresReason?: boolean;
  requiresEvidence?: boolean;
  allowedForNewEvent: boolean;
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
  operationalHold: boolean;
  holdReason: string | null;
  trackingEvents: TrackingEvent[];
  documents: Array<{ id: string; type: string; reviewStatus: string }>;
}

export default function ShipmentDetailPage() {
  const params = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<TrackingStatusOption[]>([]);
  const [statusCode, setStatusCode] = useState("");
  const [eventTime, setEventTime] = useState(() => toLocalDateTime(new Date()));
  const [city, setCity] = useState("");
  const [facility, setFacility] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [evidenceDocumentId, setEvidenceDocumentId] = useState("");
  const [correctionEventId, setCorrectionEventId] = useState<string | null>(null);
  const [savingEvent, setSavingEvent] = useState(false);

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

  useEffect(() => {
    apiFetch<TrackingStatusOption[]>(`/admin/shipments/${params.id}/tracking-events/statuses`)
      .then((options) => { setStatuses(options); setStatusCode(options.find((option) => option.allowedForNewEvent)?.code ?? options[0]?.code ?? ""); })
      .catch(() => setError("Could not load tracking status options."));
  }, [params.id]);

  async function saveTrackingEvent() {
    if (!statusCode) return;
    setSavingEvent(true);
    setError(null);
    try {
      const path = correctionEventId
        ? `/admin/shipments/${params.id}/tracking-events/${correctionEventId}/corrections`
        : `/admin/shipments/${params.id}/tracking-events`;
      await apiFetch(path, {
        method: "POST",
        headers: { "Idempotency-Key": `tracking-${correctionEventId ?? "add"}-${params.id}-${Date.now()}` },
        body: JSON.stringify({
          canonicalCode: statusCode,
          eventTime: new Date(eventTime).toISOString(),
          location: { ...(city.trim() ? { city: city.trim() } : {}), ...(facility.trim() ? { facility: facility.trim() } : {}) },
          ...(description.trim() ? { publicDescription: description.trim() } : {}),
          ...(reason.trim() ? { reason: reason.trim() } : {}),
          ...(evidenceDocumentId.trim() ? { evidenceDocumentId: evidenceDocumentId.trim() } : {}),
          ...(correctionEventId ? { correctionReason: reason.trim() || "Corrected by operations" } : {}),
        }),
      });
      const refreshed = await apiFetch<ShipmentDetail>(`/shipments/${params.id}`);
      setShipment(refreshed);
      setCorrectionEventId(null);
      setDescription(""); setReason(""); setEvidenceDocumentId("");
      setEventTime(toLocalDateTime(new Date()));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.body.message : "Could not save tracking event.");
    } finally {
      setSavingEvent(false);
    }
  }

  async function toggleHold() {
    if (!shipment) return;
    const hold = !shipment.operationalHold;
    const reason = hold ? window.prompt("Why is this shipment being placed on hold? This is shown to the customer.")?.trim() : undefined;
    if (hold && !reason) return;
    try {
      const updated = await apiFetch<ShipmentDetail>(`/admin/shipments/${params.id}/${hold ? "hold" : "release-hold"}`, { method: "POST", headers: { "Idempotency-Key": `hold-${params.id}-${hold}-${Date.now()}` }, body: JSON.stringify(hold ? { reason } : {}) });
      setShipment(updated);
    } catch (cause) { setError(cause instanceof ApiError ? cause.body.message : "Could not update shipment hold."); }
  }

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
          <div className="flex items-start justify-between gap-4">
            <div>
            <h1 className="text-xl font-bold text-[#081F3D] font-mono">{shipment.trackingNumber}</h1>
            <p className="text-sm text-slate-500 mt-1">{shipment.lifecycleStatus.replace(/_/g, " ")}</p>
            {shipment.actionRequiredReason && (
              <p className="mt-2 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-3 py-2 max-w-lg">
                {shipment.actionRequiredReason}
              </p>
            )}
            </div>
            {!(["DELIVERED", "CANCELLED", "ARCHIVED"].includes(shipment.lifecycleStatus)) && <button onClick={() => void toggleHold()} className={`rounded-lg px-4 py-2 text-xs font-bold ${shipment.operationalHold ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{shipment.operationalHold ? "Release hold" : "Place on hold"}</button>}
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

          {shipment.lifecycleStatus !== "ARCHIVED" && !shipment.operationalHold && (
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-bold uppercase text-[#081F3D]">{correctionEventId ? "Correct latest event" : "Record shipment movement"}</h2>
                {correctionEventId && <button onClick={() => setCorrectionEventId(null)} className="text-xs font-semibold text-slate-500 hover:underline">Cancel correction</button>}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-slate-600">Status
                  <select value={statusCode} onChange={(event) => setStatusCode(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {statuses.map((status) => <option key={status.code} value={status.code} disabled={!correctionEventId && !status.allowedForNewEvent}>{status.labelEn}{status.requiresEvidence ? " (evidence required)" : ""}</option>)}
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-600">Event time
                  <input type="datetime-local" value={eventTime} onChange={(event) => setEventTime(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </label>
                <label className="text-xs font-semibold text-slate-600">City
                  <input value={city} onChange={(event) => setCity(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </label>
                <label className="text-xs font-semibold text-slate-600">Facility
                  <input value={facility} onChange={(event) => setFacility(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </label>
                <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Customer-facing description
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </label>
                <label className="text-xs font-semibold text-slate-600">Reason {statuses.find((status) => status.code === statusCode)?.requiresReason ? "(required)" : ""}
                  <input value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </label>
                <label className="text-xs font-semibold text-slate-600">Evidence document {statuses.find((status) => status.code === statusCode)?.requiresEvidence ? "(required)" : ""}
                  <select value={evidenceDocumentId} onChange={(event) => setEvidenceDocumentId(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    <option value="">Select approved document</option>
                    {shipment.documents.map((document) => <option key={document.id} value={document.id}>{document.type.replace(/_/g, " ")} · {document.id.slice(0, 8)}</option>)}
                  </select>
                </label>
              </div>
              <button onClick={() => void saveTrackingEvent()} disabled={savingEvent || !statusCode} className="mt-4 rounded-lg bg-[#F28C18] px-5 py-2.5 text-sm font-bold text-[#081F3D] disabled:opacity-50">
                {savingEvent ? "Saving…" : correctionEventId ? "Save correction" : "Add tracking event"}
              </button>
            </section>
          )}

          <div>
            <h2 className="text-sm font-bold text-[#081F3D] uppercase">Tracking history</h2>
            {shipment.trackingEvents.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No tracking events recorded yet.</p>
            ) : (
              <ol className="mt-3 space-y-2">
                {shipment.trackingEvents.map((e, index) => (
                  <li key={e.id} className="bg-white rounded-lg border border-slate-200 px-4 py-2.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-[#081F3D]">{e.publicTitleEn}</span>
                    <span className="flex items-center gap-3 text-slate-500 font-mono text-xs">
                      {new Date(e.eventTime).toLocaleString()}
                      {index === 0 && shipment.lifecycleStatus !== "ARCHIVED" && <button onClick={() => { setCorrectionEventId(e.id); setStatusCode(e.canonicalCode); setReason(""); }} className="font-sans font-semibold text-[#0B2E5E] hover:underline">Correct</button>}
                    </span>
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

function toLocalDateTime(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-base font-bold text-[#081F3D] font-mono">{value}</p>
    </div>
  );
}

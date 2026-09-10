"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Truck, MapPin, CheckCircle2, PenTool, Loader2, AlertCircle, Package } from "lucide-react";
import { getCsrfToken } from "@/lib/auth";
import { CSRF_HEADER } from "@/lib/session";

interface ShipmentSummary {
  id: string;
  trackingNumber: string;
  receiverNameSnapshot: string;
  receiverAddressSnapshot: { line1?: string; city?: string; state?: string; postalCode?: string; countryCode?: string } | null;
  lifecycleStatus: string;
  deliveryStatus: "SCHEDULED" | "OUT_FOR_DELIVERY";
}

interface DeliveryAssignment {
  id: string;
  status: "SCHEDULED" | "OUT_FOR_DELIVERY";
  shipment: Omit<ShipmentSummary, "deliveryStatus">;
}

export default function DriverPWA() {
  const t = useTranslations("DriverPage");
  const [signedName, setSignedName] = useState<string>("");
  const [deliveredSuccess, setDeliveredSuccess] = useState<boolean>(false);
  const [confirming, setConfirming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // The API returns only deliveries assigned to the signed-in driver.
  const [shipments, setShipments] = useState<ShipmentSummary[]>([]);
  const [loadingShipments, setLoadingShipments] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentSummary | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await fetch("/api/v1/driver/deliveries");
        if (!res.ok) throw new Error("Assigned deliveries could not be loaded.");
        const assignments = (await res.json()) as DeliveryAssignment[];
        const assignedShipments = assignments.map(({ shipment, status }) => ({ ...shipment, deliveryStatus: status }));
        setShipments(assignedShipments);
        if (assignedShipments.length > 0) setSelectedShipment(assignedShipments[0]);
      } catch {
        setError("Assigned deliveries could not be loaded. Please try again.");
      } finally {
        setLoadingShipments(false);
      }
    };
    fetchShipments();
  }, []);

  const handleConfirmDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) {
      setError("No shipment selected for delivery.");
      return;
    }
    if (!signedName.trim()) {
      setError("Recipient name is required for proof of delivery.");
      return;
    }
    setConfirming(true);
    setError(null);

    try {
      const deliveryRes = await fetch(`/api/v1/shipments/${selectedShipment.id}/pickup-delivery/delivery-confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": `delivery-confirm-${selectedShipment.id}`,
          [CSRF_HEADER]: getCsrfToken() ?? "",
        },
        body: JSON.stringify({ recipientName: signedName.trim() }),
      });
      if (!deliveryRes.ok) {
        const body = await deliveryRes.json().catch(() => null);
        throw new Error(body?.message || `Delivery could not be recorded (${deliveryRes.status})`);
      }

      setDeliveredSuccess(true);
      setTimeout(() => {
        setDeliveredSuccess(false);
        // Remove from active list
        setShipments((prev) => prev.filter((s) => s.id !== selectedShipment.id));
        setSelectedShipment(null);
        setSignedName("");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm delivery");
    } finally {
      setConfirming(false);
    }
  };

  const formatAddress = (addr: ShipmentSummary["receiverAddressSnapshot"]) => {
    if (!addr) return "Address not available";
    const parts = [addr.line1, addr.city, addr.state, addr.postalCode, addr.countryCode].filter(Boolean);
    return parts.join(", ");
  };

  const activeShipments = shipments;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

      {/* PWA Mobile Header */}
      <div className="bg-[#081F3D] text-white p-5 rounded-2xl border border-blue-900 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2E5E] flex items-center justify-center text-[#F28C18]">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">{t("headerTitle")}</h1>
            <p className="text-[11px] text-slate-300">{t("headerSubtitle")}</p>
          </div>
        </div>
        <span className="bg-blue-500/20 text-blue-200 text-[10px] font-mono px-2 py-1 rounded border border-blue-400/40">
          {t("assignedWork")}
        </span>
      </div>

      {error && !selectedShipment && (
        <div className="bg-red-50 text-red-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200" role="alert">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          {error}
        </div>
      )}

      {/* DELIVERY TASK DETAILS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
          {loadingShipments ? (
            <div className="flex items-center justify-center py-8 gap-2 text-slate-400 text-sm">
              <Loader2 className="w-5 h-5 animate-spin" /> {t("loading")}
            </div>
          ) : error ? null : activeShipments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              {t("noAssignments")}
            </div>
          ) : (
            <>
              {/* Shipment selector */}
              {activeShipments.length > 1 && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081F3D]">{t("selectDelivery")}</label>
                  <select
                    value={selectedShipment?.id || ""}
                    onChange={(e) => setSelectedShipment(activeShipments.find((s) => s.id === e.target.value) || null)}
                    className="w-full bg-[#F3F6FA] font-mono text-xs font-bold rounded-xl px-3 py-2.5 border border-slate-200"
                  >
                    {activeShipments.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.trackingNumber} — {s.receiverNameSnapshot}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedShipment && (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-mono font-black text-[#081F3D]">{selectedShipment.trackingNumber}</span>
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {selectedShipment.deliveryStatus === "OUT_FOR_DELIVERY" ? t("outForDelivery") : t("scheduled")}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#F28C18] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#081F3D] block text-sm">{selectedShipment.receiverNameSnapshot}</span>
                        <span className="text-slate-500">{formatAddress(selectedShipment.receiverAddressSnapshot)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recipient confirmation */}
                  <form onSubmit={(e) => void handleConfirmDelivery(e)} className="space-y-4 pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-extrabold text-[#081F3D] flex items-center gap-1.5">
                      <PenTool className="w-4 h-4 text-[#F28C18]" /> {t("signatureHeading")}
                    </h3>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">{t("recipientNameLabel")}</label>
                      <input
                        type="text"
                        value={signedName}
                        onChange={(e) => setSignedName(e.target.value)}
                        placeholder={t("recipientNamePlaceholder")}
                        className="w-full bg-[#F3F6FA] text-xs font-bold text-[#081F3D] rounded-xl px-3 py-2 border border-slate-200"
                      />
                    </div>

                    <div className="border-2 border-slate-300 rounded-xl bg-slate-50 p-6 text-center space-y-1 relative">
                      <span className="text-slate-400 text-xs font-serif italic block select-none">
                        {signedName || t("signPrompt")}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{t("signInsideBox")}</span>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        {error}
                      </div>
                    )}

                    {deliveredSuccess && (
                      <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        {t("deliveredSuccess")}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={confirming}
                      className="w-full bg-[#F28C18] hover:bg-[#D97706] text-[#081F3D] font-black py-3.5 px-4 rounded-xl transition-colors text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {confirming ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {t("confirming")}</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /> {t("confirmDelivery")}</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
      </div>

    </div>
  );
}

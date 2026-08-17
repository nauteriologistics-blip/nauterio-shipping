"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Truck, MapPin, CheckCircle2, Phone, PenTool, Loader2, AlertCircle, Package } from "lucide-react";
import { getCsrfToken } from "@/lib/auth";
import { CSRF_HEADER } from "@/lib/session";

interface ShipmentSummary {
  id: string;
  trackingNumber: string;
  receiverNameSnapshot: string;
  receiverAddressSnapshot: { line1?: string; city?: string; state?: string; postalCode?: string; countryCode?: string } | null;
  lifecycleStatus: string;
}

export default function DriverPWA() {
  const t = useTranslations("DriverPage");
  const [activeTask, setActiveTask] = useState<"pickup" | "delivery">("delivery");
  const [signedName, setSignedName] = useState<string>("");
  const [deliveredSuccess, setDeliveredSuccess] = useState<boolean>(false);
  const [confirming, setConfirming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active shipments for driver
  const [shipments, setShipments] = useState<ShipmentSummary[]>([]);
  const [loadingShipments, setLoadingShipments] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentSummary | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await fetch("/api/v1/shipments?limit=20");
        if (res.ok) {
          const data = (await res.json()) as { items: ShipmentSummary[] };
          setShipments(data.items || []);
          const activeShipments = (data.items || []).filter(
            (s: ShipmentSummary) => s.lifecycleStatus === "ACTIVE"
          );
          if (activeShipments.length > 0) setSelectedShipment(activeShipments[0]);
        }
      } catch {
        // May not be available if not authenticated as staff
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

  const activeShipments = shipments.filter((s) => s.lifecycleStatus === "ACTIVE");

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
        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-1 rounded border border-emerald-500/40">
          {t("gpsLive")}
        </span>
      </div>

      {/* Task Toggle */}
      <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-xl border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTask("pickup")}
          className={`py-2.5 rounded-lg transition-colors ${
            activeTask === "pickup" ? "bg-[#081F3D] text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t("pickupTab")}
        </button>
        <button
          onClick={() => setActiveTask("delivery")}
          className={`py-2.5 rounded-lg transition-colors ${
            activeTask === "delivery" ? "bg-[#081F3D] text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t("deliveryTab")}
        </button>
      </div>

      {/* DELIVERY TASK DETAILS */}
      {activeTask === "delivery" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
          {loadingShipments ? (
            <div className="flex items-center justify-center py-8 gap-2 text-slate-400 text-sm">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading shipments…
            </div>
          ) : activeShipments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              No active deliveries assigned
            </div>
          ) : (
            <>
              {/* Shipment selector */}
              {activeShipments.length > 1 && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081F3D]">Select Delivery</label>
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
                      {t("outForDelivery")}
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

                  {/* Signature Capture */}
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
                        placeholder="Enter recipient's full name"
                        className="w-full bg-[#F3F6FA] text-xs font-bold text-[#081F3D] rounded-xl px-3 py-2 border border-slate-200"
                      />
                    </div>

                    {/* Signature Box */}
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
                        <><Loader2 className="w-4 h-4 animate-spin" /> Confirming…</>
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
      )}

      {/* PICKUP TASK LIST */}
      {activeTask === "pickup" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4 text-xs">
          <h3 className="font-extrabold text-[#081F3D] text-sm">{t("todaysPickupsHeading")}</h3>

          {loadingShipments ? (
            <div className="flex items-center justify-center py-6 gap-2 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading…
            </div>
          ) : activeShipments.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              No pickups scheduled
            </div>
          ) : (
            activeShipments.map((s) => (
              <div key={s.id} className="p-3 bg-[#F3F6FA] rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-[#081F3D]">
                  <span>{s.trackingNumber}</span>
                  <span className="text-[#F28C18]">{s.receiverNameSnapshot}</span>
                </div>
                <p className="text-slate-500">{formatAddress(s.receiverAddressSnapshot)}</p>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}

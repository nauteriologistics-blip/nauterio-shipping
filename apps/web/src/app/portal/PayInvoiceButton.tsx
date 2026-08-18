"use client";

import { useState } from "react";
import { CSRF_COOKIE, CSRF_HEADER } from "@/lib/session";

function csrfToken(): string {
  return decodeURIComponent(document.cookie.split("; ").find((row) => row.startsWith(`${CSRF_COOKIE}=`))?.split("=")[1] ?? "");
}

export function PayInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/v1/invoices/${invoiceId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json", [CSRF_HEADER]: csrfToken(), "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({ paymentMethod: "CARD" }),
      });
      const body = await response.json() as { clientSecretOrRedirectUrl?: string; message?: string };
      if (!response.ok || !body.clientSecretOrRedirectUrl) throw new Error(body.message ?? "Payment could not be started");
      window.location.assign(body.clientSecretOrRedirectUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Payment could not be started");
      setBusy(false);
    }
  }

  return <div className="text-right"><button onClick={() => void pay()} disabled={busy} className="rounded-xl bg-[#F28C18] px-4 py-2 text-xs font-extrabold text-[#081F3D] disabled:opacity-60">{busy ? "Opening secure checkout…" : "Pay now"}</button>{error && <p className="mt-1 max-w-56 text-xs text-red-700">{error}</p>}</div>;
}

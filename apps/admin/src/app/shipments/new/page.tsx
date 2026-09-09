"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { apiFetch, ApiError } from "@/lib/api";
import { COUNTRY_OPTIONS } from "@/lib/countries";

interface CustomerOption {
  id: string;
  fullName: string;
  email: string;
  status: string;
}

interface CreatedShipment {
  id: string;
  trackingNumber: string;
}

export default function CreateShipmentPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => `manual-shipment-${crypto.randomUUID()}`);

  useEffect(() => {
    apiFetch<CustomerOption[]>("/admin/customers")
      .then((items) => setCustomers(items.filter((customer) => customer.status === "ACTIVE")))
      .catch((cause: unknown) => setError(cause instanceof ApiError ? cause.body.message : "Could not load customer accounts."))
      .finally(() => setLoadingCustomers(false));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    const numericValues = {
      weightKg: Number(value("weightKg")),
      lengthCm: Number(value("lengthCm")),
      widthCm: Number(value("widthCm")),
      heightCm: Number(value("heightCm")),
      declaredValue: Number(value("declaredValue")),
      totalAmount: Number(value("totalAmount")),
    };
    const validationError = validateCommercialValues(numericValues);
    if (validationError) {
      setError(validationError);
      setSubmitting(false);
      return;
    }
    if (value("senderCountry") === value("receiverCountry")) {
      setError("Sender and receiver countries must be different for an international shipment.");
      setSubmitting(false);
      return;
    }
    try {
      const created = await apiFetch<CreatedShipment>("/shipments/admin", {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          ownerUserId: value("ownerUserId"),
          serviceId: value("serviceId"),
          senderName: value("senderName"), senderLine1: value("senderLine1"), senderCity: value("senderCity"),
          senderPostalCode: value("senderPostalCode"), senderCountry: value("senderCountry").toUpperCase(),
          senderPhone: value("senderPhone"), ...(value("senderEmail") ? { senderEmail: value("senderEmail") } : {}),
          receiverName: value("receiverName"), receiverLine1: value("receiverLine1"), receiverCity: value("receiverCity"),
          receiverPostalCode: value("receiverPostalCode"), receiverCountry: value("receiverCountry").toUpperCase(),
          receiverPhone: value("receiverPhone"), ...(value("receiverEmail") ? { receiverEmail: value("receiverEmail") } : {}),
          ...numericValues, currency: value("currency").toUpperCase(),
          ...(value("customerReference") ? { customerReference: value("customerReference") } : {}),
        }),
      });
      router.push(`/shipments/${created.id}`);
    } catch (cause) {
      setError(cause instanceof ApiError ? formatApiError(cause) : "Could not create the shipment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminShell>
      <div className="max-w-5xl">
        <Link href="/shipments" className="text-sm font-semibold text-slate-500 hover:underline">← Back to shipments</Link>
        <h1 className="mt-4 text-2xl font-black text-[#081F3D]">Create shipment & tracking number</h1>
        <p className="mt-1 text-sm text-slate-500">Creates an operational shipment, one package, and its first public tracking event. No online payment is collected.</p>

        {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

        <form onSubmit={(event) => void submit(event)} className="mt-6 space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-[#081F3D]">Customer and service</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Customer"><select name="ownerUserId" required disabled={loadingCustomers} className={inputClass}><option value="">{loadingCustomers ? "Loading customers…" : "Select customer"}</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.fullName} · {customer.email}</option>)}</select></Field>
              <Field label="Service"><select name="serviceId" required className={inputClass}><option value="AIR_EXPRESS">Air Express</option><option value="AIR_ECONOMY">Air Economy</option><option value="OCEAN_FREIGHT">Ocean Freight</option></select></Field>
              <Field label="Customer reference (optional)"><input name="customerReference" maxLength={120} className={inputClass} /></Field>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <AddressSection prefix="sender" title="Sender" defaultCountry="IT" />
            <AddressSection prefix="receiver" title="Receiver" defaultCountry="US" />
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-[#081F3D]">Package and commercial values</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumberField name="weightKg" label="Weight (kg)" min="0.01" max="1000" step="0.01" />
              <NumberField name="lengthCm" label="Length (cm)" min="1" max="500" step="0.1" />
              <NumberField name="widthCm" label="Width (cm)" min="1" max="500" step="0.1" />
              <NumberField name="heightCm" label="Height (cm)" min="1" max="500" step="0.1" />
              <NumberField name="declaredValue" label="Declared value" min="0" max="1000000" step="0.01" />
              <NumberField name="totalAmount" label="Approved shipment total" min="0" max="10000000" step="0.01" />
              <Field label="Currency"><input name="currency" required defaultValue="EUR" minLength={3} maxLength={3} pattern="[A-Za-z]{3}" className={`${inputClass} uppercase`} /></Field>
            </div>
          </section>

          <div className="flex justify-end">
            <button type="submit" disabled={submitting || loadingCustomers || customers.length === 0} className="rounded-lg bg-[#F28C18] px-6 py-3 text-sm font-black text-[#081F3D] disabled:opacity-50">
              {submitting ? "Creating…" : "Generate tracking number"}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}

const inputClass = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#F28C18] focus:ring-2 focus:ring-[#F28C18]/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-slate-600">{label}{children}</label>;
}

function NumberField({ name, label, min, max, step }: { name: string; label: string; min: string; max: string; step: string }) {
  return <Field label={label}><input name={name} type="number" required min={min} max={max} step={step} className={inputClass} /></Field>;
}

function AddressSection({ prefix, title, defaultCountry }: { prefix: "sender" | "receiver"; title: string; defaultCountry: string }) {
  const field = (suffix: string) => `${prefix}${suffix}`;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-bold text-[#081F3D]">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Name"><input name={field("Name")} required maxLength={200} className={inputClass} /></Field>
        <Field label="Phone"><input name={field("Phone")} required minLength={3} maxLength={40} className={inputClass} /></Field>
        <div className="sm:col-span-2"><Field label="Email (optional)"><input name={field("Email")} type="email" maxLength={254} className={inputClass} /></Field></div>
        <div className="sm:col-span-2"><Field label="Street address"><input name={field("Line1")} required maxLength={300} className={inputClass} /></Field></div>
        <Field label="City"><input name={field("City")} required maxLength={120} className={inputClass} /></Field>
        <Field label="Postal code"><input name={field("PostalCode")} required maxLength={30} className={inputClass} /></Field>
        <Field label="Country"><select name={field("Country")} required defaultValue={defaultCountry} className={inputClass}>{COUNTRY_OPTIONS.map((country) => <option key={country.code} value={country.code}>{country.name}</option>)}</select></Field>
      </div>
    </section>
  );
}

interface CommercialValues {
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  declaredValue: number;
  totalAmount: number;
}

function validateCommercialValues(values: CommercialValues): string | null {
  const rules: Array<[keyof CommercialValues, string, number, number]> = [
    ["weightKg", "Weight", 0.01, 1000],
    ["lengthCm", "Length", 1, 500],
    ["widthCm", "Width", 1, 500],
    ["heightCm", "Height", 1, 500],
    ["declaredValue", "Declared value", 0, 1_000_000],
    ["totalAmount", "Approved shipment total", 0, 10_000_000],
  ];
  for (const [field, label, minimum, maximum] of rules) {
    const current = values[field];
    if (!Number.isFinite(current) || current < minimum || current > maximum) {
      return `${label} must be between ${minimum.toLocaleString()} and ${maximum.toLocaleString()}.`;
    }
  }
  return null;
}

function formatApiError(error: ApiError): string {
  const details = error.body.fieldErrors ? Object.values(error.body.fieldErrors).flat() : [];
  return details.length > 0 ? details.join(" ") : error.body.message;
}

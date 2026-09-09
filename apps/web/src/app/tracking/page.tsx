"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Search, MapPin, Package, CheckCircle2, AlertCircle, Clock, ArrowRight } from "lucide-react";

interface TrackingEvent {
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
}

type StatusCategory = "delivered" | "action_required" | "in_progress" | "cancelled";

interface TrackedShipment {
  id: string;
  service: string;
  origin: string;
  destination: string;
  /** Full customer-facing label from the spec's 34-status canonical
   * catalogue (Appendix C) - e.g. "Departed origin country", not a fixed enum. */
  status: string;
  statusCategory: StatusCategory;
  estimatedDelivery: string;
  chargeableWeight: string;
  actionRequired?: string;
  events: TrackingEvent[];
}

const STATUS_CATEGORY_STYLES: Record<StatusCategory, string> = {
  delivered: "bg-green-100 text-green-800",
  in_progress: "bg-orange-100 text-orange-800",
  action_required: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-700",
};

type TrackingLookup =
  | { kind: "found"; shipment: TrackedShipment }
  | { kind: "not_found" }
  | { kind: "unavailable" };

async function fetchShipment(searchId: string): Promise<TrackingLookup> {
  try {
    const res = await fetch(`/api/v1/tracking/${encodeURIComponent(searchId.trim())}`);
    if (res.status === 404) return { kind: "not_found" };
    if (!res.ok) return { kind: "unavailable" };
    return { kind: "found", shipment: (await res.json()) as TrackedShipment };
  } catch {
    return { kind: "unavailable" };
  }
}

function TrackingContent() {
  const t = useTranslations("TrackingPage");
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("id") || "";
  const [query, setQuery] = useState(initialQuery);
  const [shipment, setShipment] = useState<TrackedShipment | null>(null);
  const [lookupUnavailable, setLookupUnavailable] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch whenever the URL's ?id= changes (covers direct links, back/forward,
  // and the sample-ID/search actions below which all update the URL).
  useEffect(() => {
    if (!initialQuery) return;
    let cancelled = false;

    const run = async () => {
      setSearched(true);
      setIsLoading(true);
      setLookupUnavailable(false);
      try {
        const result = await fetchShipment(initialQuery);
        if (!cancelled) {
          setShipment(result.kind === "found" ? result.shipment : null);
          setLookupUnavailable(result.kind === "unavailable");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [initialQuery]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/tracking?id=${encodeURIComponent(query)}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-12 border-b border-slate-300 pb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#a95d14]">{t("eyebrow")}</p>
        <h1 className="mb-6 mt-3 text-4xl font-semibold tracking-tight text-[#10233f]">{t("heroTitle")}</h1>

        <form onSubmit={onSubmit} className="relative flex max-w-2xl items-center">
          <label htmlFor="tracking-search" className="sr-only">{t("trackingNumberLabel")}</label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="tracking-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="block w-full rounded-md border border-slate-300 bg-white py-4 pl-11 pr-32 text-lg focus:border-[#d77718] focus:ring-[#d77718]"
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 rounded-md bg-[#10233f] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#18365e]"
          >
            {t("trackButton")}
          </button>
        </form>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">{t("trackingFormatHint")}</p>
      </div>

      {!searched && !isLoading && <section className="grid gap-8 border-y border-slate-300 bg-[#f7f6f2] p-6 md:grid-cols-2 md:p-8"><div><h2 className="font-semibold text-[#10233f]">{t("whereNumberHeading")}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{t("whereNumberBody")}</p></div><div><h2 className="font-semibold text-[#10233f]">{t("needHelpHeading")}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{t("needHelpBody")} <Link href="/portal/support" className="font-semibold underline">{t("messageSupport")}</Link></p></div></section>}

      {isLoading && (
        <p className="text-center text-gray-500" role="status">{t("loading")}</p>
      )}

      {!isLoading && searched && !shipment && lookupUnavailable && (
        <div className="border-l-4 border-amber-500 bg-amber-50 p-8" role="alert">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-xl font-medium text-amber-900 mb-2">{t("serviceUnavailableTitle")}</h3>
          <p className="text-amber-800">{t("serviceUnavailableBody")}</p>
        </div>
      )}

      {!isLoading && searched && !shipment && !lookupUnavailable && (
        <div className="border-l-4 border-slate-300 bg-slate-50 p-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">{t("notFoundTitle")}</h3>
          <p className="text-gray-500">{t("notFoundBody", { query })}</p>
        </div>
      )}

      {!isLoading && shipment && (
        <div className="space-y-8">
          {shipment.actionRequired && (
            <div className="flex flex-col justify-between gap-4 border-l-4 border-amber-500 bg-amber-50 p-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-medium text-amber-800">{t("actionRequiredTitle")}</h3>
                  <p className="text-amber-700 mt-1">{shipment.actionRequired}</p>
                </div>
              </div>
              <Link href="/portal/documents" className="whitespace-nowrap rounded-md bg-amber-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-amber-700">
                {t("uploadDocument")}
              </Link>
            </div>
          )}

          {/* Status Header Card */}
          <div className="border border-gray-200 bg-white p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{shipment.service}</p>
                <h2 className="text-2xl font-bold text-[#081F3D]">{shipment.id}</h2>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider ${STATUS_CATEGORY_STYLES[shipment.statusCategory]}`}>
                {shipment.status}
              </span>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">{t("originLabel")}</span>
                <span className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  {shipment.origin}
                </span>
              </div>

              <div className="flex-1 px-8 flex items-center justify-center">
                <ArrowRight className="text-gray-300 h-6 w-6" aria-hidden="true" />
              </div>

              <div className="flex flex-col text-right">
                <span className="text-sm text-gray-500 mb-1">{t("destinationLabel")}</span>
                <span className="font-semibold text-gray-900 flex items-center gap-2 justify-end">
                  {shipment.destination}
                  <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              {t("estimatedDeliveryLabel")} <span className="font-medium text-gray-900">{shipment.estimatedDelivery}</span>
            </p>
          </div>

          {/* Timeline */}
          <div className="border border-gray-200 bg-white p-8">
            <h3 className="text-lg font-bold text-[#081F3D] mb-8">{t("historyHeading")}</h3>

            <div className="relative pl-4">
              <div className="absolute top-4 bottom-4 left-[23px] w-0.5 bg-gray-100" aria-hidden="true"></div>
              <div className="space-y-8">
                {shipment.events.map((event, idx) => {
                  const isCurrent = idx === 0;
                  return (
                    <div key={`${event.date}-${event.time}`} className="relative flex gap-6">
                      <div
                        className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 flex-shrink-0"
                        style={{ borderColor: isCurrent ? "#F28C18" : "#e5e7eb" }}
                      >
                        {isCurrent ? (
                          <span className="h-3 w-3 bg-[#F28C18] rounded-full" aria-hidden="true"></span>
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-gray-300" aria-hidden="true" />
                        )}
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-2">
                          <h4 className={`text-lg font-semibold ${isCurrent ? "text-[#081F3D]" : "text-gray-700"}`}>
                            {event.status}
                          </h4>
                          <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {event.date}, {event.time}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  const t = useTranslations("TrackingPage");
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div className="py-24 text-center">{t("loading")}</div>}>
        <TrackingContent />
      </Suspense>
    </div>
  );
}

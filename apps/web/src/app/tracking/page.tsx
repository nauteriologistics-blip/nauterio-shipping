"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
   * catalogue (Appendix C) - e.g. "Departed Italy", not a fixed enum. */
  status: string;
  statusCategory: StatusCategory;
  estimatedDelivery: string;
  chargeableWeight: string;
  actionRequired?: string;
  events: TrackingEvent[];
}

const SAMPLE_IDS = ["NT-782914-US", "NT-902148-US", "NT-112349-US"];

const STATUS_CATEGORY_STYLES: Record<StatusCategory, string> = {
  delivered: "bg-green-100 text-green-800",
  in_progress: "bg-orange-100 text-orange-800",
  action_required: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-700",
};

async function fetchShipment(searchId: string): Promise<TrackedShipment | null> {
  const res = await fetch(`/api/v1/tracking/${encodeURIComponent(searchId.trim())}`);
  if (!res.ok) return null;
  return (await res.json()) as TrackedShipment;
}

function TrackingContent() {
  const t = useTranslations("TrackingPage");
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("id") || "";
  const [query, setQuery] = useState(initialQuery);
  const [shipment, setShipment] = useState<TrackedShipment | null>(null);
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
      try {
        const result = await fetchShipment(initialQuery);
        if (!cancelled) setShipment(result);
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
    <div className="max-w-3xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#081F3D] mb-6">{t("heroTitle")}</h1>

        <form onSubmit={onSubmit} className="relative max-w-xl mx-auto flex items-center">
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
            className="block w-full pl-11 pr-32 py-4 border border-gray-200 rounded-full text-lg focus:ring-[#F28C18] focus:border-[#F28C18] shadow-sm bg-white"
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 bg-[#081F3D] hover:bg-[#081F3D]/90 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            {t("trackButton")}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
          <span className="text-sm text-gray-500 py-1">{t("sampleIdsLabel")}</span>
          {SAMPLE_IDS.map((id) => (
            <button
              key={id}
              onClick={() => {
                setQuery(id);
                router.push(`/tracking?id=${id}`);
              }}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <p className="text-center text-gray-500" role="status">{t("loading")}</p>
      )}

      {!isLoading && searched && !shipment && (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-10 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">{t("notFoundTitle")}</h3>
          <p className="text-gray-500">{t("notFoundBody", { query })}</p>
        </div>
      )}

      {!isLoading && shipment && (
        <div className="space-y-8">
          {shipment.actionRequired && (
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-medium text-amber-800">{t("actionRequiredTitle")}</h3>
                  <p className="text-amber-700 mt-1">{shipment.actionRequired}</p>
                </div>
              </div>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-colors">
                {t("uploadDocument")}
              </button>
            </div>
          )}

          {/* Status Header Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
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
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
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

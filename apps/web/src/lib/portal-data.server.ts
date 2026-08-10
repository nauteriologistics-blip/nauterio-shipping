import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";

const apiOrigin = process.env.NAUTERIO_API_URL ?? "http://localhost:4000";

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  status: string;
  preferredLanguage: string;
  version: number;
}

export interface AddressSnapshot {
  city?: string;
  countryCode?: string;
  [key: string]: unknown;
}

export interface ShipmentSummary {
  id: string;
  trackingNumber: string;
  lifecycleStatus: "DRAFT" | "ACTIVE" | "ACTION_REQUIRED" | "DELIVERED" | "CANCELLED" | "ARCHIVED";
  currentTrackingCode: string;
  actionRequiredReason: string | null;
  serviceId: string;
  senderAddressSnapshot: AddressSnapshot;
  receiverAddressSnapshot: AddressSnapshot;
  estimatedDeliveryFrom: string | null;
  estimatedDeliveryTo: string | null;
  totalAmountMinorUnits: string;
  currency: string;
  outstandingAmountMinorUnits: string;
  createdAt: string;
}

export interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  status: "DRAFT" | "ISSUED" | "PAID" | "OVERDUE" | "VOID";
  totalAmountMinorUnits: string;
  currency: string;
  issuedAt: string | null;
  dueAt: string | null;
}

export interface ClaimSummary {
  id: string;
  shipmentId: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SETTLED";
  reasonCategory: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSummary {
  id: string;
  type: string;
  reviewStatus: "PROCESSING" | "APPROVED" | "REJECTED" | "REPLACEMENT_REQUIRED";
  shipmentId: string | null;
  createdAt: string;
  currentVersion: { fileSizeBytes: number; contentType: string; malwareScanResult: string | null } | null;
}

export interface PickupSummary {
  id: string;
  shipmentId: string;
  windowStart: string;
  windowEnd: string;
  status: "REQUESTED" | "SCHEDULED" | "COMPLETED" | "FAILED" | "CANCELLED";
}

export interface DeliverySummary {
  id: string;
  shipmentId: string;
  windowStart: string | null;
  windowEnd: string | null;
  status: "SCHEDULED" | "OUT_FOR_DELIVERY" | "ATTEMPTED" | "DELIVERED" | "HELD_FOR_COLLECTION" | "FAILED";
}

export interface PortalDashboardData {
  profile: Profile;
  shipments: ShipmentSummary[];
  invoices: InvoiceSummary[];
  claims: ClaimSummary[];
  documents: DocumentSummary[];
  upcomingPickups: PickupSummary[];
  upcomingDeliveries: DeliverySummary[];
}

async function apiGet<T>(path: string, token: string): Promise<T | null> {
  const res = await fetch(`${apiOrigin}/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

const OPEN_PICKUP_STATUSES = new Set(["REQUESTED", "SCHEDULED"]);
const OPEN_DELIVERY_STATUSES = new Set(["SCHEDULED", "OUT_FOR_DELIVERY"]);

/**
 * All the data the portal dashboard needs (spec 10.1's exact section
 * order), fetched server-side with the session cookie already available -
 * this runs inside the same request `portal/layout.tsx` verified the
 * session for, and Next.js dedupes the identical `/v1/me` call between the
 * two automatically.
 */
export async function getPortalDashboardData(): Promise<PortalDashboardData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const profile = await apiGet<Profile>("/me", token);
  if (!profile) return null;

  const [shipmentsPage, invoicesPage, claimsPage, documents] = await Promise.all([
    apiGet<{ items: ShipmentSummary[] }>("/shipments?limit=20", token),
    apiGet<{ items: InvoiceSummary[] }>("/invoices?limit=20", token),
    apiGet<{ items: ClaimSummary[] }>("/claims?limit=10", token),
    apiGet<DocumentSummary[]>("/documents", token),
  ]);

  const shipments = shipmentsPage?.items ?? [];
  const activeShipments = shipments.filter(
    (s) => s.lifecycleStatus === "ACTIVE" || s.lifecycleStatus === "ACTION_REQUIRED"
  );

  // Pickups/deliveries are nested under each shipment - no flat "my
  // pickups" endpoint exists, so this fetches per active shipment (bounded
  // to a handful on a dashboard, not a real N+1 risk at this scale).
  const pickupDeliveryResults = await Promise.all(
    activeShipments
      .slice(0, 8)
      .map((s) => apiGet<{ pickups: PickupSummary[]; deliveries: DeliverySummary[] }>(`/shipments/${s.id}/pickup-delivery`, token))
  );

  const upcomingPickups = pickupDeliveryResults
    .flatMap((r) => r?.pickups ?? [])
    .filter((p) => OPEN_PICKUP_STATUSES.has(p.status));
  const upcomingDeliveries = pickupDeliveryResults
    .flatMap((r) => r?.deliveries ?? [])
    .filter((d) => OPEN_DELIVERY_STATUSES.has(d.status));

  return {
    profile,
    shipments,
    invoices: invoicesPage?.items ?? [],
    claims: claimsPage?.items ?? [],
    documents: documents ?? [],
    upcomingPickups,
    upcomingDeliveries,
  };
}

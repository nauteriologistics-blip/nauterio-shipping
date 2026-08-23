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
  createdAt: string;
}

export interface PortalDashboardData {
  profile: Profile;
  shipments: ShipmentSummary[];
  requests: ShipmentRequestSummary[];
  invoices: InvoiceSummary[];
}

export interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  totalAmountMinorUnits: string | number;
  currency: string;
  status: "DRAFT" | "ISSUED" | "PAID" | "OVERDUE" | "VOID";
  dueAt: string | null;
  lines: { id: string; description: string; amountMinorUnits: string | number; currency: string }[];
}

export interface ShipmentRequestSummary {
  id: string;
  requestStatus: "DRAFT" | "SUBMITTED" | "APPROVED" | "AWAITING_PAYMENT" | "PAID" | "REJECTED" | "CONVERTED" | "CANCELLED";
  decisionReason: string | null;
  submittedAt: string | null;
  updatedAt: string;
  draftDataJson: { goodsDescription?: string; serviceId?: string };
}

async function apiGet<T>(path: string, token: string): Promise<T | null> {
  const response = await fetch(`${apiOrigin}/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as T;
}

/** Fetch only the customer and shipment data required by the MVP dashboard. */
export async function getPortalDashboardData(): Promise<PortalDashboardData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [profile, shipmentsPage, requestsPage, invoicesPage] = await Promise.all([
    apiGet<Profile>("/me", token),
    apiGet<{ items: ShipmentSummary[] }>("/shipments?limit=20", token),
    apiGet<{ items: ShipmentRequestSummary[] }>("/bookings?limit=20", token),
    apiGet<{ items: InvoiceSummary[] }>("/invoices?limit=20", token),
  ]);

  if (!profile) return null;
  return { profile, shipments: shipmentsPage?.items ?? [], requests: requestsPage?.items ?? [], invoices: invoicesPage?.items ?? [] };
}

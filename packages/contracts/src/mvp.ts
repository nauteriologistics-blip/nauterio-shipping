import type { TrackingStatus } from "./tracking-status";

/** The deliberately small customer request contract for the launch MVP. */
export interface MvpShipmentRequest {
  sender: {
    fullName: string;
    phone: string;
    email?: string;
    line1: string;
    line2?: string;
    city: string;
    region?: string;
    postalCode: string;
    countryCode: string;
  };
  receiver: {
    fullName: string;
    phone: string;
    email?: string;
    line1: string;
    line2?: string;
    city: string;
    region?: string;
    postalCode: string;
    countryCode: string;
  };
  goodsDescription: string;
  packageCount: number;
  totalWeightKg: number;
  dimensions: Array<{ lengthCm: number; widthCm: number; heightCm: number; weightKg: number }>;
  preferredService: "AIR_EXPRESS" | "AIR_ECONOMY" | "OCEAN_FREIGHT";
  customerReference?: string;
  customerNotes?: string;
}

export const SHIPMENT_REQUEST_STATUSES = [
  "DRAFT", "SUBMITTED", "APPROVED", "AWAITING_PAYMENT", "PAID", "REJECTED", "CONVERTED", "CANCELLED",
] as const;
export type ShipmentRequestStatus = (typeof SHIPMENT_REQUEST_STATUSES)[number];

/** Terminal decisions cannot be silently reopened; create a new request instead. */
export const SHIPMENT_REQUEST_TRANSITIONS: Record<ShipmentRequestStatus, readonly ShipmentRequestStatus[]> = {
  DRAFT: ["SUBMITTED", "CANCELLED"],
  // Approval and invoice issuance are one atomic command in the launch
  // workflow, so the persisted state moves directly to awaiting payment.
  // APPROVED remains for compatibility with historical rows/imports.
  SUBMITTED: ["AWAITING_PAYMENT", "REJECTED", "CANCELLED"],
  APPROVED: ["AWAITING_PAYMENT"],
  AWAITING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["CONVERTED"],
  REJECTED: [],
  CONVERTED: [],
  CANCELLED: [],
};

export const MVP_SHIPMENT_LIFECYCLE_STATUSES = [
  "DRAFT", "ACTIVE", "ACTION_REQUIRED", "DELIVERED", "CANCELLED", "ARCHIVED",
] as const;
export type MvpShipmentLifecycleStatus = (typeof MVP_SHIPMENT_LIFECYCLE_STATUSES)[number];

export const MVP_SHIPMENT_LIFECYCLE_TRANSITIONS: Record<
  MvpShipmentLifecycleStatus,
  readonly MvpShipmentLifecycleStatus[]
> = {
  DRAFT: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["ACTION_REQUIRED", "DELIVERED", "CANCELLED"],
  ACTION_REQUIRED: ["ACTIVE", "DELIVERED", "CANCELLED"],
  DELIVERED: ["ARCHIVED"],
  CANCELLED: ["ARCHIVED"],
  ARCHIVED: [],
};

export interface AdminTrackingStatusOption {
  code: TrackingStatus;
  labelEn: string;
  labelIt: string;
  requiresReason?: boolean;
  requiresEvidence?: boolean;
}

/** Curated manual choices for the MVP admin console—no payment, return, or advanced customs states. */
export const MVP_ADMIN_TRACKING_STATUSES: readonly AdminTrackingStatusOption[] = [
  { code: "SHIPMENT_CREATED", labelEn: "Shipment created", labelIt: "Spedizione creata" },
  { code: "PACKAGE_COLLECTED", labelEn: "Package collected", labelIt: "Pacco ritirato" },
  { code: "RECEIVED_ORIGIN", labelEn: "Received at origin facility", labelIt: "Ricevuto presso la sede di origine" },
  { code: "PROCESSING_ORIGIN", labelEn: "Processing at origin facility", labelIt: "In lavorazione presso la sede di origine" },
  { code: "DOCUMENTATION_REQUIRED", labelEn: "Documentation required", labelIt: "Documentazione richiesta", requiresReason: true },
  { code: "READY_FOR_EXPORT", labelEn: "Ready for export", labelIt: "Pronto per l'esportazione" },
  { code: "DEPARTED_ORIGIN", labelEn: "Departed origin", labelIt: "Partito dall'origine" },
  { code: "INTERNATIONAL_TRANSIT", labelEn: "In international transit", labelIt: "In transito internazionale" },
  { code: "ARRIVED_DESTINATION", labelEn: "Arrived at destination country", labelIt: "Arrivato nel paese di destinazione" },
  { code: "DESTINATION_FACILITY", labelEn: "At destination facility", labelIt: "Presso la sede di destinazione" },
  { code: "TRANSFERRED_PARTNER", labelEn: "Transferred to delivery partner", labelIt: "Affidato al partner di consegna" },
  { code: "OUT_FOR_DELIVERY", labelEn: "Out for delivery", labelIt: "In consegna" },
  { code: "DELIVERY_ATTEMPTED", labelEn: "Delivery attempted", labelIt: "Tentativo di consegna", requiresReason: true },
  { code: "HELD_FOR_COLLECTION", labelEn: "Held for collection", labelIt: "Disponibile per il ritiro" },
  { code: "DELAYED", labelEn: "Shipment delayed", labelIt: "Spedizione in ritardo", requiresReason: true },
  { code: "ADDRESS_ISSUE", labelEn: "Address information required", labelIt: "Informazioni sull'indirizzo richieste", requiresReason: true },
  { code: "DAMAGED", labelEn: "Damage reported", labelIt: "Danno segnalato", requiresReason: true, requiresEvidence: true },
  { code: "MISSING_INVESTIGATION", labelEn: "Shipment under investigation", labelIt: "Spedizione in fase di verifica", requiresReason: true },
  { code: "LOST_CONFIRMED", labelEn: "Shipment loss confirmed", labelIt: "Perdita della spedizione confermata", requiresReason: true, requiresEvidence: true },
  { code: "DELIVERED", labelEn: "Delivered", labelIt: "Consegnato", requiresEvidence: true },
  { code: "CANCELLED", labelEn: "Shipment cancelled", labelIt: "Spedizione annullata", requiresReason: true },
  { code: "ARCHIVED", labelEn: "Archived", labelIt: "Archiviata" },
];

export function canTransitionShipmentRequest(from: ShipmentRequestStatus, to: ShipmentRequestStatus): boolean {
  return SHIPMENT_REQUEST_TRANSITIONS[from].includes(to);
}

export function canTransitionShipmentLifecycle(from: MvpShipmentLifecycleStatus, to: MvpShipmentLifecycleStatus): boolean {
  return MVP_SHIPMENT_LIFECYCLE_TRANSITIONS[from].includes(to);
}

export const DOCUMENT_REVIEW_STATUSES = ["PROCESSING", "APPROVED", "REJECTED", "REPLACEMENT_REQUIRED"] as const;
export type DocumentReviewState = (typeof DOCUMENT_REVIEW_STATUSES)[number];
export const DOCUMENT_REVIEW_TRANSITIONS: Record<DocumentReviewState, readonly DocumentReviewState[]> = {
  PROCESSING: ["APPROVED", "REJECTED", "REPLACEMENT_REQUIRED"],
  APPROVED: [],
  REJECTED: [],
  REPLACEMENT_REQUIRED: ["PROCESSING"],
};
export function canTransitionDocumentReview(from: DocumentReviewState, to: DocumentReviewState): boolean {
  return DOCUMENT_REVIEW_TRANSITIONS[from].includes(to);
}

export const MALWARE_SCAN_RESULTS = ["PENDING", "CLEAN", "INFECTED", "ERROR"] as const;
export type MalwareScanState = (typeof MALWARE_SCAN_RESULTS)[number];
export function canTransitionMalwareScan(from: MalwareScanState, to: MalwareScanState): boolean {
  return from === "PENDING" && to !== "PENDING";
}

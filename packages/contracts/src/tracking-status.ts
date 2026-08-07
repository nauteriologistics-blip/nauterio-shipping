/**
 * Canonical tracking status catalogue.
 * Source of truth: docs/nauterio-complete-specification.md, Appendix C.
 * Do not add ad-hoc statuses in application code - external carrier
 * statuses must be mapped onto this catalogue, never passed through raw.
 */
export const TRACKING_STATUSES = [
  "SHIPMENT_CREATED",
  "AWAITING_PAYMENT",
  "PAYMENT_CONFIRMED",
  "PICKUP_SCHEDULED",
  "PACKAGE_COLLECTED",
  "RECEIVED_ORIGIN",
  "PROCESSING_ORIGIN",
  "DOCUMENTATION_REQUIRED",
  "MEASUREMENT_REVIEW",
  "READY_FOR_EXPORT",
  "EXPORT_CLEARANCE",
  "EXPORT_CLEARED",
  "DEPARTED_ORIGIN",
  "INTERNATIONAL_TRANSIT",
  "ARRIVED_DESTINATION",
  "IMPORT_CLEARANCE",
  "CUSTOMS_ACTION_REQUIRED",
  "CUSTOMS_HELD",
  "CUSTOMS_CLEARED",
  "DESTINATION_FACILITY",
  "TRANSFERRED_PARTNER",
  "OUT_FOR_DELIVERY",
  "DELIVERY_ATTEMPTED",
  "HELD_FOR_COLLECTION",
  "DELIVERED",
  "DELAYED",
  "ADDRESS_ISSUE",
  "DAMAGED",
  "MISSING_INVESTIGATION",
  "LOST_CONFIRMED",
  "RETURN_REQUESTED",
  "RETURN_IN_TRANSIT",
  "RETURNED_SENDER",
  "CANCELLED",
  "ARCHIVED",
] as const;

export type TrackingStatus = (typeof TRACKING_STATUSES)[number];

export type TrackingEventVisibility =
  | "internal"
  | "authenticated_customer"
  | "public"
  | "restricted_proof";

export interface TrackingStatusMeta {
  code: TrackingStatus;
  customerLabel: string;
  actionRequired: boolean;
  /** Statuses that require stronger permission/evidence per Appendix C's transition controls. */
  requiresStrongEvidence: boolean;
}

export const TRACKING_STATUS_META: Record<TrackingStatus, TrackingStatusMeta> = {
  SHIPMENT_CREATED: { code: "SHIPMENT_CREATED", customerLabel: "Shipment created", actionRequired: false, requiresStrongEvidence: false },
  AWAITING_PAYMENT: { code: "AWAITING_PAYMENT", customerLabel: "Awaiting payment", actionRequired: false, requiresStrongEvidence: false },
  PAYMENT_CONFIRMED: { code: "PAYMENT_CONFIRMED", customerLabel: "Payment confirmed", actionRequired: false, requiresStrongEvidence: false },
  PICKUP_SCHEDULED: { code: "PICKUP_SCHEDULED", customerLabel: "Pickup scheduled", actionRequired: false, requiresStrongEvidence: false },
  PACKAGE_COLLECTED: { code: "PACKAGE_COLLECTED", customerLabel: "Package collected", actionRequired: false, requiresStrongEvidence: false },
  RECEIVED_ORIGIN: { code: "RECEIVED_ORIGIN", customerLabel: "Received at origin facility", actionRequired: false, requiresStrongEvidence: false },
  PROCESSING_ORIGIN: { code: "PROCESSING_ORIGIN", customerLabel: "Processing at origin facility", actionRequired: false, requiresStrongEvidence: false },
  DOCUMENTATION_REQUIRED: { code: "DOCUMENTATION_REQUIRED", customerLabel: "Documentation required", actionRequired: true, requiresStrongEvidence: false },
  MEASUREMENT_REVIEW: { code: "MEASUREMENT_REVIEW", customerLabel: "Measurement review", actionRequired: false, requiresStrongEvidence: false },
  READY_FOR_EXPORT: { code: "READY_FOR_EXPORT", customerLabel: "Ready for export", actionRequired: false, requiresStrongEvidence: false },
  EXPORT_CLEARANCE: { code: "EXPORT_CLEARANCE", customerLabel: "Export clearance in progress", actionRequired: false, requiresStrongEvidence: false },
  EXPORT_CLEARED: { code: "EXPORT_CLEARED", customerLabel: "Export clearance completed", actionRequired: false, requiresStrongEvidence: false },
  DEPARTED_ORIGIN: { code: "DEPARTED_ORIGIN", customerLabel: "Departed Italy", actionRequired: false, requiresStrongEvidence: false },
  INTERNATIONAL_TRANSIT: { code: "INTERNATIONAL_TRANSIT", customerLabel: "In international transit", actionRequired: false, requiresStrongEvidence: false },
  ARRIVED_DESTINATION: { code: "ARRIVED_DESTINATION", customerLabel: "Arrived in the United States", actionRequired: false, requiresStrongEvidence: false },
  IMPORT_CLEARANCE: { code: "IMPORT_CLEARANCE", customerLabel: "Customs clearance in progress", actionRequired: false, requiresStrongEvidence: false },
  CUSTOMS_ACTION_REQUIRED: { code: "CUSTOMS_ACTION_REQUIRED", customerLabel: "Customs action required", actionRequired: true, requiresStrongEvidence: false },
  CUSTOMS_HELD: { code: "CUSTOMS_HELD", customerLabel: "Held by customs", actionRequired: false, requiresStrongEvidence: false },
  CUSTOMS_CLEARED: { code: "CUSTOMS_CLEARED", customerLabel: "Customs cleared", actionRequired: false, requiresStrongEvidence: false },
  DESTINATION_FACILITY: { code: "DESTINATION_FACILITY", customerLabel: "At destination facility", actionRequired: false, requiresStrongEvidence: false },
  TRANSFERRED_PARTNER: { code: "TRANSFERRED_PARTNER", customerLabel: "Transferred to delivery partner", actionRequired: false, requiresStrongEvidence: false },
  OUT_FOR_DELIVERY: { code: "OUT_FOR_DELIVERY", customerLabel: "Out for delivery", actionRequired: false, requiresStrongEvidence: false },
  DELIVERY_ATTEMPTED: { code: "DELIVERY_ATTEMPTED", customerLabel: "Delivery attempted", actionRequired: true, requiresStrongEvidence: false },
  HELD_FOR_COLLECTION: { code: "HELD_FOR_COLLECTION", customerLabel: "Held for collection", actionRequired: false, requiresStrongEvidence: false },
  DELIVERED: { code: "DELIVERED", customerLabel: "Delivered", actionRequired: false, requiresStrongEvidence: true },
  DELAYED: { code: "DELAYED", customerLabel: "Shipment delayed", actionRequired: false, requiresStrongEvidence: false },
  ADDRESS_ISSUE: { code: "ADDRESS_ISSUE", customerLabel: "Address information required", actionRequired: true, requiresStrongEvidence: false },
  DAMAGED: { code: "DAMAGED", customerLabel: "Damage reported", actionRequired: false, requiresStrongEvidence: false },
  MISSING_INVESTIGATION: { code: "MISSING_INVESTIGATION", customerLabel: "Shipment under investigation", actionRequired: false, requiresStrongEvidence: false },
  LOST_CONFIRMED: { code: "LOST_CONFIRMED", customerLabel: "Shipment loss confirmed", actionRequired: false, requiresStrongEvidence: true },
  RETURN_REQUESTED: { code: "RETURN_REQUESTED", customerLabel: "Return requested", actionRequired: false, requiresStrongEvidence: false },
  RETURN_IN_TRANSIT: { code: "RETURN_IN_TRANSIT", customerLabel: "Return in transit", actionRequired: false, requiresStrongEvidence: false },
  RETURNED_SENDER: { code: "RETURNED_SENDER", customerLabel: "Returned to sender", actionRequired: false, requiresStrongEvidence: false },
  CANCELLED: { code: "CANCELLED", customerLabel: "Shipment cancelled", actionRequired: false, requiresStrongEvidence: false },
  ARCHIVED: { code: "ARCHIVED", customerLabel: "Archived", actionRequired: false, requiresStrongEvidence: false },
};

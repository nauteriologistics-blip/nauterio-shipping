/**
 * Single source of truth for service identifiers and transit-time copy,
 * shared between apps/web, apps/api, and apps/admin so the frontend and
 * backend can never drift the way the three original mock pages did.
 *
 * Transit ranges for air-express/air-economy come from the approved spec
 * (docs/nauterio-complete-specification.md, line 284-285). Ocean has no
 * fixed range in the spec (15.1: "schedule-based").
 */
export type ServiceId = "air-express" | "air-economy" | "ocean-freight";

export interface ServiceInfo {
  id: ServiceId;
  name: string;
  transitLabel: string;
  description: string;
}

export const SERVICES: ServiceInfo[] = [
  {
    id: "air-express",
    name: "Air Express",
    transitLabel: "2-5 business days after export acceptance",
    description:
      "Priority air freight for urgent documents and parcels, with door-to-door tracking.",
  },
  {
    id: "air-economy",
    name: "Air Economy",
    transitLabel: "5-10 business days after export acceptance",
    description:
      "Lower-cost air freight for non-urgent parcels, with full tracking and standard handling.",
  },
  {
    id: "ocean-freight",
    name: "Ocean Freight (LCL)",
    transitLabel: "Schedule-based - exact sailing and transit shown at quote time",
    description:
      "Less-than-container-load sea freight for heavier or bulkier shipments sharing container space.",
  },
];

export function getService(id: string): ServiceInfo | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function isServiceId(id: string): id is ServiceId {
  return SERVICES.some((s) => s.id === id);
}

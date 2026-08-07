/**
 * Single source of truth for service names/transit times shown across the
 * public site. Prices are NOT part of this file: per CLAUDE.md, rate cards
 * and margins must come from the business, not be invented. The pricing API
 * (/api/v1/quote) returns a clearly-labelled indicative estimate only.
 *
 * Transit ranges for air-express/air-economy come from the approved spec
 * (docs/nauterio-complete-specification.md line 284-285: "2-5 business days
 * target after export acceptance" / "5-10 business days target"). Ocean has
 * no fixed range in the spec (15.1: "schedule-based"), so it is described as
 * such rather than given an invented day count.
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

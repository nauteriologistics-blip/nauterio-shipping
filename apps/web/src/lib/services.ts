/**
 * Single source of truth for service names/transit times shown across the
 * public site. Prices are calculated by the API from the product owner's
 * approved hardcoded online schedule (ADR 0004), not duplicated here.
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
      "The shortest available air schedule for urgent documents and parcels. Collection and destination delivery are confirmed for each route.",
  },
  {
    id: "air-economy",
    name: "Air Economy",
    transitLabel: "5-10 business days after export acceptance",
    description:
      "A lower-cost air option for freight that can travel on a more flexible schedule, with milestone tracking from collection to delivery.",
  },
  {
    id: "ocean-freight",
    name: "Ocean Freight (LCL)",
    transitLabel: "Schedule-based - sailing confirmed before collection",
    description:
      "Consolidated sea freight for palletised, heavy or bulky cargo. Cut-off dates, sailing schedules and destination charges are confirmed before booking.",
  },
];

export function getService(id: string): ServiceInfo | undefined {
  return SERVICES.find((s) => s.id === id);
}

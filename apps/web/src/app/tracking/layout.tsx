import type { Metadata } from "next";

export const metadata: Metadata = { title: "Track a Shipment", description: "Look up a Nauterio shipment and see its recorded route milestones and required actions." };
export default function TrackingLayout({ children }: { children: React.ReactNode }) { return children; }

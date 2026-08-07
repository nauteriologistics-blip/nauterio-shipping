import { getPrismaClient } from "@nauterio/database";

/**
 * Retention scheduled job (spec section 29.1's queue table, section 32 /
 * Appendix G's retention schedule). Only implements the ONE period the
 * spec gives a firm number for without an "Italian legal/accountant
 * confirmation" caveat: public tracking results, 180 days after delivery
 * (Appendix G). Every other retention period in the schedule is marked
 * "proposed, pending confirmation" - do not implement automated deletion
 * against a number that isn't approved yet (CLAUDE.md: append-only
 * financial/audit history; deletion needs real legal sign-off, not an
 * engineering guess).
 */
export async function runRetentionSweep(): Promise<{ archivedTrackingEvents: number }> {
  const prisma = getPrismaClient();
  const cutoff = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);

  const result = await prisma.shipment.updateMany({
    where: {
      lifecycleStatus: "DELIVERED",
      deliveredAt: { lt: cutoff },
      legalHold: false,
    },
    data: { lifecycleStatus: "ARCHIVED" },
  });

  return { archivedTrackingEvents: result.count };
}

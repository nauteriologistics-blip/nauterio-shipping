import { getPrismaClient } from "@nauterio/database";
import { workerLogger } from "../logger";

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

// SEC-012/DATA-014: an automated bulk lifecycle transition is exactly the
// "high-risk activity" the audit table exists for - a blind `updateMany`
// with no audit trail meant a wrong predicate could silently archive the
// wrong shipments with no forensic record of what changed. This bound is a
// circuit breaker, not a real capacity limit: a sweep matching more than
// this many rows is far more likely to indicate a predicate bug than a
// genuine 180-day backlog (the job runs hourly-or-more-often in production,
// spec 29.1), so it aborts and logs rather than archiving an unexpectedly
// large batch unattended.
const SANITY_MAX_ARCHIVED_PER_RUN = 500;

export async function runRetentionSweep(): Promise<{ archivedTrackingEvents: number }> {
  const prisma = getPrismaClient();
  const cutoff = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);

  const where = {
    lifecycleStatus: "DELIVERED" as const,
    deliveredAt: { lt: cutoff },
    legalHold: false,
  };

  const matching = await prisma.shipment.findMany({
    where,
    select: { id: true },
    take: SANITY_MAX_ARCHIVED_PER_RUN + 1,
  });

  if (matching.length > SANITY_MAX_ARCHIVED_PER_RUN) {
    workerLogger.error(
      { matchedCount: matching.length, sanityMax: SANITY_MAX_ARCHIVED_PER_RUN },
      "[retention] sweep matched more shipments than the sanity bound in one run - aborting without archiving any " +
        "of them (likely a predicate bug, not a genuine backlog). Investigate before the next run."
    );
    return { archivedTrackingEvents: 0 };
  }

  if (matching.length === 0) {
    return { archivedTrackingEvents: 0 };
  }

  const ids = matching.map((s) => s.id);

  await prisma.$transaction(async (tx) => {
    await tx.shipment.updateMany({
      where: { id: { in: ids } },
      data: { lifecycleStatus: "ARCHIVED" },
    });

    // One event covering the batch, not one per shipment - each shipment's
    // own history already lives in the shipments table; this row exists so
    // "what did the automated sweep touch and when" has a single forensic
    // answer, per CLAUDE.md's audit requirement for high-risk activity.
    await tx.auditEvent.create({
      data: {
        action: "RETENTION_SWEEP_ARCHIVED",
        entityType: "Shipment",
        entityId: ids[0], // AuditEvent.entityId is a single required field; the full set is in afterJson
        afterJson: { archivedShipmentIds: ids, count: ids.length, cutoff },
        correlationId: "worker-retention-sweep",
      },
    });
  });

  return { archivedTrackingEvents: ids.length };
}

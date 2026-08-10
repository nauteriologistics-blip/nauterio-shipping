import { getPrismaClient } from "@nauterio/database";

/**
 * DATA-002: `IdempotencyRecord.expiresAt` was written and indexed but never
 * read by anything - a real TTL sweep. The interceptor itself now treats an
 * expired record as reclaimable on next use (see idempotency.interceptor.ts),
 * so this job's only job is to stop the table growing forever for keys that
 * are never retried after expiry.
 */
export async function runIdempotencyCleanup(): Promise<{ deleted: number }> {
  const prisma = getPrismaClient();
  const result = await prisma.idempotencyRecord.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return { deleted: result.count };
}

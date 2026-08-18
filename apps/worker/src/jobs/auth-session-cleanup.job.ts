import { getPrismaClient } from "@nauterio/database";

export async function runAuthSessionCleanup(now = new Date()): Promise<{ deleted: number }> {
  const result = await getPrismaClient().authSession.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: now } },
        { revokedAt: { not: null, lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
      ],
    },
  });
  return { deleted: result.count };
}

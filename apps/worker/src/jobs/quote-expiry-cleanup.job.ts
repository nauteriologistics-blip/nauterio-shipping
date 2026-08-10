import { getPrismaClient } from "@nauterio/database";

/**
 * REL-015: the public quote endpoint writes a Quote + up to 4 QuoteLine rows
 * per anonymous request, `expiresAt` was written but never read, and there
 * was no sweep - unbounded growth of a table whose rows have a declared
 * 7-day useful life. Only DRAFT quotes with no linked booking are deleted -
 * an ACCEPTED/converted quote is real transaction history (spec 15.1: quotes
 * snapshot every calculation input and rule), and `Booking.quoteId` cascades
 * on quote delete, so deleting a converted quote would delete its booking
 * too. Filtering to `bookings: { none: {} }` makes that impossible by
 * construction rather than by trusting `status` alone.
 */
export async function runQuoteExpiryCleanup(): Promise<{ deleted: number }> {
  const prisma = getPrismaClient();
  const result = await prisma.quote.deleteMany({
    where: {
      status: "DRAFT",
      expiresAt: { lt: new Date() },
      bookings: { none: {} },
    },
  });
  return { deleted: result.count };
}

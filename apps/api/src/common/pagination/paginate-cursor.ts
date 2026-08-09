const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

/**
 * Runs a Prisma `findMany`-shaped query one item past the requested page
 * size to detect whether more pages exist, without a separate COUNT query.
 * `queryPage` must apply `take`/`cursor`/`skip` to the caller's own
 * `where`/`orderBy`/`include` - this helper only owns the pagination
 * mechanics, not the query itself (spec section 26.1).
 */
export async function paginateCursor<T extends { id: string }>(
  queryPage: (args: { take: number; cursor?: { id: string }; skip?: number }) => Promise<T[]>,
  params: { cursor?: string; limit?: number }
): Promise<CursorPage<T>> {
  const take = clampLimit(params.limit);

  const rows = await queryPage({
    take: take + 1,
    ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
  });

  return sliceCursorPage(rows, take);
}

/**
 * Sibling to `paginateCursor` for callers that already ran their own
 * `take: limit + 1` / `cursor` / `skip` Prisma query (e.g. because they
 * need other query options `paginateCursor`'s callback signature doesn't
 * expose) and just need the "slice + compute nextCursor" mechanics applied
 * to the resulting rows. `limit` here must be the SAME value used to build
 * `take: limit + 1` in that query, not clamped again independently, or the
 * has-more-pages detection will be wrong.
 */
export function sliceCursorPage<T extends { id: string }>(rows: T[], limit: number): CursorPage<T> {
  const take = clampLimit(limit);
  const hasMore = rows.length > take;
  const items = hasMore ? rows.slice(0, take) : rows;

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1].id : null,
  };
}

function clampLimit(limit: number | undefined): number {
  return Math.min(Math.max(limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
}

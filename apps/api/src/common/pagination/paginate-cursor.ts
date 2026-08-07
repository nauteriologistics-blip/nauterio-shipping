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
  const take = Math.min(Math.max(params.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);

  const rows = await queryPage({
    take: take + 1,
    ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
  });

  const hasMore = rows.length > take;
  const items = hasMore ? rows.slice(0, take) : rows;

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1].id : null,
  };
}

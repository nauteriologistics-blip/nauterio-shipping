import { Type } from "class-transformer";
import { IsInt, IsOptional, IsUUID, Max, Min } from "class-validator";

/**
 * Query params for cursor-paginated list endpoints (spec section 26.1:
 * high-volume lists use cursor pagination, not offset). `cursor` is the
 * `id` of the last item from the previous page - safe to use directly
 * because primary keys are UUIDv7 (time-ordered, see schema.prisma), so
 * cursoring on `id` is equivalent to cursoring on creation time without a
 * separate tie-breaker column.
 *
 * DATA-016(c): a non-UUID cursor reached Prisma unvalidated and produced a
 * Prisma error the exception filter had no mapping for - a retryable 500
 * for a request that could never succeed. `@IsUUID()` rejects it at the
 * boundary with a 400 instead.
 */
export class CursorPaginationQueryDto {
  @IsOptional()
  @IsUUID()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

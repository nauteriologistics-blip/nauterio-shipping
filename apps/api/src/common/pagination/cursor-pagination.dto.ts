import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * Query params for cursor-paginated list endpoints (spec section 26.1:
 * high-volume lists use cursor pagination, not offset). `cursor` is the
 * `id` of the last item from the previous page - safe to use directly
 * because primary keys are UUIDv7 (time-ordered, see schema.prisma), so
 * cursoring on `id` is equivalent to cursoring on creation time without a
 * separate tie-breaker column.
 */
export class CursorPaginationQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

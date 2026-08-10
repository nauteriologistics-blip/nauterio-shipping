import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { CursorPaginationQueryDto } from "../../../common/pagination/cursor-pagination.dto";

/** Mirrors packages/database/prisma/schema.prisma's ShipmentLifecycleStatus -
 * duplicated here rather than imported from @nauterio/database so this DTO
 * has no runtime dependency on the Prisma client package (matches this
 * app's existing DTO convention). */
export const SHIPMENT_LIFECYCLE_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "ACTION_REQUIRED",
  "DELIVERED",
  "CANCELLED",
  "ARCHIVED",
] as const;
export type ShipmentLifecycleStatusFilter = (typeof SHIPMENT_LIFECYCLE_STATUSES)[number];

/**
 * REL-016 residual: the staff shipment list (`where: {}`, per
 * shipments.service.ts) had no status or date filtering at all, so the
 * admin UI could only paginate the entire table linearly - the finding's
 * own words: "offers no status or date filtering at all, so the admin UI
 * can only paginate the whole table linearly." Adding these as optional
 * query params, not required ones, so the existing unfiltered behaviour
 * (and every other caller of `list()`) is unchanged when they're omitted.
 */
export class ListShipmentsQueryDto extends CursorPaginationQueryDto {
  @IsOptional()
  @IsEnum(SHIPMENT_LIFECYCLE_STATUSES)
  status?: ShipmentLifecycleStatusFilter;

  @IsOptional()
  @Type(() => String)
  @IsDateString()
  createdAfter?: string;

  @IsOptional()
  @Type(() => String)
  @IsDateString()
  createdBefore?: string;
}

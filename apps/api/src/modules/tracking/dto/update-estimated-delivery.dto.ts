import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class UpdateEstimatedDeliveryDto {
  @ApiProperty({ example: "2026-09-14" })
  @IsDateString({ strict: true })
  estimatedDeliveryFrom!: string;

  @ApiProperty({ example: "2026-09-16" })
  @IsDateString({ strict: true })
  estimatedDeliveryTo!: string;
}

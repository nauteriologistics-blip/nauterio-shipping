import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class SubmitClaimDto {
  @ApiProperty({ description: "Shipment ID to claim against" })
  @IsUUID()
  @IsNotEmpty()
  shipmentId!: string;

  @ApiProperty({ description: "Reason category (DAMAGED, LOST, DELAYED, INCORRECT_CHARGES)" })
  @IsString()
  @IsNotEmpty()
  reasonCategory!: string;

  @ApiProperty({ description: "Detailed description of the claim" })
  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class DecideClaimDto {
  @ApiProperty({ description: "Decision notes / rationale" })
  @IsString()
  @IsNotEmpty()
  reasonNotes!: string;

  @ApiProperty({ description: "Approved compensation amount in minor units", required: false })
  @IsOptional()
  approvedAmountMinorUnits?: number;
}

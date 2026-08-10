import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export const CLAIM_REASON_CATEGORIES = ["DAMAGED", "LOST", "DELAYED", "INCORRECT_CHARGES"] as const;
export type ClaimReasonCategory = (typeof CLAIM_REASON_CATEGORIES)[number];

export class SubmitClaimDto {
  @ApiProperty({ description: "Shipment ID to claim against" })
  @IsUUID()
  @IsNotEmpty()
  shipmentId!: string;

  @ApiProperty({ description: "Reason category", enum: CLAIM_REASON_CATEGORIES })
  @IsIn(CLAIM_REASON_CATEGORIES)
  reasonCategory!: ClaimReasonCategory;

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

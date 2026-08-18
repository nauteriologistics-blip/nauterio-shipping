import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class SaveDraftDto {
  @ApiProperty({ description: "Current wizard step" })
  @IsString()
  @IsNotEmpty()
  currentStep!: string;

  @ApiProperty({ description: "Draft form payload" })
  @IsObject()
  draftDataJson!: Record<string, unknown>;

  @ApiProperty({ description: "Associated Quote ID", required: false })
  @IsOptional()
  @IsUUID()
  quoteId?: string;

  @ApiProperty({ description: "Organisation ID", required: false })
  @IsOptional()
  @IsUUID()
  organisationId?: string;
}

export class RejectShipmentRequestDto {
  @ApiProperty({ description: "Customer-visible reason for rejecting the request" })
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  reason!: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from "class-validator";

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

export class ConfirmBookingDto {
  @ApiProperty({ description: "Payment intent or payment reference", required: false })
  @IsString()
  @IsOptional()
  paymentReference?: string;

  @ApiProperty({ description: "Payment method (e.g., INVOICE, CARD)", required: false })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}

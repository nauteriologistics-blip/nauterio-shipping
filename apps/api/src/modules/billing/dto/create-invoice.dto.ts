import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateInvoiceDto {
  @ApiProperty({ description: "Shipment ID to invoice" })
  @IsUUID()
  @IsNotEmpty()
  shipmentId!: string;

  @ApiProperty({ description: "Organisation ID for billing", required: false })
  @IsUUID()
  @IsOptional()
  organisationId?: string;

  @ApiProperty({ description: "Currency (e.g. EUR)", default: "EUR" })
  @IsString()
  @IsNotEmpty()
  currency!: string;
}

export class PayInvoiceDto {
  @ApiProperty({ description: "Payment method (CARD, BANK_TRANSFER, SEPA_DIRECT_DEBIT)" })
  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;
}

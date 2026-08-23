import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

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

export class UpdateInvoiceStatusDto {
  @ApiProperty({ description: "Offline invoice status controlled by staff", enum: ["ISSUED", "PAID", "OVERDUE", "VOID"] })
  @IsIn(["ISSUED", "PAID", "OVERDUE", "VOID"])
  status!: "ISSUED" | "PAID" | "OVERDUE" | "VOID";

  @ApiProperty({ description: "Internal note explaining the status change", required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;
}

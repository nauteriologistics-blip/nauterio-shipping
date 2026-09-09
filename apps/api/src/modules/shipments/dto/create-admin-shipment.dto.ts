import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNotIn, IsNumber, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

const SERVICE_IDS = ["AIR_EXPRESS", "AIR_ECONOMY", "OCEAN_FREIGHT"] as const;
const COUNTRY_CODE = /^[A-Z]{2}$/;
const CURRENCY_CODE = /^[A-Z]{3}$/;

export class CreateAdminShipmentDto {
  @ApiProperty() @IsUUID() ownerUserId!: string;
  @ApiProperty({ enum: SERVICE_IDS }) @IsIn(SERVICE_IDS) serviceId!: (typeof SERVICE_IDS)[number];

  @ApiProperty() @IsString() @MinLength(1) @MaxLength(200) senderName!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(300) senderLine1!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(120) senderCity!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(30) senderPostalCode!: string;
  @ApiProperty({ example: "IT" }) @Matches(COUNTRY_CODE) @IsNotIn(["GH"]) senderCountry!: string;
  @ApiProperty() @IsString() @MinLength(3) @MaxLength(40) senderPhone!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() @MaxLength(254) senderEmail?: string;

  @ApiProperty() @IsString() @MinLength(1) @MaxLength(200) receiverName!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(300) receiverLine1!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(120) receiverCity!: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(30) receiverPostalCode!: string;
  @ApiProperty({ example: "US" }) @Matches(COUNTRY_CODE) @IsNotIn(["GH"]) receiverCountry!: string;
  @ApiProperty() @IsString() @MinLength(3) @MaxLength(40) receiverPhone!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() @MaxLength(254) receiverEmail?: string;

  @ApiProperty() @IsNumber() @Min(0.01) @Max(1000) weightKg!: number;
  @ApiProperty() @IsNumber() @Min(1) @Max(500) lengthCm!: number;
  @ApiProperty() @IsNumber() @Min(1) @Max(500) widthCm!: number;
  @ApiProperty() @IsNumber() @Min(1) @Max(500) heightCm!: number;
  @ApiProperty() @IsNumber() @Min(0) @Max(1_000_000) declaredValue!: number;
  @ApiProperty() @IsNumber() @Min(0) @Max(10_000_000) totalAmount!: number;
  @ApiProperty({ example: "EUR" }) @Matches(CURRENCY_CODE) currency!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(120) customerReference?: string;
}

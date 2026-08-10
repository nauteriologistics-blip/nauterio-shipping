import { IsBoolean, IsIn, IsNumber, IsOptional, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SERVICES, type ServiceId } from "@nauterio/contracts";

const SERVICE_IDS = SERVICES.map((s) => s.id) as [ServiceId, ...ServiceId[]];

// DATA-016: unbounded weight/dimensions/value overflowed to Infinity at
// extreme input (e.g. weightKg: 1e308), which then threw an unhandled
// RangeError converting to BigInt and surfaced as a 500 on this public,
// unauthenticated endpoint. REQUIRES_BUSINESS_EVIDENCE: these are
// conservative operational ceilings (well beyond any real parcel or
// container), not a business rate/limit - replace once real carrier
// service limits are confirmed.
const MAX_WEIGHT_KG = 1000;
const MAX_DIMENSION_CM = 500;
const MAX_DECLARED_VALUE_EUR = 1_000_000;

export class CreateQuoteDto {
  @ApiProperty() @IsNumber() @Min(0.01) @Max(MAX_WEIGHT_KG) weightKg!: number;
  @ApiProperty() @IsNumber() @Min(1) @Max(MAX_DIMENSION_CM) lengthCm!: number;
  @ApiProperty() @IsNumber() @Min(1) @Max(MAX_DIMENSION_CM) widthCm!: number;
  @ApiProperty() @IsNumber() @Min(1) @Max(MAX_DIMENSION_CM) heightCm!: number;
  @ApiProperty() @IsNumber() @Min(0) @Max(MAX_DECLARED_VALUE_EUR) declaredValueEur!: number;
  @ApiProperty({ enum: SERVICE_IDS }) @IsIn(SERVICE_IDS) service!: ServiceId;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() addCustoms?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() addPickup?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() addInsurance?: boolean;
}

import { IsBoolean, IsIn, IsNumber, IsOptional, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SERVICES, type ServiceId } from "@nauterio/contracts";

const SERVICE_IDS = SERVICES.map((s) => s.id) as [ServiceId, ...ServiceId[]];

export class CreateQuoteDto {
  @ApiProperty() @IsNumber() @Min(0.01) weightKg!: number;
  @ApiProperty() @IsNumber() @Min(1) lengthCm!: number;
  @ApiProperty() @IsNumber() @Min(1) widthCm!: number;
  @ApiProperty() @IsNumber() @Min(1) heightCm!: number;
  @ApiProperty() @IsNumber() @Min(0) declaredValueEur!: number;
  @ApiProperty({ enum: SERVICE_IDS }) @IsIn(SERVICE_IDS) service!: ServiceId;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() addCustoms?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() addPickup?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() addInsurance?: boolean;
}

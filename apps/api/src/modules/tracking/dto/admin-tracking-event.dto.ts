import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsIn, IsObject, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { MVP_ADMIN_TRACKING_STATUSES } from "@nauterio/contracts";

const CODES = MVP_ADMIN_TRACKING_STATUSES.map((status) => status.code);

export class AddAdminTrackingEventDto {
  @ApiProperty({ enum: CODES })
  @IsIn(CODES)
  canonicalCode!: string;

  @IsDateString()
  eventTime!: string;

  @IsOptional()
  @IsObject()
  location?: { city?: string; facility?: string; countryCode?: string };

  @IsOptional()
  @IsString()
  @MaxLength(500)
  publicDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  internalDescription?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  reason?: string;

  @IsOptional()
  @IsUUID()
  evidenceDocumentId?: string;
}

export class CorrectAdminTrackingEventDto extends AddAdminTrackingEventDto {
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  correctionReason!: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateAddressDto {
  @ApiProperty({ description: "Street address line 1" })
  @IsString()
  @IsNotEmpty()
  line1!: string;

  @ApiProperty({ description: "Street address line 2", required: false })
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiProperty({ description: "City" })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ description: "State / Region / Province", required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ description: "Postal / ZIP Code" })
  @IsString()
  @IsNotEmpty()
  postalCode!: string;

  @ApiProperty({ description: "2-letter ISO Country Code (e.g. IT, US)" })
  @IsString()
  @IsNotEmpty()
  countryCode!: string;
}

export class UpdateAddressDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  line1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  countryCode?: string;
}

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;

  /**
   * DATA-007: optimistic-locking guard. `User.version` was previously dead
   * schema - never read or incremented by any code, despite a header
   * comment describing this exact `WHERE version = $expected` pattern.
   * Optional so an older client that has never seen this field still works
   * (falls back to an unconditional update, same as before); a client that
   * DOES supply it gets a real lost-update guard: if the record changed
   * since it was fetched, the update is rejected with a conflict instead of
   * silently overwriting a concurrent edit.
   */
  @ApiProperty({ required: false, description: "The version the client last fetched, for optimistic-locking conflict detection" })
  @IsOptional()
  @IsInt()
  @Min(1)
  expectedVersion?: number;
}

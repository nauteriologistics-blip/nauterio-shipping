import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
}

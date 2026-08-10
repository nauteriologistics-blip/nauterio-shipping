import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

const SUPPORTED_LANGUAGES = ["en", "it"] as const;

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiProperty({ enum: SUPPORTED_LANGUAGES, required: false })
  @IsOptional()
  @IsIn(SUPPORTED_LANGUAGES)
  preferredLanguage?: (typeof SUPPORTED_LANGUAGES)[number];

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;

  /** Registration is rejected without this - there is no account to create
   * without agreement to the terms the account is governed by. */
  @ApiProperty()
  @IsBoolean()
  acceptedTerms!: boolean;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token!: string;
}

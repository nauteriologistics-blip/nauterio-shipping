import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

const VOLUME_OPTIONS = ["0-50", "51-500", "500+"] as const;

export class CreateBusinessInquiryDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  companyName!: string;

  @ApiProperty({ enum: VOLUME_OPTIONS })
  @IsIn(VOLUME_OPTIONS)
  monthlyVolume!: (typeof VOLUME_OPTIONS)[number];

  @ApiProperty()
  @IsEmail()
  @MaxLength(254)
  workEmail!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;
}

export class UpdateBusinessInquiryDto {
  @ApiProperty({ enum: ["OPEN", "CONTACTED", "CLOSED"] })
  @IsIn(["OPEN", "CONTACTED", "CLOSED"])
  status!: "OPEN" | "CONTACTED" | "CLOSED";
}

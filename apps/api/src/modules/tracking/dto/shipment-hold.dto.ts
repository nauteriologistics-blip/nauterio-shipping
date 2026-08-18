import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class PlaceShipmentHoldDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason!: string;
}

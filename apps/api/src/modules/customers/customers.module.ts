import { Body, Controller, Injectable, Module, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

/** Customers/contacts module (spec section 24): customer profile, address
 * book, contacts, consent, preferences. Address-book write path implemented
 * since booking flow needs it now; consent/preference management deferred. */
class CreateAddressDto {
  @IsString() line1!: string;
  @IsString() city!: string;
  @IsString() postalCode!: string;
  @IsString() countryCode!: string;
}

@Injectable()
class CustomersService {
  async addAddress(userId: string, dto: CreateAddressDto) {
    const prisma = getPrismaClient();
    return prisma.address.create({ data: { userId, ...dto } });
  }
}

@ApiTags("customers")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("me/addresses")
class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @RequireIdempotencyKey()
  async addAddress(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateAddressDto) {
    return this.customersService.addAddress(user.userId, dto);
  }
}

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}

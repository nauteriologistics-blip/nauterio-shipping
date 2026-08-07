import { Body, Controller, Injectable, Module, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

/** Bookings module (spec section 24): draft flow, declarations, confirmation,
 * conversion to shipment. Draft-save implemented (the part that only needs
 * the database); conversion-to-shipment deferred until BillingModule's
 * payment-confirmation gate exists, per spec section 21.1's request path. */
class SaveDraftDto {
  @IsString() currentStep!: string;
  @IsObject() draftDataJson!: Record<string, unknown>;
  @IsOptional() @IsString() quoteId?: string;
}

@Injectable()
class BookingsService {
  async saveDraft(userId: string, dto: SaveDraftDto) {
    const prisma = getPrismaClient();
    return prisma.booking.create({
      data: {
        userId,
        currentStep: dto.currentStep as never,
        draftDataJson: dto.draftDataJson as never,
        quoteId: dto.quoteId,
      },
    });
  }
}

@ApiTags("bookings")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("bookings")
class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async saveDraft(@CurrentUser() user: AuthenticatedUser, @Body() dto: SaveDraftDto) {
    return this.bookingsService.saveDraft(user.userId, dto);
  }
}

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}

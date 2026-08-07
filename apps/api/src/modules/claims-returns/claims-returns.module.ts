import { Body, Controller, Injectable, Module, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

/** Claims/returns module (spec section 24): eligibility, evidence, decisions,
 * compensation, return shipment. Submission implemented (only needs the
 * database + separation-of-duties rule already in packages/validation);
 * decision/compensation payout deferred until BillingModule can create a
 * real refund against a real payment provider. */
class SubmitClaimDto {
  @IsString() shipmentId!: string;
  @IsString() reasonCategory!: string;
  @IsString() description!: string;
}

@Injectable()
class ClaimsReturnsService {
  async submit(userId: string, dto: SubmitClaimDto) {
    const prisma = getPrismaClient();
    return prisma.claim.create({
      data: {
        shipmentId: dto.shipmentId,
        submittedByUserId: userId,
        reasonCategory: dto.reasonCategory,
        description: dto.description,
      },
    });
  }
}

@ApiTags("claims")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("claims")
class ClaimsReturnsController {
  constructor(private readonly service: ClaimsReturnsService) {}

  @Post()
  async submit(@CurrentUser() user: AuthenticatedUser, @Body() dto: SubmitClaimDto) {
    return this.service.submit(user.userId, dto);
  }
}

@Module({
  controllers: [ClaimsReturnsController],
  providers: [ClaimsReturnsService],
  exports: [ClaimsReturnsService],
})
export class ClaimsReturnsModule {}

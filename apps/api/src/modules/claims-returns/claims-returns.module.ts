import { Body, Controller, Injectable, Module, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { AuditService } from "../audit/audit.module";

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
  constructor(private readonly auditService: AuditService) {}

  /**
   * Claim creation and its audit entry commit together or not at all (ADR
   * 0001 section 6.3) - a claim is exactly the kind of high-risk, financially
   * consequential write that must never end up with no audit trail.
   */
  async submit(userId: string, dto: SubmitClaimDto, correlationId: string) {
    const prisma = getPrismaClient();
    return prisma.$transaction(async (tx) => {
      const claim = await tx.claim.create({
        data: {
          shipmentId: dto.shipmentId,
          submittedByUserId: userId,
          reasonCategory: dto.reasonCategory,
          description: dto.description,
        },
      });

      await this.auditService.record(
        {
          actorUserId: userId,
          action: "claim:submit",
          entityType: "Claim",
          entityId: claim.id,
          afterJson: claim,
          correlationId,
        },
        tx
      );

      return claim;
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
  @RequireIdempotencyKey()
  async submit(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SubmitClaimDto,
    @CorrelationId() correlationId: string
  ) {
    return this.service.submit(user.userId, dto, correlationId);
  }
}

@Module({
  controllers: [ClaimsReturnsController],
  providers: [ClaimsReturnsService],
  exports: [ClaimsReturnsService],
})
export class ClaimsReturnsModule {}

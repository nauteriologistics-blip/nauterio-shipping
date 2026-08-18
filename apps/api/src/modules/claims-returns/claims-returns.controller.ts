import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { NoPermissionRequired } from "../../common/decorators/no-permission-required.decorator";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import { RequireIdempotencyKey } from "../../common/decorators/require-idempotency-key.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { ClaimsReturnsService } from "./claims-returns.service";
import { SubmitClaimDto, DecideClaimDto } from "./dto/submit-claim.dto";

@ApiTags("claims")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("claims")
export class ClaimsReturnsController {
  constructor(private readonly service: ClaimsReturnsService) {}

  @Get()
  @NoPermissionRequired()
  @ApiOperation({ summary: "List claims" })
  async listClaims(@Query("after") after?: string, @Query("limit") limit?: string, @CurrentUser() user?: AuthenticatedUser) {
    return this.service.listClaims(user, after, limit ? parseInt(limit, 10) : undefined);
  }

  @Get(":id")
  @NoPermissionRequired()
  @ApiOperation({ summary: "Get claim by ID" })
  async getClaim(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.getClaimById(id, user);
  }

  @Post()
  @NoPermissionRequired()
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Submit a new claim" })
  async submit(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SubmitClaimDto,
    @CorrelationId() correlationId?: string
  ) {
    return this.service.submit(user, dto, correlationId);
  }

  @Post(":id/approve")
  @RequirePermission("claim:approve")
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Approve a claim (Staff, enforces separation of duties)" })
  async approveClaim(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: DecideClaimDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.approveClaim(id, user, dto);
  }

  @Post(":id/reject")
  @RequirePermission("claim:reject")
  @RequireIdempotencyKey()
  @ApiOperation({ summary: "Reject a claim (Staff, enforces separation of duties)" })
  async rejectClaim(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: DecideClaimDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.rejectClaim(id, user, dto);
  }
}

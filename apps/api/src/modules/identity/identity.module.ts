import { Controller, Get, Injectable, Module, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

/**
 * Identity module (spec section 24): Cognito linkage, users, sessions,
 * verification, account recovery. Real session/MFA/passkey management is
 * Cognito-side work blocked on a real User Pool (ADR 0001 section 11) -
 * this implements the Nauterio-side profile endpoint (`GET /me`, spec
 * section 26.1) since that only needs the database, which is real.
 */
@Injectable()
class IdentityService {
  async getProfile(userId: string) {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      preferredLanguage: user.preferredLanguage,
      staffRole: user.staffRole,
    };
  }
}

@ApiTags("identity")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("me")
class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get()
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.identityService.getProfile(user.userId);
  }
}

@Module({
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}

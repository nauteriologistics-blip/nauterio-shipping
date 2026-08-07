import { Controller, Get, Injectable, Module, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

/** Support module (spec section 24 and 21.2): Zendesk linkage, operational
 * context, escalation. Zendesk IS the conversation record - no real Zendesk
 * account exists yet (ADR 0001 section 11), so this only implements the
 * linkage-lookup side that doesn't require calling Zendesk's API. */
@Injectable()
class SupportService {
  async listMyLinks(userId: string) {
    const prisma = getPrismaClient();
    return prisma.supportLink.findMany({ where: { userId } });
  }
}

@ApiTags("support")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("me/support-tickets")
class SupportController {
  constructor(private readonly service: SupportService) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser) {
    return this.service.listMyLinks(user.userId);
  }
}

@Module({
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}

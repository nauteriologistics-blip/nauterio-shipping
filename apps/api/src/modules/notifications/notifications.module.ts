import { Controller, Get, Injectable, Module, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

/** Notifications module (spec section 24): templates, preferences, channel
 * routing, delivery, retries. Read path (notification centre) implemented;
 * actual sending is apps/worker's job via MessagingAdapter (see
 * packages/integrations) once a real SES/Twilio account exists. */
@Injectable()
class NotificationsService {
  async listMine(userId: string) {
    const prisma = getPrismaClient();
    return prisma.notification.findMany({
      where: { userId },
      include: { deliveryAttempts: true },
      orderBy: { createdAt: "desc" },
    });
  }
}

@ApiTags("notifications")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("me/notifications")
class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser) {
    return this.service.listMine(user.userId);
  }
}

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

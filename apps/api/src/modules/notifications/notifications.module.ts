import { Controller, Get, Injectable, Module, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";
import { CursorPaginationQueryDto } from "../../common/pagination/cursor-pagination.dto";
import { paginateCursor } from "../../common/pagination/paginate-cursor";

/** Notifications module (spec section 24): templates, preferences, channel
 * routing, delivery, retries. Read path (notification centre) implemented;
 * actual sending is apps/worker's job via MessagingAdapter (see
 * packages/integrations) once a real SES/Twilio account exists. Cursor
 * paginated since this list grows unbounded per user over time. */
@Injectable()
class NotificationsService {
  async listMine(userId: string, pagination: { cursor?: string; limit?: number }) {
    const prisma = getPrismaClient();
    return paginateCursor(
      (page) =>
        prisma.notification.findMany({
          where: { userId },
          include: { deliveryAttempts: true },
          orderBy: { id: "desc" },
          ...page,
        }),
      pagination
    );
  }
}

@ApiTags("notifications")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("me/notifications")
class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser, @Query() pagination: CursorPaginationQueryDto) {
    return this.service.listMine(user.userId, pagination);
  }
}

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

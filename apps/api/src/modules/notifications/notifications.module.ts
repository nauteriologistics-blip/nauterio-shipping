import { Controller, Get, Injectable, Module, Param, ParseUUIDPipe, Patch, Query, UseGuards } from "@nestjs/common";
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
          where: { userId, channel: "IN_APP" },
          include: { deliveryAttempts: true },
          orderBy: { id: "desc" },
          ...page,
        }),
      pagination
    );
  }

  async unreadCount(userId: string) {
    return { count: await getPrismaClient().notification.count({ where: { userId, channel: "IN_APP", readAt: null } }) };
  }

  async markRead(id: string, userId: string) {
    const result = await getPrismaClient().notification.updateMany({ where: { id, userId, channel: "IN_APP" }, data: { readAt: new Date() } });
    return { updated: result.count === 1 };
  }

  async markAllRead(userId: string) {
    const result = await getPrismaClient().notification.updateMany({ where: { userId, channel: "IN_APP", readAt: null }, data: { readAt: new Date() } });
    return { updated: result.count };
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

  @Get("unread-count")
  async unreadCount(@CurrentUser() user: AuthenticatedUser) {
    return this.service.unreadCount(user.userId);
  }

  @Patch("read-all")
  async markAllRead(@CurrentUser() user: AuthenticatedUser) {
    return this.service.markAllRead(user.userId);
  }

  @Patch(":id/read")
  async markRead(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.markRead(id, user.userId);
  }
}

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

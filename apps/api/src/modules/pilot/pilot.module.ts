import { BadRequestException, Body, Controller, Get, Injectable, Module, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard, type AuthenticatedUser } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import { AuditService } from "../audit/audit.module";

class CreatePilotIssueDto {
  @IsString() @MinLength(3) @MaxLength(160) title!: string;
  @IsString() @MinLength(5) @MaxLength(4000) description!: string;
  @IsIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"]) severity!: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  @IsOptional() @IsUUID() shipmentId?: string;
}
class UpdatePilotIssueDto {
  @IsIn(["OPEN", "INVESTIGATING", "RESOLVED", "CLOSED"]) status!: "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED";
  @IsOptional() @IsUUID() assignedToUserId?: string;
  @IsOptional() @IsString() @MaxLength(4000) resolution?: string;
}

@Injectable()
class PilotService {
  constructor(private readonly audit: AuditService) {}
  async summary() {
    const prisma = getPrismaClient();
    const start = new Date(); start.setUTCHours(0, 0, 0, 0);
    const [pilotCustomers, submittedRequests, activeShipments, actionRequired, deliveredToday, documentsScanning, documentsAwaitingReview, failedEvents, openIssues, criticalIssues, oldestPending] = await Promise.all([
      prisma.user.count({ where: { staffRole: null, status: "ACTIVE" } }),
      prisma.booking.count({ where: { requestStatus: "SUBMITTED" } }),
      prisma.shipment.count({ where: { lifecycleStatus: "ACTIVE" } }),
      prisma.shipment.count({ where: { lifecycleStatus: "ACTION_REQUIRED" } }),
      prisma.shipment.count({ where: { lifecycleStatus: "DELIVERED", deliveredAt: { gte: start } } }),
      prisma.documentVersion.count({ where: { malwareScanResult: "PENDING", isCurrentVersionFor: { isNot: null } } }),
      prisma.document.count({ where: { reviewStatus: "PROCESSING", currentVersion: { malwareScanResult: "CLEAN" } } }),
      prisma.outboxEvent.count({ where: { status: { in: ["FAILED", "DEAD_LETTERED"] } } }),
      prisma.pilotIssue.count({ where: { status: { in: ["OPEN", "INVESTIGATING"] } } }),
      prisma.pilotIssue.count({ where: { status: { in: ["OPEN", "INVESTIGATING"] }, severity: "CRITICAL" } }),
      prisma.outboxEvent.findFirst({ where: { status: "PENDING" }, orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
    ]);
    return { pilotCustomers, submittedRequests, activeShipments, actionRequired, deliveredToday, documentsScanning, documentsAwaitingReview, failedEvents, openIssues, criticalIssues, oldestPendingEventSeconds: oldestPending ? Math.floor((Date.now() - oldestPending.createdAt.getTime()) / 1000) : 0, generatedAt: new Date().toISOString() };
  }
  async list(status?: string) {
    const valid = ["OPEN", "INVESTIGATING", "RESOLVED", "CLOSED"];
    return getPrismaClient().pilotIssue.findMany({ where: status && valid.includes(status) ? { status: status as never } : {}, orderBy: [{ severity: "desc" }, { createdAt: "asc" }], take: 200, include: { shipment: { select: { trackingNumber: true } }, reportedByUser: { select: { fullName: true } }, assignedToUser: { select: { fullName: true } } } });
  }
  async create(dto: CreatePilotIssueDto, user: AuthenticatedUser, correlationId: string) {
    return getPrismaClient().$transaction(async (tx) => {
      if (dto.shipmentId && !(await tx.shipment.count({ where: { id: dto.shipmentId } }))) throw new NotFoundException("Shipment not found");
      const issue = await tx.pilotIssue.create({ data: { title: dto.title.trim(), description: dto.description.trim(), severity: dto.severity, shipmentId: dto.shipmentId, reportedByUserId: user.userId } });
      await this.audit.record({ actorUserId: user.userId, action: "PILOT_ISSUE_CREATED", entityType: "PilotIssue", entityId: issue.id, afterJson: { severity: issue.severity, status: issue.status }, correlationId }, tx);
      return issue;
    });
  }
  async update(id: string, dto: UpdatePilotIssueDto, user: AuthenticatedUser, correlationId: string) {
    return getPrismaClient().$transaction(async (tx) => {
      const before = await tx.pilotIssue.findUnique({ where: { id } }); if (!before) throw new NotFoundException("Pilot issue not found");
      const done = dto.status === "RESOLVED" || dto.status === "CLOSED";
      const transitions: Record<string, string[]> = { OPEN: ["INVESTIGATING", "RESOLVED", "CLOSED"], INVESTIGATING: ["OPEN", "RESOLVED", "CLOSED"], RESOLVED: ["CLOSED"], CLOSED: [] };
      if (!transitions[before.status].includes(dto.status)) throw new BadRequestException(`Pilot issue cannot move from ${before.status} to ${dto.status}.`);
      if (done && !dto.resolution?.trim()) throw new BadRequestException("A resolution note is required.");
      if (dto.assignedToUserId && !(await tx.user.count({ where: { id: dto.assignedToUserId, staffRole: { not: null }, status: "ACTIVE" } }))) throw new BadRequestException("Assignee must be an active staff member.");
      const issue = await tx.pilotIssue.update({ where: { id }, data: { status: dto.status, assignedToUserId: dto.assignedToUserId, resolution: dto.resolution?.trim(), resolvedAt: done ? before.resolvedAt ?? new Date() : null } });
      await this.audit.record({ actorUserId: user.userId, action: "PILOT_ISSUE_UPDATED", entityType: "PilotIssue", entityId: id, beforeJson: { status: before.status }, afterJson: { status: issue.status }, reason: dto.resolution?.trim(), correlationId }, tx);
      return issue;
    });
  }
}

@ApiTags("pilot") @ApiBearerAuth() @UseGuards(AuthGuard, PermissionGuard) @Controller("admin/pilot")
class PilotController {
  constructor(private readonly service: PilotService) {}
  @Get("summary") @RequirePermission("pilot:manage") summary() { return this.service.summary(); }
  @Get("issues") @RequirePermission("pilot:manage") list(@Query("status") status?: string) { return this.service.list(status); }
  @Post("issues") @RequirePermission("pilot:manage") create(@Body() dto: CreatePilotIssueDto, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) { return this.service.create(dto, user, correlationId); }
  @Patch("issues/:id") @RequirePermission("pilot:manage") update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdatePilotIssueDto, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) { return this.service.update(id, dto, user, correlationId); }
}

@Module({ controllers: [PilotController], providers: [PilotService] })
export class PilotModule {}

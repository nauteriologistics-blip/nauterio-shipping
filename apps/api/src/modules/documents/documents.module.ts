import {
  Controller,
  ForbiddenException,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { STAFF_ROLES } from "@nauterio/contracts";
import { evaluatePermission } from "@nauterio/validation";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

/** Documents module (spec section 24 and 28.1): upload, malware result,
 * version, review, generation, access, retention. Metadata read path only -
 * the real pre-signed-S3 upload flow (spec 28.1) needs a real S3 bucket/KMS
 * key, which is AWS infrastructure not yet provisioned (ADR 0001 section
 * 10). Do not fake a "successful upload" without real quarantine/malware
 * scanning behind it - that would violate the exact security control this
 * module exists to enforce. */
@Injectable()
class DocumentsService {
  /** "My documents" - always scoped to the caller's own ownerUserId,
   * regardless of role. Staff have their own tooling for cross-customer
   * document review; this is specifically the customer-portal list. */
  async listMine(caller: AuthenticatedUser) {
    const prisma = getPrismaClient();
    return prisma.document.findMany({
      where: { ownerUserId: caller.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        reviewStatus: true,
        shipmentId: true,
        createdAt: true,
        currentVersion: {
          select: { fileSizeBytes: true, contentType: true, malwareScanResult: true },
        },
      },
    });
  }

  async getById(id: string, caller: AuthenticatedUser) {
    const prisma = getPrismaClient();
    const doc = await prisma.document.findUnique({ where: { id }, include: { versions: true } });
    if (!doc) throw new NotFoundException(`Document ${id} not found`);

    const isStaff = (STAFF_ROLES as readonly string[]).includes(caller.role);
    const isOwner = doc.ownerUserId === caller.userId;

    // SEC-003: not the owner and not staff -> 404, never expose existence.
    if (!isOwner && !isStaff) {
      throw new NotFoundException(`Document ${id} not found`);
    }

    // identity_document:view is a deliberately restricted staff permission
    // (spec: only SUPER_ADMIN/CUSTOMS) separate from the general
    // document:read baseline - a staff member with only document:read must
    // not use this route to view someone else's passport/ID scan.
    if (!isOwner && doc.type === "IDENTITY_DOCUMENT") {
      const decision = evaluatePermission(
        {
          userId: caller.userId,
          accountStatus: caller.accountStatus as never,
          role: caller.role,
          organisationId: caller.organisationId,
          warehouseIds: caller.warehouseIds,
          approvalLimitAmountMinorUnits: caller.approvalLimitAmountMinorUnits,
        },
        { action: "identity_document:view" }
      );
      if (!decision.allowed) {
        throw new ForbiddenException(decision.reason);
      }
    }

    // Never return the raw S3 location to a non-staff caller - an opaque
    // version id is enough for the frontend to request a signed download
    // URL through a future dedicated endpoint.
    if (!isStaff) {
      return {
        ...doc,
        versions: doc.versions.map((v) => ({
          id: v.id,
          versionNumber: v.versionNumber,
          fileSizeBytes: v.fileSizeBytes,
          contentType: v.contentType,
          malwareScanResult: v.malwareScanResult,
          createdAt: v.createdAt,
        })),
      };
    }

    return doc;
  }
}

@ApiTags("documents")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("documents")
class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Get()
  @RequirePermission("document:read")
  async listMine(@CurrentUser() user: AuthenticatedUser) {
    return this.service.listMine(user);
  }

  @Get(":id")
  @RequirePermission("document:read")
  async getById(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.getById(id, user);
  }
}

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}

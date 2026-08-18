import {
  Controller,
  Body,
  BadRequestException,
  ForbiddenException,
  Get,
  Headers,
  Injectable,
  Module,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { S3CompatibleStorage } from "@nauterio/integrations";
import { loadApiConfig } from "@nauterio/configuration";
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { createHash } from "node:crypto";
import { CorrelationId } from "../../common/decorators/correlation-id.decorator";
import { AuditService } from "../audit/audit.module";
import { STAFF_ROLES } from "@nauterio/contracts";
import { evaluatePermission } from "@nauterio/validation";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { RequirePermission } from "../../common/decorators/require-permission.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

const ALLOWED_CONTENT_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const;
const UPLOAD_DOCUMENT_TYPES = ["COMMERCIAL_INVOICE", "PACKING_LIST", "IDENTITY_DOCUMENT", "CUSTOMS_SUPPORTING_EVIDENCE", "OTHER"] as const;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

class InitiateUploadDto {
  @IsIn(UPLOAD_DOCUMENT_TYPES) type!: (typeof UPLOAD_DOCUMENT_TYPES)[number];
  @IsIn(ALLOWED_CONTENT_TYPES) contentType!: (typeof ALLOWED_CONTENT_TYPES)[number];
  @IsInt() @Min(1) @Max(MAX_UPLOAD_BYTES) fileSizeBytes!: number;
  @IsOptional() @IsUUID() shipmentId?: string;
}
class ScanResultDto { @IsIn(["CLEAN", "INFECTED", "ERROR"]) result!: "CLEAN" | "INFECTED" | "ERROR"; @IsOptional() @IsString() detail?: string; }
class ReviewDocumentDto {
  @IsIn(["APPROVED", "REJECTED", "REPLACEMENT_REQUIRED"]) decision!: "APPROVED" | "REJECTED" | "REPLACEMENT_REQUIRED";
  @IsOptional() @IsString() reason?: string;
}

/** Documents module (spec section 24 and 28.1): upload, malware result,
 * version, review, generation, access, retention. Metadata read path only -
 * the real pre-signed-S3 upload flow (spec 28.1) needs a real S3 bucket/KMS
 * key, which is AWS infrastructure not yet provisioned (ADR 0001 section
 * 10). Do not fake a "successful upload" without real quarantine/malware
 * scanning behind it - that would violate the exact security control this
 * module exists to enforce. */
@Injectable()
class DocumentsService {
  constructor(private readonly auditService: AuditService) {}
  private storage() {
    const c = loadApiConfig();
    if (!c.OBJECT_STORAGE_ENDPOINT || !c.OBJECT_STORAGE_BUCKET || !c.OBJECT_STORAGE_ACCESS_KEY_ID || !c.OBJECT_STORAGE_SECRET_ACCESS_KEY) throw new BadRequestException("Secure document storage is not configured.");
    return new S3CompatibleStorage({ endpoint: c.OBJECT_STORAGE_ENDPOINT, region: c.OBJECT_STORAGE_REGION, bucket: c.OBJECT_STORAGE_BUCKET, accessKeyId: c.OBJECT_STORAGE_ACCESS_KEY_ID, secretAccessKey: c.OBJECT_STORAGE_SECRET_ACCESS_KEY });
  }

  async initiateUpload(dto: InitiateUploadDto, caller: AuthenticatedUser) {
    const prisma = getPrismaClient();
    const storage = this.storage();
    const bucket = loadApiConfig().OBJECT_STORAGE_BUCKET;
    if (dto.shipmentId) {
      const owned = await prisma.shipment.count({ where: { id: dto.shipmentId, ownerUserId: caller.userId } });
      if (!owned) throw new NotFoundException("Shipment not found");
    }
    const created = await prisma.$transaction(async (tx) => {
      const document = await tx.document.create({ data: { ownerUserId: caller.userId, shipmentId: dto.shipmentId, type: dto.type } });
      const key = `quarantine/${caller.userId}/${document.id}/1`;
      const version = await tx.documentVersion.create({ data: { documentId: document.id, versionNumber: 1, s3ObjectKey: key, s3Bucket: bucket, fileSizeBytes: dto.fileSizeBytes, contentType: dto.contentType, uploadedByUserId: caller.userId } });
      await tx.document.update({ where: { id: document.id }, data: { currentVersionId: version.id } });
      return { document, version };
    });
    return { documentId: created.document.id, versionId: created.version.id, uploadUrl: storage.presign("PUT", created.version.s3ObjectKey, 300), expiresInSeconds: 300 };
  }

  async completeUpload(documentId: string, caller: AuthenticatedUser) {
    const prisma = getPrismaClient();
    const document = await prisma.document.findFirst({ where: { id: documentId, ownerUserId: caller.userId }, include: { currentVersion: true } });
    if (!document?.currentVersion) throw new NotFoundException("Document not found");
    if (document.currentVersion.malwareScanResult !== "PENDING") throw new BadRequestException("Upload has already been completed.");
    const object = await this.storage().head(document.currentVersion.s3ObjectKey);
    if (object.size !== document.currentVersion.fileSizeBytes || object.contentType.split(";")[0] !== document.currentVersion.contentType) throw new BadRequestException("Uploaded file does not match the declared size or type.");
    const config = loadApiConfig();
    if (!config.MALWARE_SCANNER_URL || !config.MALWARE_SCANNER_TOKEN) throw new BadRequestException("Malware scanning is not configured.");
    const scanResponse = await fetch(config.MALWARE_SCANNER_URL, { method: "POST", headers: { Authorization: `Bearer ${config.MALWARE_SCANNER_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ versionId: document.currentVersion.id, downloadUrl: this.storage().presign("GET", document.currentVersion.s3ObjectKey, 900), callbackUrl: `${config.API_PUBLIC_URL}/v1/document-scans/${document.currentVersion.id}` }) });
    if (!scanResponse.ok) throw new BadRequestException("The malware scanner could not accept this file.");
    return { documentId, status: "PROCESSING" };
  }

  async initiateReplacement(documentId: string, dto: InitiateUploadDto, caller: AuthenticatedUser) {
    const storage = this.storage();
    const bucket = loadApiConfig().OBJECT_STORAGE_BUCKET;
    const result = await getPrismaClient().$transaction(async (tx) => {
      const document = await tx.document.findFirst({ where: { id: documentId, ownerUserId: caller.userId }, include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } } });
      if (!document) throw new NotFoundException("Document not found");
      if (document.reviewStatus !== "REPLACEMENT_REQUIRED") throw new BadRequestException("This document is not awaiting replacement.");
      const versionNumber = (document.versions[0]?.versionNumber ?? 0) + 1;
      const key = `quarantine/${caller.userId}/${document.id}/${versionNumber}`;
      const version = await tx.documentVersion.create({ data: { documentId, versionNumber, s3ObjectKey: key, s3Bucket: bucket, fileSizeBytes: dto.fileSizeBytes, contentType: dto.contentType, uploadedByUserId: caller.userId } });
      await tx.document.update({ where: { id: documentId }, data: { currentVersionId: version.id, reviewStatus: "PROCESSING", reviewReason: null, reviewedAt: null, reviewedByUserId: null } });
      return version;
    });
    return { documentId, versionId: result.id, uploadUrl: storage.presign("PUT", result.s3ObjectKey, 300), expiresInSeconds: 300 };
  }

  async download(id: string, caller: AuthenticatedUser) {
    const document = await getPrismaClient().document.findFirst({ where: { id, ownerUserId: caller.userId }, include: { currentVersion: true } });
    if (!document?.currentVersion) throw new NotFoundException("Document not found");
    if (document.currentVersion.malwareScanResult !== "CLEAN") throw new ForbiddenException("This document is not available until security scanning passes.");
    return { downloadUrl: this.storage().presign("GET", document.currentVersion.s3ObjectKey, 60), expiresInSeconds: 60 };
  }

  private canViewIdentity(caller: AuthenticatedUser): boolean {
    return evaluatePermission({ userId: caller.userId, accountStatus: caller.accountStatus as never, role: caller.role, organisationId: caller.organisationId, warehouseIds: caller.warehouseIds, approvalLimitAmountMinorUnits: caller.approvalLimitAmountMinorUnits }, { action: "identity_document:view" }).allowed;
  }

  async listForReview(caller: AuthenticatedUser, status = "PROCESSING") {
    if (!["PROCESSING", "APPROVED", "REJECTED", "REPLACEMENT_REQUIRED"].includes(status)) throw new BadRequestException("Invalid review status.");
    return getPrismaClient().document.findMany({
      where: { reviewStatus: status as never, ...(this.canViewIdentity(caller) ? {} : { type: { not: "IDENTITY_DOCUMENT" } }) }, orderBy: { createdAt: "asc" }, take: 100,
      select: { id: true, type: true, reviewStatus: true, createdAt: true, ownerUser: { select: { fullName: true, email: true } }, shipment: { select: { trackingNumber: true } }, currentVersion: { select: { id: true, fileSizeBytes: true, contentType: true, malwareScanResult: true } } },
    });
  }

  async staffReviewUrl(id: string, caller: AuthenticatedUser) {
    const document = await getPrismaClient().document.findUnique({ where: { id }, include: { currentVersion: true } });
    if (!document?.currentVersion) throw new NotFoundException("Document not found");
    if (document.type === "IDENTITY_DOCUMENT" && !this.canViewIdentity(caller)) throw new ForbiddenException("Identity documents require customs clearance permission.");
    if (document.currentVersion.malwareScanResult !== "CLEAN") throw new ForbiddenException("Only files that passed malware scanning can be reviewed.");
    return { downloadUrl: this.storage().presign("GET", document.currentVersion.s3ObjectKey, 60), expiresInSeconds: 60 };
  }

  async review(id: string, dto: ReviewDocumentDto, caller: AuthenticatedUser, correlationId?: string) {
    if (dto.decision !== "APPROVED" && !dto.reason?.trim()) throw new BadRequestException("A reason is required for rejection or replacement.");
    return getPrismaClient().$transaction(async (tx) => {
      const document = await tx.document.findUnique({ where: { id }, include: { currentVersion: true } });
      if (!document?.currentVersion) throw new NotFoundException("Document not found");
      if (document.type === "IDENTITY_DOCUMENT" && !this.canViewIdentity(caller)) throw new ForbiddenException("Identity documents require customs clearance permission.");
      if (document.reviewStatus !== "PROCESSING") throw new BadRequestException("This document has already been reviewed.");
      if (document.currentVersion.malwareScanResult !== "CLEAN") throw new BadRequestException("The document must pass malware scanning before review.");
      const updated = await tx.document.update({ where: { id }, data: { reviewStatus: dto.decision, reviewReason: dto.reason?.trim() ?? null, reviewedAt: new Date(), reviewedByUserId: caller.userId } });
      await this.auditService.record({ actorUserId: caller.userId, action: "DOCUMENT_REVIEWED", entityType: "Document", entityId: id, beforeJson: { reviewStatus: document.reviewStatus }, afterJson: { reviewStatus: dto.decision }, reason: dto.reason?.trim(), correlationId }, tx);
      if (document.ownerUserId) await tx.notification.create({ data: { userId: document.ownerUserId, templateCode: "document_reviewed", channel: "IN_APP", renderedSubject: `Document ${dto.decision.toLowerCase().replace(/_/g, " ")}`, renderedBodyHash: createHash("sha256").update(`${id}:${dto.decision}:${dto.reason ?? ""}`).digest("hex") } });
      return updated;
    });
  }
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
        reviewReason: true,
        reviewedAt: true,
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

  @Post("uploads/initiate")
  @RequirePermission("document:read")
  async initiate(@Body() dto: InitiateUploadDto, @CurrentUser() user: AuthenticatedUser) { return this.service.initiateUpload(dto, user); }

  @Post(":id/uploads/complete")
  @RequirePermission("document:read")
  async complete(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) { return this.service.completeUpload(id, user); }

  @Post(":id/replacements/initiate")
  @RequirePermission("document:read")
  async replace(@Param("id", ParseUUIDPipe) id: string, @Body() dto: InitiateUploadDto, @CurrentUser() user: AuthenticatedUser) { return this.service.initiateReplacement(id, dto, user); }

  @Get(":id/download")
  @RequirePermission("document:read")
  async download(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) { return this.service.download(id, user); }
}

@ApiTags("document-scans")
@Controller("document-scans")
class DocumentScanCallbackController {
  @Post(":versionId")
  async result(@Param("versionId", ParseUUIDPipe) versionId: string, @Headers("authorization") authorization: string | undefined, @Body() dto: ScanResultDto) {
    const config = loadApiConfig();
    if (!config.MALWARE_SCANNER_TOKEN || authorization !== `Bearer ${config.MALWARE_SCANNER_TOKEN}`) throw new UnauthorizedException();
    const prisma = getPrismaClient();
    const changed = await prisma.documentVersion.updateMany({ where: { id: versionId, malwareScanResult: "PENDING" }, data: { malwareScanResult: dto.result } });
    if (!changed.count) {
      const exists = await prisma.documentVersion.count({ where: { id: versionId } });
      if (!exists) throw new NotFoundException("Document version not found");
      return { accepted: true, duplicate: true };
    }
    const version = await prisma.documentVersion.findUniqueOrThrow({ where: { id: versionId } });
    if (dto.result === "INFECTED" || dto.result === "ERROR") await prisma.document.update({ where: { id: version.documentId }, data: { reviewStatus: "REJECTED" } });
    return { accepted: true };
  }
}

@ApiTags("admin-documents")
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionGuard)
@Controller("admin/documents")
class AdminDocumentsController {
  constructor(private readonly service: DocumentsService) {}
  @Get()
  @RequirePermission("document:review")
  async list(@CurrentUser() user: AuthenticatedUser, @Query("status") status?: string) { return this.service.listForReview(user, status ?? "PROCESSING"); }
  @Get(":id/review-url")
  @RequirePermission("document:review")
  async reviewUrl(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) { return this.service.staffReviewUrl(id, user); }
  @Post(":id/review")
  @RequirePermission("document:review")
  async review(@Param("id", ParseUUIDPipe) id: string, @Body() dto: ReviewDocumentDto, @CurrentUser() user: AuthenticatedUser, @CorrelationId() correlationId: string) { return this.service.review(id, dto, user, correlationId); }
}

@Module({
  controllers: [DocumentsController, DocumentScanCallbackController, AdminDocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}

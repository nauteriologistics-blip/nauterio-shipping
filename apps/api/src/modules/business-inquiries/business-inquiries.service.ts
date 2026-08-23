import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { getPrismaClient } from "@nauterio/database";
import { loadApiConfig } from "@nauterio/configuration";
import { sliceCursorPage } from "../../common/pagination/paginate-cursor";
import type { CreateBusinessInquiryDto, UpdateBusinessInquiryDto } from "./dto/business-inquiry.dto";

@Injectable()
export class BusinessInquiriesService {
  async create(dto: CreateBusinessInquiryDto, params: { correlationId: string; userAgent?: string }) {
    const prisma = getPrismaClient();
    const config = loadApiConfig();
    const workEmail = dto.workEmail.trim().toLowerCase();
    const message = dto.message?.trim() || null;
    const userAgentHash = params.userAgent
      ? createHash("sha256").update(params.userAgent).digest("hex")
      : null;

    return prisma.$transaction(async (tx) => {
      const inquiry = await tx.businessInquiry.create({
        data: {
          companyName: dto.companyName.trim(),
          monthlyVolume: dto.monthlyVolume,
          workEmail,
          message,
          userAgentHash,
        },
      });

      if (config.BUSINESS_INQUIRY_TO_EMAIL) {
        await tx.outboxEvent.create({
          data: {
            eventType: "business.inquiry.created",
            correlationId: params.correlationId,
            payloadJson: {
              inquiryId: inquiry.id,
              email: config.BUSINESS_INQUIRY_TO_EMAIL,
              templateCode: "business_inquiry_created",
              companyName: inquiry.companyName,
              workEmail: inquiry.workEmail,
              monthlyVolume: inquiry.monthlyVolume,
              message: inquiry.message ?? "",
            },
          },
        });
      }

      return inquiry;
    });
  }

  async list(params: { status?: string; after?: string; limit?: number }) {
    const prisma = getPrismaClient();
    const limit = Math.min(params.limit ?? 25, 100);
    const allowed = new Set(["OPEN", "CONTACTED", "CLOSED"]);
    const status = params.status && allowed.has(params.status) ? params.status : undefined;
    const cursor = params.after ? { id: params.after } : undefined;
    const rows = await prisma.businessInquiry.findMany({
      where: status ? { status } : {},
      take: limit + 1,
      cursor,
      skip: cursor ? 1 : 0,
      orderBy: { id: "desc" },
    });
    return sliceCursorPage(rows, limit);
  }

  async update(id: string, dto: UpdateBusinessInquiryDto, reviewerUserId: string) {
    const prisma = getPrismaClient();
    return prisma.businessInquiry.update({
      where: { id },
      data: {
        status: dto.status,
        reviewedById: reviewerUserId,
        reviewedAt: new Date(),
      },
    });
  }
}

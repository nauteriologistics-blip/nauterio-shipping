import { Global, Injectable, Module } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";

export interface RecordAuditEventInput {
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  beforeJson?: unknown;
  afterJson?: unknown;
  correlationId: string;
  ipAddress?: string;
  reason?: string;
  approvalReference?: string;
}

/**
 * Audit module (spec section 24, 27.4): append-only high-risk activity.
 * @Global so every other module can inject AuditService without importing
 * AuditModule explicitly everywhere - matches the "record every write from
 * AdminController... in the SAME transaction as the business change" rule
 * in ADR 0001 section 6.3 (callers pass a Prisma transaction client in a
 * follow-up iteration; this version writes directly, which is the gap to
 * close before this module is relied on for real compliance evidence).
 */
@Injectable()
export class AuditService {
  async record(input: RecordAuditEventInput): Promise<void> {
    const prisma = getPrismaClient();
    await prisma.auditEvent.create({
      data: {
        actorUserId: input.actorUserId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        beforeJson: input.beforeJson as never,
        afterJson: input.afterJson as never,
        correlationId: input.correlationId,
        ipAddress: input.ipAddress,
        reason: input.reason,
        approvalReference: input.approvalReference,
      },
    });
  }
}

@Global()
@Module({
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}

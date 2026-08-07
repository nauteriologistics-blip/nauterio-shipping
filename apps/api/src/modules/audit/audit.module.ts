import { Global, Injectable, Module } from "@nestjs/common";
import { getPrismaClient, Prisma } from "@nauterio/database";

/** The callback parameter type from `prisma.$transaction(async (tx) => ...)`. */
export type AuditTransactionClient = Prisma.TransactionClient;

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
 * AuditModule explicitly everywhere.
 *
 * Callers that write a business change in a `prisma.$transaction(async (tx)
 * => ...)` block MUST pass that same `tx` as the second argument here (ADR
 * 0001 section 6.3: "record every write in the SAME transaction as the
 * business change" - otherwise a crash between the two writes could leave
 * a change with no audit trail, or an audit entry for a change that never
 * committed). `tx` is optional only for genuinely standalone audit events
 * that have no accompanying write to be atomic with.
 */
@Injectable()
export class AuditService {
  async record(input: RecordAuditEventInput, tx?: AuditTransactionClient): Promise<void> {
    const client = tx ?? getPrismaClient();
    await client.auditEvent.create({
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

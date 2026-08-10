import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { evaluatePermission } from "@nauterio/validation";
import { STAFF_ROLES } from "@nauterio/contracts";
import { AuditService } from "../audit/audit.module";
import { SubmitClaimDto, DecideClaimDto } from "./dto/submit-claim.dto";
import { sliceCursorPage } from "../../common/pagination/paginate-cursor";
import { getScopedShipmentOrThrow } from "../../common/authorization/shipment-scope";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

function isStaff(role: string): boolean {
  return (STAFF_ROLES as readonly string[]).includes(role);
}

// A claim only makes sense once a shipment has actually moved or resolved -
// not while it is still a draft, and not once it has been cancelled or
// archived. REQUIRES_BUSINESS_EVIDENCE: the exact claimable lifecycle set
// is a policy decision (spec does not enumerate one); this is a
// conservative default, not a business rate/rule invented outright.
const CLAIMABLE_LIFECYCLE_STATUSES = ["ACTIVE", "ACTION_REQUIRED", "DELIVERED"] as const;
const OPEN_CLAIM_STATUSES = ["SUBMITTED", "UNDER_REVIEW"] as const;

@Injectable()
export class ClaimsReturnsService {
  constructor(private readonly auditService: AuditService) {}

  async listClaims(user: AuthenticatedUser, after?: string, limitCount?: number) {
    const prisma = getPrismaClient();
    const limit = Math.min(limitCount ?? 20, 100);

    // No organisationId on Claim, so the only real scoping choice for a
    // non-staff caller (customer OR organisation member/admin) is "their
    // own submitted claims" - broadening beyond the CUSTOMER role literal
    // so ORGANISATION_MEMBER/ORGANISATION_ADMIN callers don't fall through
    // to seeing every claim.
    const where: { submittedByUserId?: string } = {};
    if (!isStaff(user.role)) {
      where.submittedByUserId = user.userId;
    }

    const cursor = after ? { id: after } : undefined;

    const claims = await prisma.claim.findMany({
      where,
      take: limit + 1,
      cursor,
      skip: cursor ? 1 : 0,
      orderBy: { id: "desc" },
    });

    return sliceCursorPage(claims, limit);
  }

  async getClaimById(id: string, user: AuthenticatedUser) {
    const prisma = getPrismaClient();
    const claim = await prisma.claim.findUnique({
      where: { id },
      include: { decisions: true },
    });
    if (!claim) throw new NotFoundException(`Claim ${id} not found`);

    if (!isStaff(user.role) && claim.submittedByUserId !== user.userId) {
      throw new ForbiddenException("Access denied to this claim");
    }

    return claim;
  }

  async submit(user: AuthenticatedUser, dto: SubmitClaimDto, correlationId?: string) {
    const prisma = getPrismaClient();

    // SEC-004/DATA-006: resolve the shipment through the same scope helper
    // every other shipment-adjacent route uses - a claim against a
    // shipment the caller cannot see 404s instead of silently succeeding
    // against someone else's consignment.
    const shipment = await getScopedShipmentOrThrow(dto.shipmentId, {
      role: user.role,
      userId: user.userId,
      organisationId: user.organisationId,
    });

    if (!(CLAIMABLE_LIFECYCLE_STATUSES as readonly string[]).includes(shipment.lifecycleStatus)) {
      throw new BadRequestException(
        `Shipment ${dto.shipmentId} is not in a claimable state (${shipment.lifecycleStatus})`
      );
    }

    const existingOpenClaim = await prisma.claim.findFirst({
      where: {
        shipmentId: dto.shipmentId,
        submittedByUserId: user.userId,
        reasonCategory: dto.reasonCategory,
        status: { in: [...OPEN_CLAIM_STATUSES] },
      },
    });
    if (existingOpenClaim) {
      throw new BadRequestException(
        `An open ${dto.reasonCategory} claim already exists for this shipment (${existingOpenClaim.id})`
      );
    }

    return prisma.$transaction(async (tx) => {
      const claim = await tx.claim.create({
        data: {
          shipmentId: dto.shipmentId,
          submittedByUserId: user.userId,
          reasonCategory: dto.reasonCategory,
          description: dto.description,
          status: "SUBMITTED",
        },
      });

      await this.auditService.record(
        {
          actorUserId: user.userId,
          action: "CLAIM_SUBMITTED",
          entityType: "Claim",
          entityId: claim.id,
          afterJson: claim,
          correlationId,
        },
        tx
      );

      return claim;
    });
  }

  private decide(id: string, user: AuthenticatedUser, decision: "APPROVED" | "REJECTED", claim: { submittedByUserId: string }, dto: DecideClaimDto) {
    const action = decision === "APPROVED" ? "claim:approve" : "claim:reject";

    // Separation of duties rule (spec section 27.3): submitter cannot decide their own claim.
    const perm = evaluatePermission(
      {
        userId: user.userId,
        accountStatus: user.accountStatus as never,
        role: user.role,
        organisationId: user.organisationId,
        warehouseIds: user.warehouseIds,
        approvalLimitAmountMinorUnits: user.approvalLimitAmountMinorUnits,
      },
      { action, recordOwnerUserId: claim.submittedByUserId }
    );

    if (!perm.allowed) {
      throw new ForbiddenException(`${decision === "APPROVED" ? "Approval" : "Rejection"} forbidden: ${perm.reason}`);
    }

    const prisma = getPrismaClient();

    return prisma.$transaction(async (tx) => {
      const updated = await tx.claim.update({
        where: { id },
        data: { status: decision },
      });

      const claimDecision = await tx.claimDecision.create({
        data: {
          claimId: id,
          decision,
          decidedByUserId: user.userId,
          compensationAmountMinorUnits: dto.approvedAmountMinorUnits ? BigInt(dto.approvedAmountMinorUnits) : undefined,
          compensationCurrency: dto.approvedAmountMinorUnits ? "EUR" : undefined,
          reason: dto.reasonNotes,
        },
      });

      await this.auditService.record(
        {
          actorUserId: user.userId,
          action: decision === "APPROVED" ? "CLAIM_APPROVED" : "CLAIM_REJECTED",
          entityType: "Claim",
          entityId: id,
          afterJson: { claim: updated, decision: claimDecision },
        },
        tx
      );

      return { ...updated, decision: claimDecision };
    });
  }

  async approveClaim(id: string, user: AuthenticatedUser, dto: DecideClaimDto) {
    const claim = await this.getClaimById(id, user);
    return this.decide(id, user, "APPROVED", claim, dto);
  }

  async rejectClaim(id: string, user: AuthenticatedUser, dto: DecideClaimDto) {
    const claim = await this.getClaimById(id, user);
    return this.decide(id, user, "REJECTED", claim, dto);
  }
}

import { BadRequestException, Injectable } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { calculateChargeableWeight } from "@nauterio/validation";
import { getService, type QuoteResult } from "@nauterio/contracts";
import type { CreateQuoteDto } from "./dto/create-quote.dto";
import { AuditService } from "../audit/audit.module";

/**
 * Nauterio's published online planning schedule. These deliberately
 * hardcoded prices give every supported international country pair the
 * same deterministic calculation. They are not carrier tariffs and do not
 * imply a carrier integration; exceptional handling, duties, taxes and
 * storage remain outside the online calculation.
 *
 * DATA-010: every rate and every intermediate is an integer minor unit
 * (cent) from here on - CLAUDE.md and schema.prisma both require money to
 * never be a float. The previous version computed in IEEE-754 EUR floats
 * and converted to minor units only at persistence time
 * (`BigInt(Math.round(x * 100))`), which reproducibly under-charged by one
 * cent at ordinary parcel weights (e.g. weightKg: 0.17 -> stored 3610
 * where 3611 is exact, because `36.105 * 100` evaluates to
 * `3610.4999999999995`). Doing the arithmetic in minor units from the
 * start makes that class of error structurally impossible.
 */
interface FreightRate {
  flatMinorUnits: number;
  perKgMinorUnits: number;
  minimumChargeMinorUnits?: number;
}

const ONLINE_RATES: Record<string, FreightRate> = {
  "air-express": { flatMinorUnits: 3500, perKgMinorUnits: 650 },
  "air-economy": { flatMinorUnits: 2200, perKgMinorUnits: 480 },
  "ocean-freight": { flatMinorUnits: 12000, perKgMinorUnits: 120 },
};

const ONLINE_CUSTOMS_FEE_MINOR_UNITS = 1850;
const ONLINE_PICKUP_FEE_MINOR_UNITS = 1200;
const ONLINE_PROTECTION_RATE_BASIS_POINTS = 150n; // 1.5% = 150 / 10,000
const DE_MINIMIS_THRESHOLD_MINOR_UNITS = 80_000n; // $800

@Injectable()
export class QuotesService {
  constructor(private readonly auditService: AuditService) {}

  async calculate(dto: CreateQuoteDto, correlationId?: string): Promise<QuoteResult> {
    if (dto.originCountry && dto.destinationCountry && dto.originCountry === dto.destinationCountry) {
      throw new BadRequestException("Pickup and delivery countries must be different for an international shipment.");
    }

    const service = getService(dto.service);
    if (!service) {
      throw new BadRequestException(`Unknown service '${dto.service}'`);
    }

    const weights = calculateChargeableWeight({
      actualWeightKg: dto.weightKg,
      lengthCm: dto.lengthCm,
      widthCm: dto.widthCm,
      heightCm: dto.heightCm,
    });

    // calculateChargeableWeight already rounds to 2 decimal places, so
    // multiplying by 100 recovers an exact integer (hundredths of a kg)
    // with no float-representation risk - this is the one, deliberate
    // boundary conversion from float kg to integer arithmetic.
    const chargeableWeightHundredthsKg = BigInt(Math.round(weights.chargeableWeightKg * 100));
    const prisma = getPrismaClient();
    const serviceId = mapServiceId(dto.service);
    const rate = ONLINE_RATES[dto.service];

    const calculatedBaseRateMinorUnits =
      BigInt(rate.flatMinorUnits) +
      divRound(chargeableWeightHundredthsKg * BigInt(rate.perKgMinorUnits), 100n);
    const baseRateMinorUnits = rate.minimumChargeMinorUnits !== undefined
      ? bigintMax(BigInt(rate.minimumChargeMinorUnits), calculatedBaseRateMinorUnits)
      : calculatedBaseRateMinorUnits;

    const customsFeeMinorUnits = dto.addCustoms ? BigInt(ONLINE_CUSTOMS_FEE_MINOR_UNITS) : 0n;
    const pickupFeeMinorUnits = dto.addPickup ? BigInt(ONLINE_PICKUP_FEE_MINOR_UNITS) : 0n;

    // declaredValueEur is a customer-entered float (a form field, not a
    // stored amount) - converted once at the boundary, never touched as a
    // float again.
    const declaredValueMinorUnits = BigInt(Math.round(dto.declaredValueEur * 100));
    const insuranceFeeMinorUnits = dto.addInsurance !== false
      ? divRound(declaredValueMinorUnits * ONLINE_PROTECTION_RATE_BASIS_POINTS, 10_000n)
      : 0n;

    const totalMinorUnits = baseRateMinorUnits + customsFeeMinorUnits + pickupFeeMinorUnits + insuranceFeeMinorUnits;

    const resultWithoutId: Omit<QuoteResult, "quoteId"> = {
      actualWeightKg: weights.actualWeightKg,
      volumetricWeightKg: weights.volumetricWeightKg,
      chargeableWeightKg: weights.chargeableWeightKg,
      service: dto.service,
      // API response is still EUR floats for display (spec/frontend
      // contract unchanged) - this conversion happens exactly once, at the
      // response boundary, from an already-exact minor-unit integer, so it
      // cannot introduce the error the float-first version had.
      baseRateEur: minorToEur(baseRateMinorUnits),
      customsFeeEur: minorToEur(customsFeeMinorUnits),
      pickupFeeEur: minorToEur(pickupFeeMinorUnits),
      insuranceFeeEur: minorToEur(insuranceFeeMinorUnits),
      totalPriceEur: minorToEur(totalMinorUnits),
      isDeMinimisEligible: declaredValueMinorUnits <= DE_MINIMIS_THRESHOLD_MINOR_UNITS,
      isIndicative: true,
      disclaimer: "Calculated from Nauterio's published online planning schedule. Duties, taxes, storage and exceptional handling are separate when applicable.",
    };

    // Persist the quote snapshot (spec section 15.1: "Accepted quotes
    // snapshot every calculation input and rule"). Persisted even for
    // unaccepted quotes so abandonment/conversion can be measured later.
    // total = sum(lines) by construction, not by coincidence (DATA-010) -
    // every line and the total are written from the same BigInt values.
    const quoteId = await prisma.$transaction(async (tx) => {
      const created = await tx.quote.create({
        data: {
          serviceId,
          status: "DRAFT",
          // CreateQuoteDto is a class instance (not a plain object literal),
          // so it lacks the index signature Prisma's InputJsonValue requires
          // structurally even though every field on it is JSON-serialisable.
          // `tsc --noEmit` correctly requires this cast; eslint's type-aware
          // linter resolves a Prisma client type declaration that disagrees
          // (a known projectService/tsc program-resolution gap in a pnpm
          // workspace, not a real redundancy) - tsc is authoritative here
          // since it is what actually builds.
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          inputSnapshotJson: dto as unknown as object,
          actualWeightKg: resultWithoutId.actualWeightKg,
          volumetricWeightKg: resultWithoutId.volumetricWeightKg,
          chargeableWeightKg: resultWithoutId.chargeableWeightKg,
          isIndicative: true,
          totalAmountMinorUnits: totalMinorUnits,
          currency: "EUR",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days, matches draft T&Cs copy
          lines: {
            create: [
              { label: "Freight charge", amountMinorUnits: baseRateMinorUnits, currency: "EUR", sortOrder: 0 },
              ...(customsFeeMinorUnits > 0n
                ? [{ label: "Customs filing", amountMinorUnits: customsFeeMinorUnits, currency: "EUR", sortOrder: 1 }]
                : []),
              ...(pickupFeeMinorUnits > 0n
                ? [{ label: "Pickup", amountMinorUnits: pickupFeeMinorUnits, currency: "EUR", sortOrder: 2 }]
                : []),
              ...(insuranceFeeMinorUnits > 0n
                ? [{ label: "Insurance", amountMinorUnits: insuranceFeeMinorUnits, currency: "EUR", sortOrder: 3 }]
                : []),
            ],
          },
        },
      });

      // SEC-012/DATA-014: this endpoint is anonymous (no AuthGuard - spec
      // 32.2 requires quoting without registration), so there is genuinely
      // no actorUserId to record - `undefined` here is the honest value,
      // not a gap. A priced commercial offer is still worth an audit trail
      // even from an unauthenticated caller.
      await this.auditService.record(
        {
          action: "QUOTE_CALCULATED",
          entityType: "Quote",
          entityId: created.id,
          afterJson: resultWithoutId,
          correlationId,
        },
        tx
      );
      return created.id;
    });

    return { quoteId, ...resultWithoutId };
  }
}

function bigintMax(left: bigint, right: bigint): bigint {
  return left > right ? left : right;
}

/** Round-half-up integer division - `(a + b/2) / b` with BigInt's
 * truncating division, the standard technique for rounding a BigInt ratio
 * to the nearest integer instead of always flooring. */
function divRound(numerator: bigint, denominator: bigint): bigint {
  return (numerator + denominator / 2n) / denominator;
}

function minorToEur(minorUnits: bigint): number {
  return Number(minorUnits) / 100;
}

function mapServiceId(id: string): "AIR_EXPRESS" | "AIR_ECONOMY" | "OCEAN_FREIGHT" {
  const map = { "air-express": "AIR_EXPRESS", "air-economy": "AIR_ECONOMY", "ocean-freight": "OCEAN_FREIGHT" } as const;
  return map[id as keyof typeof map];
}

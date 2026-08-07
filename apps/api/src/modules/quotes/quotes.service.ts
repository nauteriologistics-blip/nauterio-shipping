import { BadRequestException, Injectable } from "@nestjs/common";
import { getPrismaClient } from "@nauterio/database";
import { calculateChargeableWeight } from "@nauterio/validation";
import { getService, type QuoteResult } from "@nauterio/contracts";
import type { CreateQuoteDto } from "./dto/create-quote.dto";

/**
 * Indicative placeholder rate model - REQUIRES_BUSINESS_EVIDENCE. No
 * approved RateCard/RateRule exists yet (CLAUDE.md: do not invent rate
 * cards). This mirrors the same flat+per-kg model the frontend's original
 * mock API used, moved here as the single real implementation, and is used
 * only until a real approved RateCard is loaded (see Prisma model RateCard
 * and its `approved` flag).
 */
const INDICATIVE_RATES: Record<string, { flatEur: number; perKgEur: number }> = {
  "air-express": { flatEur: 35.0, perKgEur: 6.5 },
  "air-economy": { flatEur: 22.0, perKgEur: 4.8 },
  "ocean-freight": { flatEur: 120.0, perKgEur: 1.2 },
};

const INDICATIVE_CUSTOMS_FEE_EUR = 18.5;
const INDICATIVE_PICKUP_FEE_EUR = 12.0;
const INDICATIVE_MIN_INSURANCE_EUR = 8.0;
const INDICATIVE_INSURANCE_RATE = 0.01;

@Injectable()
export class QuotesService {
  async calculate(dto: CreateQuoteDto): Promise<QuoteResult> {
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

    const rate = INDICATIVE_RATES[dto.service];
    const baseRateEur = round2(rate.flatEur + weights.chargeableWeightKg * rate.perKgEur);
    const customsFeeEur = dto.addCustoms ? INDICATIVE_CUSTOMS_FEE_EUR : 0;
    const pickupFeeEur = dto.addPickup ? INDICATIVE_PICKUP_FEE_EUR : 0;
    const insuranceFeeEur = dto.addInsurance
      ? Math.max(INDICATIVE_MIN_INSURANCE_EUR, dto.declaredValueEur * INDICATIVE_INSURANCE_RATE)
      : 0;
    const totalPriceEur = round2(baseRateEur + customsFeeEur + pickupFeeEur + insuranceFeeEur);

    const result: QuoteResult = {
      actualWeightKg: weights.actualWeightKg,
      volumetricWeightKg: weights.volumetricWeightKg,
      chargeableWeightKg: weights.chargeableWeightKg,
      service: dto.service,
      baseRateEur,
      customsFeeEur,
      pickupFeeEur,
      insuranceFeeEur,
      totalPriceEur,
      isDeMinimisEligible: dto.declaredValueEur <= 800,
      isIndicative: true,
      disclaimer:
        "This price is an illustrative estimate, not an approved rate card. Final pricing requires confirmed carrier contracts and rate approval.",
    };

    // Persist the quote snapshot (spec section 15.1: "Accepted quotes
    // snapshot every calculation input and rule"). Persisted even for
    // unaccepted quotes so abandonment/conversion can be measured later.
    const prisma = getPrismaClient();
    await prisma.quote.create({
      data: {
        serviceId: mapServiceId(dto.service),
        status: "DRAFT",
        inputSnapshotJson: dto as unknown as object,
        actualWeightKg: result.actualWeightKg,
        volumetricWeightKg: result.volumetricWeightKg,
        chargeableWeightKg: result.chargeableWeightKg,
        isIndicative: true,
        totalAmountMinorUnits: BigInt(Math.round(totalPriceEur * 100)),
        currency: "EUR",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days, matches draft T&Cs copy
        lines: {
          create: [
            { label: "Freight charge", amountMinorUnits: BigInt(Math.round(baseRateEur * 100)), currency: "EUR", sortOrder: 0 },
            ...(customsFeeEur > 0 ? [{ label: "Customs filing", amountMinorUnits: BigInt(Math.round(customsFeeEur * 100)), currency: "EUR", sortOrder: 1 }] : []),
            ...(pickupFeeEur > 0 ? [{ label: "Pickup", amountMinorUnits: BigInt(Math.round(pickupFeeEur * 100)), currency: "EUR", sortOrder: 2 }] : []),
            ...(insuranceFeeEur > 0 ? [{ label: "Insurance", amountMinorUnits: BigInt(Math.round(insuranceFeeEur * 100)), currency: "EUR", sortOrder: 3 }] : []),
          ],
        },
      },
    });

    return result;
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function mapServiceId(id: string): "AIR_EXPRESS" | "AIR_ECONOMY" | "OCEAN_FREIGHT" {
  const map = { "air-express": "AIR_EXPRESS", "air-economy": "AIR_ECONOMY", "ocean-freight": "OCEAN_FREIGHT" } as const;
  return map[id as keyof typeof map];
}

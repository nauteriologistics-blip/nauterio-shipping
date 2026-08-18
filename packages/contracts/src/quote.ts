import type { ServiceId } from "./services";

export interface QuoteRequest {
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  declaredValueEur: number;
  service: ServiceId;
  addCustoms?: boolean;
  addPickup?: boolean;
  addInsurance?: boolean;
}

export interface QuoteResult {
  quoteId: string;
  actualWeightKg: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  service: ServiceId;
  baseRateEur: number;
  customsFeeEur: number;
  pickupFeeEur: number;
  insuranceFeeEur: number;
  totalPriceEur: number;
  isDeMinimisEligible: boolean;
  /**
   * Always true until a real approved rate card exists (spec: "Decisions
   * still requiring real company evidence" - rate cards/margins). Never
   * remove this flag without an approved RateCard/RateRule record backing
   * the calculation.
   */
  isIndicative: boolean;
  disclaimer: string;
}

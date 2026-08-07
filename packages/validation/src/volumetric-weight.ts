/**
 * Volumetric weight and chargeable weight calculation.
 * Source of truth: spec section 15.1 - "volumetric weight defaults to
 * length x width x height in centimetres divided by 5,000. The divisor is
 * configurable by carrier/service." (No carrier-specific divisor exists yet
 * -> 5000 is the only value in use anywhere in the codebase; do not silently
 * introduce a different divisor for one code path.)
 */
export const DEFAULT_VOLUMETRIC_DIVISOR = 5000;

export interface WeightInput {
  actualWeightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface WeightResult {
  actualWeightKg: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
}

export function calculateChargeableWeight(
  input: WeightInput,
  divisor: number = DEFAULT_VOLUMETRIC_DIVISOR
): WeightResult {
  const { actualWeightKg, lengthCm, widthCm, heightCm } = input;
  if (actualWeightKg < 0 || lengthCm < 0 || widthCm < 0 || heightCm < 0) {
    throw new Error("Weight and dimensions must not be negative");
  }
  const volumetricWeightKg = round2((lengthCm * widthCm * heightCm) / divisor);
  const chargeableWeightKg = Math.max(actualWeightKg, volumetricWeightKg);
  return { actualWeightKg, volumetricWeightKg, chargeableWeightKg };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

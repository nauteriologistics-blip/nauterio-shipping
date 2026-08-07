import { describe, it, expect } from "vitest";
import { calculateChargeableWeight, DEFAULT_VOLUMETRIC_DIVISOR } from "./volumetric-weight";

describe("calculateChargeableWeight", () => {
  it("uses actual weight when it exceeds volumetric weight", () => {
    // 40x30x20 / 5000 = 4.8kg volumetric, well under 12kg actual
    const result = calculateChargeableWeight({
      actualWeightKg: 12,
      lengthCm: 40,
      widthCm: 30,
      heightCm: 20,
    });
    expect(result.volumetricWeightKg).toBe(4.8);
    expect(result.chargeableWeightKg).toBe(12);
  });

  it("uses volumetric weight when it exceeds actual weight (light but bulky package)", () => {
    // 60x50x40 / 5000 = 24kg volumetric, well over 2kg actual
    const result = calculateChargeableWeight({
      actualWeightKg: 2,
      lengthCm: 60,
      widthCm: 50,
      heightCm: 40,
    });
    expect(result.volumetricWeightKg).toBe(24);
    expect(result.chargeableWeightKg).toBe(24);
  });

  it("matches the spec's documented divisor of 5000", () => {
    expect(DEFAULT_VOLUMETRIC_DIVISOR).toBe(5000);
  });

  it("supports a carrier-specific divisor override (spec 15.1: 'divisor is configurable by carrier/service')", () => {
    const result = calculateChargeableWeight(
      { actualWeightKg: 1, lengthCm: 60, widthCm: 50, heightCm: 40 },
      6000
    );
    expect(result.volumetricWeightKg).toBe(20); // 120000 / 6000
  });

  it("rejects negative weight", () => {
    expect(() =>
      calculateChargeableWeight({ actualWeightKg: -1, lengthCm: 10, widthCm: 10, heightCm: 10 })
    ).toThrow(/negative/);
  });

  it("rejects negative dimensions", () => {
    expect(() =>
      calculateChargeableWeight({ actualWeightKg: 1, lengthCm: -10, widthCm: 10, heightCm: 10 })
    ).toThrow(/negative/);
  });

  it("rounds volumetric weight to 2 decimal places", () => {
    const result = calculateChargeableWeight({
      actualWeightKg: 0,
      lengthCm: 33,
      widthCm: 27,
      heightCm: 19,
    });
    // 33*27*19 / 5000 = 3.3858 -> 3.39
    expect(result.volumetricWeightKg).toBe(3.39);
  });
});

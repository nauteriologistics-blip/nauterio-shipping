/**
 * Synthetic test fixtures only - never derived from real customer data
 * (spec section 32.2: "Use synthetic data in tests; production data must
 * not be copied into development").
 */
export const FIXTURE_SHIPMENT_INPUT = {
  actualWeightKg: 12,
  lengthCm: 40,
  widthCm: 30,
  heightCm: 20,
  declaredValueEur: 300,
  service: "air-express" as const,
};

export const FIXTURE_ADDRESS_IT = {
  line1: "Via Roma 1",
  city: "Milano",
  postalCode: "20121",
  countryCode: "IT",
};

export const FIXTURE_ADDRESS_US = {
  line1: "350 5th Avenue",
  city: "New York",
  region: "NY",
  postalCode: "10118",
  countryCode: "US",
};

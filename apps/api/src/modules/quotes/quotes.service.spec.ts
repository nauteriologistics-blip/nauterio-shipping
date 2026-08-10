import { Test } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { QuotesService } from "./quotes.service";
import { AuditService } from "../audit/audit.module";
import * as databaseModule from "@nauterio/database";
import type { CreateQuoteDto } from "./dto/create-quote.dto";

// Unit test: mock the database so this runs without a real Postgres
// connection (spec section 35's "Unit" test layer - domain calculation
// logic, not the persistence side, which belongs in an integration test).
jest.mock("@nauterio/database", () => ({
  getPrismaClient: jest.fn(),
}));

// Only the fields this spec file actually asserts on - not a full model of
// Prisma's real QuoteCreateArgs, which the mock below never type-checks
// against anyway.
interface MockQuoteCreateArgs {
  data: { isIndicative: boolean; currency: string };
}

describe("QuotesService", () => {
  let service: QuotesService;
  let mockQuoteCreate: jest.Mock<Promise<{ id: string }>, [MockQuoteCreateArgs]>;

  beforeEach(async () => {
    mockQuoteCreate = jest.fn<Promise<{ id: string }>, [MockQuoteCreateArgs]>().mockResolvedValue({ id: "quote-1" });
    const mockAuditEventCreate = jest.fn().mockResolvedValue({});
    const mockTx = { quote: { create: mockQuoteCreate }, auditEvent: { create: mockAuditEventCreate } };
    (databaseModule.getPrismaClient as jest.Mock).mockReturnValue({
      quote: { create: mockQuoteCreate },
      $transaction: jest.fn((callback: (tx: typeof mockTx) => unknown) => callback(mockTx)),
    });

    const module = await Test.createTestingModule({
      providers: [QuotesService, AuditService],
    }).compile();

    service = module.get(QuotesService);
  });

  const baseDto: CreateQuoteDto = {
    weightKg: 12,
    lengthCm: 40,
    widthCm: 30,
    heightCm: 20,
    declaredValueEur: 300,
    service: "air-express",
  };

  it("calculates the base rate as flat fee + chargeable weight * per-kg rate", async () => {
    const result = await service.calculate(baseDto);
    // air-express: 35 + 12kg * 6.50 = 113
    expect(result.baseRateEur).toBe(113);
    expect(result.chargeableWeightKg).toBe(12); // actual weight wins over 4.8kg volumetric
  });

  it("always marks the result as indicative with a disclaimer (CLAUDE.md: never invent rate cards)", async () => {
    const result = await service.calculate(baseDto);
    expect(result.isIndicative).toBe(true);
    expect(result.disclaimer.length).toBeGreaterThan(0);
  });

  it("applies the customs fee only when addCustoms is true", async () => {
    const withCustoms = await service.calculate({ ...baseDto, addCustoms: true });
    const withoutCustoms = await service.calculate({ ...baseDto, addCustoms: false });
    expect(withCustoms.customsFeeEur).toBeGreaterThan(0);
    expect(withoutCustoms.customsFeeEur).toBe(0);
  });

  it("flags de minimis eligibility at the $800 threshold", async () => {
    const under = await service.calculate({ ...baseDto, declaredValueEur: 800 });
    const over = await service.calculate({ ...baseDto, declaredValueEur: 800.01 });
    expect(under.isDeMinimisEligible).toBe(true);
    expect(over.isDeMinimisEligible).toBe(false);
  });

  it("rejects an unknown service id", async () => {
    await expect(
      service.calculate({ ...baseDto, service: "not-a-real-service" as never })
    ).rejects.toThrow(BadRequestException);
  });

  it("persists a quote snapshot for every calculation (spec 15.1: 'Accepted quotes snapshot every calculation input')", async () => {
    await service.calculate(baseDto);
    expect(mockQuoteCreate).toHaveBeenCalledTimes(1);
    const createArgs = mockQuoteCreate.mock.calls[0][0];
    expect(createArgs.data.isIndicative).toBe(true);
    expect(createArgs.data.currency).toBe("EUR");
  });

  it("uses volumetric weight when it exceeds actual weight", async () => {
    const result = await service.calculate({
      ...baseDto,
      weightKg: 1,
      lengthCm: 60,
      widthCm: 50,
      heightCm: 40, // volumetric = 24kg
    });
    expect(result.chargeableWeightKg).toBe(24);
  });
});

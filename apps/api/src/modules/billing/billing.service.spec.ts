import { Test, TestingModule } from "@nestjs/testing";
import { BillingService } from "./billing.service";
import { AuditService } from "../audit/audit.module";
import { NotFoundException } from "@nestjs/common";

describe("BillingService", () => {
  let service: BillingService;

  const mockAuditService = {
    record: jest.fn().mockResolvedValue(undefined),
  };

  const staffScope = { role: "OPERATIONS" as const, userId: "staff-1" };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("throws NotFoundException when non-existent invoice is fetched", async () => {
    // Must be syntactically-valid UUID input, or Postgres rejects it before
    // this code ever gets to check `!invoice` - a real DB round trip
    // requires a running local Postgres (see jest.config.js DB assumptions).
    await expect(
      service.getInvoiceById("00000000-0000-0000-0000-000000000000", staffScope)
    ).rejects.toThrow(NotFoundException);
  });
});

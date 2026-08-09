import { Test, TestingModule } from "@nestjs/testing";
import { CustomersService } from "./customers.service";
import { AuditService } from "../audit/audit.module";
import { NotFoundException } from "@nestjs/common";

describe("CustomersService", () => {
  let service: CustomersService;

  const mockAuditService = {
    record: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("throws NotFoundException when profile for non-existent user is fetched", async () => {
    // Must be syntactically-valid UUID input, or Postgres rejects it before
    // this code ever gets to check `!user` (real DB round trip - needs a
    // running local Postgres, see jest.config.js DB assumptions).
    await expect(
      service.getProfile("00000000-0000-0000-0000-000000000000")
    ).rejects.toThrow(NotFoundException);
  });
});

import { Test, TestingModule } from "@nestjs/testing";
import { ClaimsReturnsService } from "./claims-returns.service";
import { AuditService } from "../audit/audit.module";
import { NotFoundException } from "@nestjs/common";
import type { AuthenticatedUser } from "../../common/guards/auth.guard";

describe("ClaimsReturnsService", () => {
  let service: ClaimsReturnsService;

  const mockAuditService = {
    record: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimsReturnsService,
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<ClaimsReturnsService>(ClaimsReturnsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("throws NotFoundException when fetching non-existent claim", async () => {
    const mockUser: AuthenticatedUser = {
      userId: "00000000-0000-0000-0000-000000000001",
      cognitoSub: "test-sub",
      role: "CUSTOMER",
      warehouseIds: [],
      accountStatus: "ACTIVE",
    };
    // Must be syntactically-valid UUID input, or Postgres rejects it before
    // this code ever gets to check `!claim` (real DB round trip - needs a
    // running local Postgres, see jest.config.js DB assumptions).
    await expect(
      service.getClaimById("00000000-0000-0000-0000-000000000000", mockUser)
    ).rejects.toThrow(NotFoundException);
  });
});

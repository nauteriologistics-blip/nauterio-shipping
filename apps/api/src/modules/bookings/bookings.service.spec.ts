import { Test, TestingModule } from "@nestjs/testing";
import { BookingsService } from "./bookings.service";
import { AuditService } from "../audit/audit.module";
import { ShipmentsService } from "../shipments/shipments.service";
import { NotFoundException } from "@nestjs/common";

describe("BookingsService", () => {
  let service: BookingsService;

  const mockAuditService = {
    record: jest.fn().mockResolvedValue(undefined),
  };
  const mockShipmentsService = {
    generateTrackingNumber: jest.fn().mockResolvedValue("NT-0000000000-US"),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: AuditService, useValue: mockAuditService },
        { provide: ShipmentsService, useValue: mockShipmentsService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("throws NotFoundException when fetching non-existent booking", async () => {
    // Must be syntactically-valid UUID input, or Postgres rejects it before
    // this code ever gets to check `!booking` (real DB round trip - needs
    // a running local Postgres, see jest.config.js DB assumptions).
    await expect(
      service.getBookingById("00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000001")
    ).rejects.toThrow(NotFoundException);
  });
});

import * as databaseModule from "@nauterio/database";
import { ShipmentsService } from "./shipments.service";

jest.mock("@nauterio/database", () => ({ getPrismaClient: jest.fn() }));

describe("ShipmentsService tracking number generation", () => {
  beforeEach(() => jest.clearAllMocks());

  it("generates an opaque Crockford-base32 tracking number", async () => {
    (databaseModule.getPrismaClient as jest.Mock).mockReturnValue({
      shipment: { findUnique: jest.fn().mockResolvedValue(null) },
    });

    const trackingNumber = await new ShipmentsService().generateTrackingNumber();

    expect(trackingNumber).toMatch(/^NT-[0-9A-HJKMNP-TV-Z]{10}-US$/);
  });

  it("checks database uniqueness and retries a collision", async () => {
    const findUnique = jest.fn()
      .mockResolvedValueOnce({ id: "collision" })
      .mockResolvedValueOnce(null);
    (databaseModule.getPrismaClient as jest.Mock).mockReturnValue({ shipment: { findUnique } });

    await new ShipmentsService().generateTrackingNumber();

    expect(findUnique).toHaveBeenCalledTimes(2);
  });
});

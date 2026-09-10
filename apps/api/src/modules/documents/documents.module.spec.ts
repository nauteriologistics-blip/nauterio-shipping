import { matchesFileSignature } from "./documents.module";

describe("document file signature verification", () => {
  it("accepts the declared supported signatures", () => {
    expect(matchesFileSignature(Buffer.from("%PDF-1.7\n"), "application/pdf")).toBe(true);
    expect(matchesFileSignature(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), "image/png")).toBe(true);
    expect(matchesFileSignature(Buffer.from([0xff, 0xd8, 0xff, 0x00, 0xff, 0xd9]), "image/jpeg")).toBe(true);
  });

  it("rejects content that only claims to be a supported type", () => {
    expect(matchesFileSignature(Buffer.from("not a PDF"), "application/pdf")).toBe(false);
    expect(matchesFileSignature(Buffer.from("<script>alert(1)</script>"), "image/png")).toBe(false);
  });
});

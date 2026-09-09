import { scryptSync } from "node:crypto";
import { verifyStaffPassword } from "./staff-password";

function encode(password: string): string {
  const salt = Buffer.from("0123456789abcdef0123456789abcdef");
  const key = scryptSync(password, salt, 64, { N: 16_384, r: 8, p: 1, maxmem: 128 * 1024 * 1024 });
  return `scrypt$16384$8$1$${salt.toString("base64")}$${key.toString("base64")}`;
}

describe("verifyStaffPassword", () => {
  it("accepts the correct password", async () => {
    const encoded = encode("correct-horse-battery-staple-2026!");
    await expect(verifyStaffPassword("correct-horse-battery-staple-2026!", encoded)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const encoded = encode("correct-horse-battery-staple-2026!");
    await expect(verifyStaffPassword("not-the-password", encoded)).resolves.toBe(false);
  });

  it.each([undefined, "", "scrypt$bad", "scrypt$2$8$1$c2FsdA==$a2V5"])("fails closed for malformed value %p", async (encoded) => {
    await expect(verifyStaffPassword("anything", encoded)).resolves.toBe(false);
  });
});

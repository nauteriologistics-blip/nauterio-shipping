import { scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";
const PREFIX = "scrypt";
const MAX_MEMORY_BYTES = 128 * 1024 * 1024;

function deriveKey(password: string, salt: Buffer, length: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, length, options, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

/**
 * Verify a password against `scrypt$N$r$p$saltBase64$keyBase64`.
 *
 * Keeping the work factors inside the encoded value lets credentials be
 * strengthened later without changing the application contract. Malformed
 * values fail closed and never throw into the authentication response.
 */
export async function verifyStaffPassword(password: string, encoded: string | undefined): Promise<boolean> {
  if (!encoded) return false;

  const [prefix, nRaw, rRaw, pRaw, saltRaw, expectedRaw, extra] = encoded.split("$");
  if (prefix !== PREFIX || extra !== undefined) return false;

  const N = Number(nRaw);
  const r = Number(rRaw);
  const p = Number(pRaw);
  if (!Number.isSafeInteger(N) || N < 16_384 || N > 131_072 || (N & (N - 1)) !== 0) return false;
  if (!Number.isSafeInteger(r) || r < 1 || r > 32) return false;
  if (!Number.isSafeInteger(p) || p < 1 || p > 8) return false;

  try {
    const salt = Buffer.from(saltRaw, "base64");
    const expected = Buffer.from(expectedRaw, "base64");
    if (salt.length < 16 || expected.length < 32 || expected.length > 128) return false;

    const actual = await deriveKey(password, salt, expected.length, { N, r, p, maxmem: MAX_MEMORY_BYTES });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

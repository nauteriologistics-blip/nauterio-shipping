import { createPublicKey, verify as cryptoVerify, type JsonWebKey } from "node:crypto";

export interface CognitoVerifierConfig {
  userPoolId?: string;
  region?: string;
  clientId?: string;
  localAuthMode: boolean;
  nodeEnv: string;
}

interface JWK {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  n: string;
  e: string;
}

interface JWKS {
  keys: JWK[];
}

const jwksCache = new Map<string, { keys: JWK[]; expiresAt: number }>();
const CACHE_TTL_MS = 3_600_000; // 1 hour

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

export async function verifyCognitoToken(token: string, config: CognitoVerifierConfig): Promise<string | null> {
  const isDevOrTest = config.nodeEnv === "development" || config.nodeEnv === "test";

  if (config.localAuthMode) {
    if (!isDevOrTest) {
      throw new Error(
        "CRITICAL SECURITY RISK: LOCAL_AUTH_MODE=true is forbidden in production environment."
      );
    }
    // Dev passthrough
    return token || null;
  }

  // Production verification
  if (!config.userPoolId || !config.region || !config.clientId) {
    throw new Error("COGNITO_USER_POOL_ID, COGNITO_REGION, and COGNITO_CLIENT_ID are required for production auth verification.");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  interface JwtHeader {
    kid?: string;
    alg?: string;
  }
  interface JwtPayload {
    sub?: string;
    exp?: number;
    iss?: string;
    client_id?: string;
    aud?: string;
    token_use?: string;
  }

  let header: JwtHeader;
  let payload: JwtPayload;

  try {
    // JSON.parse has no way to guarantee the decoded token actually matches
    // these shapes - the signature verification below is what makes the
    // token trustworthy, not this cast.
    header = JSON.parse(base64UrlDecode(headerB64)) as JwtHeader;
    payload = JSON.parse(base64UrlDecode(payloadB64)) as JwtPayload;
  } catch {
    return null;
  }

  if (header.alg !== "RS256" || !header.kid) {
    return null;
  }

  // Check expiration
  const nowSec = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp < nowSec) {
    return null;
  }

  // Check issuer
  const expectedIss = `https://cognito-idp.${config.region}.amazonaws.com/${config.userPoolId}`;
  if (payload.iss !== expectedIss) {
    return null;
  }
  if (payload.token_use !== "access" && payload.token_use !== "id") return null;
  const tokenClientId = payload.token_use === "access" ? payload.client_id : payload.aud;
  if (tokenClientId !== config.clientId) return null;

  // Fetch JWKS
  const jwksUrl = `${expectedIss}/.well-known/jwks.json`;
  let jwkList = jwksCache.get(jwksUrl);

  if (!jwkList || jwkList.expiresAt < Date.now()) {
    try {
      const res = await fetch(jwksUrl);
      if (!res.ok) return null;
      const data = (await res.json()) as JWKS;
      jwkList = { keys: data.keys, expiresAt: Date.now() + CACHE_TTL_MS };
      jwksCache.set(jwksUrl, jwkList);
    } catch {
      return null;
    }
  }

  const matchingJwk = jwkList.keys.find((k) => k.kid === header.kid);
  if (!matchingJwk) {
    return null;
  }

  try {
    // JWK (our decoded-JWKS-response shape) and Node's JsonWebKey don't
    // structurally overlap enough for a direct assertion - TS itself
    // requires routing through `unknown` for what is, at runtime, the same
    // JSON object either way.
    const publicKey = createPublicKey({ key: matchingJwk as unknown as JsonWebKey, format: "jwk" });
    const dataToVerify = Buffer.from(`${headerB64}.${payloadB64}`);
    const signature = Buffer.from(signatureB64.replace(/-/g, "+").replace(/_/g, "/"), "base64");

    const isValid = cryptoVerify("SHA256", dataToVerify, publicKey, signature);
    if (!isValid) return null;

    return payload.sub ?? null;
  } catch {
    return null;
  }
}

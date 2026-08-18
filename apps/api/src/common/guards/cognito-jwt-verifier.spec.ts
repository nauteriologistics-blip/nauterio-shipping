import { generateKeyPairSync, sign } from "node:crypto";
import { verifyCognitoToken } from "./cognito-jwt-verifier";

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = publicKey.export({ format: "jwk" });
const originalFetch = global.fetch;

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function token(payload: Record<string, unknown>): string {
  const header = encode({ alg: "RS256", kid: "test-key" });
  const body = encode(payload);
  const signature = sign("RSA-SHA256", Buffer.from(`${header}.${body}`), privateKey).toString("base64url");
  return `${header}.${body}.${signature}`;
}

function config(poolId: string) {
  return { userPoolId: poolId, region: "eu-west-1", clientId: "web-client", localAuthMode: false, nodeEnv: "production" };
}

beforeAll(() => {
  global.fetch = jest.fn(() => Promise.resolve(new Response(JSON.stringify({ keys: [{ ...jwk, kid: "test-key", use: "sig", alg: "RS256" }] }), { status: 200 })));
});

afterAll(() => { global.fetch = originalFetch; });

it("accepts a signed, unexpired token for the configured client", async () => {
  const cfg = config("pool-valid");
  const result = await verifyCognitoToken(token({ sub: "user-1", exp: Math.floor(Date.now() / 1000) + 300, iss: `https://cognito-idp.eu-west-1.amazonaws.com/${cfg.userPoolId}`, token_use: "access", client_id: cfg.clientId }), cfg);
  expect(result).toBe("user-1");
});

it("rejects a token issued for another client", async () => {
  const cfg = config("pool-wrong-client");
  const result = await verifyCognitoToken(token({ sub: "user-1", exp: Math.floor(Date.now() / 1000) + 300, iss: `https://cognito-idp.eu-west-1.amazonaws.com/${cfg.userPoolId}`, token_use: "id", aud: "attacker-client" }), cfg);
  expect(result).toBeNull();
});

it("rejects a signed token with no expiry", async () => {
  const cfg = config("pool-no-expiry");
  const result = await verifyCognitoToken(token({ sub: "user-1", iss: `https://cognito-idp.eu-west-1.amazonaws.com/${cfg.userPoolId}`, token_use: "access", client_id: cfg.clientId }), cfg);
  expect(result).toBeNull();
});

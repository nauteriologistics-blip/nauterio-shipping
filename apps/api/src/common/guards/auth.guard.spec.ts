import { verifyCognitoToken } from "./cognito-jwt-verifier";

describe("verifyCognitoToken", () => {
  it("allows local dev token in development environment with LOCAL_AUTH_MODE=true", async () => {
    const sub = await verifyCognitoToken("local-dev-user-id", {
      localAuthMode: true,
      nodeEnv: "development",
    });
    expect(sub).toBe("local-dev-user-id");
  });

  it("throws security error if LOCAL_AUTH_MODE=true in production environment", async () => {
    await expect(
      verifyCognitoToken("some-token", {
        localAuthMode: true,
        nodeEnv: "production",
      })
    ).rejects.toThrow("CRITICAL SECURITY RISK");
  });

  it("returns null for malformed tokens in production mode", async () => {
    const sub = await verifyCognitoToken("invalid.token", {
      localAuthMode: false,
      nodeEnv: "production",
      userPoolId: "us-east-1_XXXXX",
      region: "us-east-1",
      clientId: "test-client",
    });
    expect(sub).toBeNull();
  });
});

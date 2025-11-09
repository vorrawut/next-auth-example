import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { getTokenDetails } from "@/lib/api/auth/services/tokenDetailsService";
import { getToken } from "next-auth/jwt";


// Mock the tokenDecode module
jest.mock("@/lib/auth/tokenDecode", () => ({
  decodeTokenPayload: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe("tokenDetailsService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return error when no token", async () => {
    (getToken as jest.Mock).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/auth/token-details");

    const result = await getTokenDetails(request);

    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toBe("Unauthorized");
      expect(result.status).toBe(401);
    }
  });

  it("should return token payload when fullTokenPayload exists", async () => {
    const mockPayload = {
      sub: "user-123",
      email: "test@example.com",
      realm_access: { roles: ["admin"] },
    };

    (getToken as jest.Mock).mockResolvedValue({
      fullTokenPayload: mockPayload,
    });

    const request = new Request("http://localhost:3000/api/auth/token-details");

    const result = await getTokenDetails(request);

    expect("error" in result).toBe(false);
    if (!("error" in result)) {
      expect(result.tokenPayload).toEqual(mockPayload);
    }
  });

  it("should decode token when fullTokenPayload is not available", async () => {
    const { decodeTokenPayload } = require("@/lib/auth/tokenDecode");
    const mockPayload = {
      sub: "user-123",
      email: "test@example.com",
    };

    // Reset the mock before each test
    (decodeTokenPayload as jest.Mock).mockClear();
    (decodeTokenPayload as jest.Mock).mockReturnValue(mockPayload);

    (getToken as jest.Mock).mockResolvedValue({
      accessToken: "mock-access-token",
      idToken: "mock-id-token",
      // Don't include fullTokenPayload to trigger decoding
    });

    const request = new Request("http://localhost:3000/api/auth/token-details");

    const result = await getTokenDetails(request);

    // decodeTokenPayload should be called when fullTokenPayload is not available
    expect(decodeTokenPayload).toHaveBeenCalledWith("mock-access-token", "mock-id-token");
    expect("error" in result).toBe(false);
    if (!("error" in result)) {
      expect(result.tokenPayload).toEqual(mockPayload);
    }
  });

  it("should fetch from userinfo endpoint when realm_access is missing", async () => {
    process.env.KEYCLOAK_ISSUER = "http://localhost:8080/realms/next";
    
    const mockPayload = {
      sub: "user-123",
      email: "test@example.com",
      // No realm_access or resource_access to trigger userinfo fetch
    };

    const userinfoPayload = {
      ...mockPayload,
      realm_access: { roles: ["admin"] },
      resource_access: { account: { roles: ["manage-account"] } },
    };

    // Reset mocks
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => userinfoPayload,
    });

    const { decodeTokenPayload } = require("@/lib/auth/tokenDecode");
    (decodeTokenPayload as jest.Mock).mockClear();
    (decodeTokenPayload as jest.Mock).mockReturnValue(mockPayload);

    (getToken as jest.Mock).mockResolvedValue({
      accessToken: "mock-access-token",
      // Don't include fullTokenPayload to trigger decoding
    });

    const request = new Request("http://localhost:3000/api/auth/token-details");

    const result = await getTokenDetails(request);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/realms/next/protocol/openid-connect/userinfo",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-access-token",
        }),
      })
    );

    expect("error" in result).toBe(false);
    if (!("error" in result)) {
      expect(result.tokenPayload.realm_access).toEqual({ roles: ["admin"] });
      expect(result.tokenPayload.resource_access).toEqual({ account: { roles: ["manage-account"] } });
    }
  });
});


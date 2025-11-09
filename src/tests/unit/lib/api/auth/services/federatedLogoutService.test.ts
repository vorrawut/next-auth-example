import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";

// Mock the route file before importing the service
jest.mock("@/app/api/auth/[...nextauth]/route", () => ({
  auth: jest.fn(),
}));

// Mock next-auth/jwt before importing
jest.mock("next-auth/jwt");

import { getFederatedLogoutUrl } from "@/lib/api/auth/services/federatedLogoutService";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";


describe("federatedLogoutService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return error when no session", async () => {
    mockAuth.mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/auth/federated-logout", {
      method: "POST",
    });

    const result = await getFederatedLogoutUrl(request);

    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toBe("No active session");
      expect(result.status).toBe(401);
    }
  });

  it("should return error when idToken is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: "1" } });
    mockGetToken.mockResolvedValue({ idToken: undefined });

    const request = new Request("http://localhost:3000/api/auth/federated-logout", {
      method: "POST",
    });

    const result = await getFederatedLogoutUrl(request);

    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toBe("Missing idToken or Keycloak issuer");
      expect(result.status).toBe(400);
    }
  });

  it("should return error when KEYCLOAK_ISSUER is missing", async () => {
    delete process.env.KEYCLOAK_ISSUER;
    (auth as jest.Mock<typeof auth>).mockResolvedValue({ user: { id: "1" } } as any);
    mockGetToken.mockResolvedValue({
      idToken: "mock-id-token",
    });

    const request = new Request("http://localhost:3000/api/auth/federated-logout", {
      method: "POST",
    });

    const result = await getFederatedLogoutUrl(request);

    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toBe("Missing idToken or Keycloak issuer");
      expect(result.status).toBe(400);
    }
  });

  it("should return logout URL when session and token exist", async () => {
    process.env.KEYCLOAK_ISSUER = "http://localhost:8080/realms/next";
    process.env.NEXTAUTH_URL = "http://localhost:3000";
    
    (auth as jest.Mock<typeof auth>).mockResolvedValue({ user: { id: "1" } } as any);
    mockGetToken.mockResolvedValue({
      idToken: "mock-id-token",
    });

    const request = new Request("http://localhost:3000/api/auth/federated-logout", {
      method: "POST",
    });

    const result = await getFederatedLogoutUrl(request);

    expect("error" in result).toBe(false);
    if (!("error" in result)) {
      expect(result.success).toBe(true);
      expect(result.logoutUrl).toContain("http://localhost:8080/realms/next");
      expect(result.logoutUrl).toContain("mock-id-token");
      expect(result.logoutUrl).toContain("post_logout_redirect_uri");
    }
  });
});


import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { getKeycloakConfig } from "@/lib/api/auth/services/keycloakConfigService";

describe("keycloakConfigService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return config when environment variables are set", () => {
    process.env.KEYCLOAK_ISSUER = "http://localhost:8080/realms/next";
    process.env.KEYCLOAK_CLIENT_ID = "next";

    const result = getKeycloakConfig();

    expect("error" in result).toBe(false);
    if (!("error" in result)) {
      expect(result.issuer).toBe("http://localhost:8080/realms/next");
      expect(result.clientId).toBe("next");
    }
  });

  it("should return error when KEYCLOAK_ISSUER is missing", () => {
    delete process.env.KEYCLOAK_ISSUER;
    process.env.KEYCLOAK_CLIENT_ID = "next";

    const result = getKeycloakConfig();

    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toBe("Keycloak configuration not found");
      expect(result.status).toBe(500);
    }
  });

  it("should return error when KEYCLOAK_CLIENT_ID is missing", () => {
    process.env.KEYCLOAK_ISSUER = "http://localhost:8080/realms/next";
    delete process.env.KEYCLOAK_CLIENT_ID;

    const result = getKeycloakConfig();

    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toBe("Keycloak configuration not found");
      expect(result.status).toBe(500);
    }
  });
});


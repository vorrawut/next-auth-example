import { describe, it, expect } from "@jest/globals";
import { API_ROUTES, getApiUrl, isApiRoute } from "@/lib/routes/apiRoutes";

describe("apiRoutes", () => {
  describe("API_ROUTES constants", () => {
    it("should have all required API route constants", () => {
      expect(API_ROUTES.AUTH.BASE).toBe("/api/auth");
      expect(API_ROUTES.AUTH.CALLBACK).toBe("/api/auth/callback/keycloak");
      expect(API_ROUTES.AUTH.FEDERATED_LOGOUT).toBe("/api/auth/federated-logout");
      expect(API_ROUTES.AUTH.TOKEN_DETAILS).toBe("/api/auth/token-details");
      expect(API_ROUTES.AUTH.KEYCLOAK_CONFIG).toBe("/api/auth/keycloak-config");
    });
  });

  describe("getApiUrl", () => {
    it("should return route as-is if it starts with /", () => {
      expect(getApiUrl("/api/auth/test")).toBe("/api/auth/test");
      expect(getApiUrl(API_ROUTES.AUTH.FEDERATED_LOGOUT)).toBe(API_ROUTES.AUTH.FEDERATED_LOGOUT);
    });

    it("should prepend /api/ if route doesn't start with /", () => {
      expect(getApiUrl("auth/test")).toBe("/api/auth/test");
      expect(getApiUrl("users")).toBe("/api/users");
    });
  });

  describe("isApiRoute", () => {
    it("should return true for API routes", () => {
      expect(isApiRoute("/api/auth/federated-logout")).toBe(true);
      expect(isApiRoute("/api/users")).toBe(true);
      expect(isApiRoute(API_ROUTES.AUTH.TOKEN_DETAILS)).toBe(true);
    });

    it("should return false for page routes", () => {
      expect(isApiRoute("/login")).toBe(false);
      expect(isApiRoute("/profile")).toBe(false);
      expect(isApiRoute("/")).toBe(false);
    });

    it("should return false for non-API routes", () => {
      expect(isApiRoute("/some/other/route")).toBe(false);
      expect(isApiRoute("not-a-route")).toBe(false);
    });
  });
});


import { describe, it, expect } from "@jest/globals";
import { PAGE_ROUTES, isProtectedRoute, getLoginRedirectUrl } from "@/lib/routes/pageRoutes";

describe("pageRoutes", () => {
  describe("PAGE_ROUTES constants", () => {
    it("should have all required route constants", () => {
      expect(PAGE_ROUTES.HOME).toBe("/");
      expect(PAGE_ROUTES.LOGIN).toBe("/login");
      expect(PAGE_ROUTES.LOGOUT).toBe("/logout");
      expect(PAGE_ROUTES.RESET_PASSWORD).toBe("/reset-password");
      expect(PAGE_ROUTES.UNAUTHORIZED).toBe("/unauthorized");
      expect(PAGE_ROUTES.AUTH_ERROR).toBe("/auth/error");
      expect(PAGE_ROUTES.PROFILE).toBe("/profile");
      expect(PAGE_ROUTES.SECURED).toBe("/Secured");
      expect(PAGE_ROUTES.ADMIN).toBe("/admin");
      expect(PAGE_ROUTES.MANAGER).toBe("/manager");
    });
  });

  describe("isProtectedRoute", () => {
    it("should return true for protected routes", () => {
      expect(isProtectedRoute(PAGE_ROUTES.HOME)).toBe(true);
      expect(isProtectedRoute(PAGE_ROUTES.PROFILE)).toBe(true);
      expect(isProtectedRoute(PAGE_ROUTES.SECURED)).toBe(true);
      expect(isProtectedRoute(PAGE_ROUTES.ADMIN)).toBe(true);
      expect(isProtectedRoute(PAGE_ROUTES.MANAGER)).toBe(true);
    });

    it("should return false for public routes", () => {
      expect(isProtectedRoute(PAGE_ROUTES.LOGIN)).toBe(false);
      expect(isProtectedRoute(PAGE_ROUTES.LOGOUT)).toBe(false);
      expect(isProtectedRoute(PAGE_ROUTES.RESET_PASSWORD)).toBe(false);
      expect(isProtectedRoute(PAGE_ROUTES.UNAUTHORIZED)).toBe(false);
      expect(isProtectedRoute(PAGE_ROUTES.AUTH_ERROR)).toBe(false);
    });

    it("should return false for unknown routes", () => {
      expect(isProtectedRoute("/unknown")).toBe(false);
      expect(isProtectedRoute("/some/other/route")).toBe(false);
    });
  });

  describe("getLoginRedirectUrl", () => {
    it("should return callbackUrl if provided and not login", () => {
      expect(getLoginRedirectUrl("/profile")).toBe("/profile");
      expect(getLoginRedirectUrl("/admin")).toBe("/admin");
    });

    it("should return HOME if callbackUrl is login", () => {
      expect(getLoginRedirectUrl(PAGE_ROUTES.LOGIN)).toBe(PAGE_ROUTES.HOME);
    });

    it("should return HOME if callbackUrl is null", () => {
      expect(getLoginRedirectUrl(null)).toBe(PAGE_ROUTES.HOME);
    });

    it("should return HOME if callbackUrl is undefined", () => {
      expect(getLoginRedirectUrl(undefined)).toBe(PAGE_ROUTES.HOME);
    });
  });
});


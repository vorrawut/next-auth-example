import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import AuthButton from "@/components/AuthButton";
import { PAGE_ROUTES } from "@/lib/routes";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  redirect: jest.fn(),
}));

describe("AuthButton Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  describe("Login button", () => {
    it("should render login button", () => {
      render(<AuthButton type="login" />);

      expect(screen.getByText("Login with Keycloak")).toBeInTheDocument();
    });

    it("should navigate to login page on click", () => {
      render(<AuthButton type="login" />);

      const button = screen.getByText("Login with Keycloak");
      fireEvent.click(button);

      expect(mockPush).toHaveBeenCalledWith(PAGE_ROUTES.LOGIN);
    });

    it("should use primary variant by default for login", () => {
      render(<AuthButton type="login" />);

      const button = screen.getByText("Login with Keycloak");
      expect(button).toHaveClass("bg-blue-600");
    });
  });

  describe("Logout button", () => {
    it("should render logout button", () => {
      render(<AuthButton type="logout" />);

      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("should navigate to logout page on click", () => {
      render(<AuthButton type="logout" />);

      const button = screen.getByText("Logout");
      fireEvent.click(button);

      expect(mockPush).toHaveBeenCalledWith(PAGE_ROUTES.LOGOUT);
    });

    it("should use danger variant by default for logout", () => {
      render(<AuthButton type="logout" />);

      const button = screen.getByText("Logout");
      expect(button).toHaveClass("bg-red-600");
    });
  });

  describe("Custom props", () => {
    it("should accept custom variant", () => {
      render(<AuthButton type="login" variant="secondary" />);

      const button = screen.getByText("Login with Keycloak");
      expect(button).toHaveClass("bg-gray-200");
    });

    it("should accept custom size", () => {
      render(<AuthButton type="login" size="sm" />);

      const button = screen.getByText("Login with Keycloak");
      expect(button).toHaveClass("text-sm");
    });

    it("should accept fullWidth prop", () => {
      render(<AuthButton type="login" fullWidth />);

      const button = screen.getByText("Login with Keycloak");
      expect(button).toHaveClass("w-full");
    });

    it("should accept custom className", () => {
      render(<AuthButton type="login" className="custom-class" />);

      const button = screen.getByText("Login with Keycloak");
      expect(button).toHaveClass("custom-class");
    });
  });
});


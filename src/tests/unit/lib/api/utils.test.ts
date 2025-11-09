import { describe, it, expect } from "@jest/globals";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  internalErrorResponse,
  withErrorHandling,
} from "@/lib/api/utils";

describe("API utils", () => {
  describe("successResponse", () => {
    it("should create a success response with data", async () => {
      const response = successResponse({ id: 1, name: "Test" });
      expect(response.status).toBe(200);
      
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data).toEqual({ id: 1, name: "Test" });
    });

    it("should create a success response with custom status", async () => {
      const response = successResponse({ id: 1 }, 201);
      expect(response.status).toBe(201);
      
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data).toEqual({ id: 1 });
    });
  });

  describe("errorResponse", () => {
    it("should create an error response", async () => {
      const response = errorResponse("Bad Request", 400, "Invalid input");
      expect(response.status).toBe(400);
      
      const json = await response.json();
      expect(json.error).toBe("Bad Request");
      expect(json.message).toBe("Invalid input");
      expect(json.statusCode).toBe(400);
    });

    it("should create an error response without message", async () => {
      const response = errorResponse("Not Found", 404);
      expect(response.status).toBe(404);
      
      const json = await response.json();
      expect(json.error).toBe("Not Found");
      expect(json.statusCode).toBe(404);
    });
  });

  describe("unauthorizedResponse", () => {
    it("should create a 401 response", async () => {
      const response = unauthorizedResponse("Please log in");
      expect(response.status).toBe(401);
      
      const json = await response.json();
      expect(json.error).toBe("Unauthorized");
      expect(json.message).toBe("Please log in");
    });

    it("should use default message if not provided", async () => {
      const response = unauthorizedResponse();
      const json = await response.json();
      expect(json.message).toBe("Unauthorized");
    });
  });

  describe("notFoundResponse", () => {
    it("should create a 404 response", async () => {
      const response = notFoundResponse("Resource not found");
      expect(response.status).toBe(404);
      
      const json = await response.json();
      expect(json.error).toBe("Not Found");
      expect(json.message).toBe("Resource not found");
    });
  });

  describe("internalErrorResponse", () => {
    it("should create a 500 response", async () => {
      const response = internalErrorResponse("Server error");
      expect(response.status).toBe(500);
      
      const json = await response.json();
      expect(json.error).toBe("Internal Server Error");
      expect(json.message).toBe("Server error");
    });
  });

  describe("withErrorHandling", () => {
    it("should return handler result on success", async () => {
      const handler = jest.fn().mockResolvedValue(successResponse({ success: true }));
      const wrapped = withErrorHandling(handler);

      const result = await wrapped();

      expect(handler).toHaveBeenCalled();
      expect(result.status).toBe(200);
    });

    it("should catch errors and return internal error response", async () => {
      const handler = jest.fn().mockRejectedValue(new Error("Test error"));
      const wrapped = withErrorHandling(handler);

      const result = await wrapped();

      expect(handler).toHaveBeenCalled();
      expect(result.status).toBe(500);
      
      const json = await result.json();
      expect(json.error).toBe("Internal Server Error");
      expect(json.message).toBe("Test error");
    });

    it("should handle non-Error objects", async () => {
      const handler = jest.fn().mockRejectedValue("String error");
      const wrapped = withErrorHandling(handler);

      const result = await wrapped();

      expect(result.status).toBe(500);
      
      const json = await result.json();
      expect(json.message).toBe("An unexpected error occurred");
    });
  });
});


import { withErrorHandling, errorResponse, successResponse } from "@/lib/api/utils";
import { getKeycloakConfig } from "@/lib/api/auth/services";

async function handler() {
  const result = getKeycloakConfig();

  if ("error" in result) {
    return errorResponse(result.error, result.status);
  }

  return successResponse(result);
}

export const GET = withErrorHandling(handler);

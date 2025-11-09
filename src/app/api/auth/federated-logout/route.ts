import { NextRequest } from "next/server";
import { withErrorHandling, errorResponse, successResponse } from "@/lib/api/utils";
import { getFederatedLogoutUrl } from "@/lib/api/auth/services";

async function handler(request: NextRequest) {
  const result = await getFederatedLogoutUrl(request);

  if ("error" in result) {
    return errorResponse(result.error, result.status);
  }

  return successResponse(result);
}

export const POST = withErrorHandling(handler);

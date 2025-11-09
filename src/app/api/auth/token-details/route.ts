import { NextRequest } from "next/server";
import { withErrorHandling, errorResponse, successResponse } from "@/lib/api/utils";
import { getTokenDetails } from "@/lib/api/auth/services";

async function handler(request: NextRequest) {
  const result = await getTokenDetails(request);

  if ("error" in result) {
    return errorResponse(result.error, result.status);
  }

  return successResponse(result.tokenPayload);
}

export const GET = withErrorHandling(handler);

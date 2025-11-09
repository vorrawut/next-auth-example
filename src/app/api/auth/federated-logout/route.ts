import { NextRequest } from "next/server";
import { withErrorHandling, errorResponse, successResponse } from "@/lib/api/utils";
import { getFederatedLogoutUrl } from "@/lib/api/auth/services";

async function handler(request: NextRequest) {
  // Convert NextRequest to Request for the service
  const serviceRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
  const result = await getFederatedLogoutUrl(serviceRequest);

  if ("error" in result) {
    return errorResponse(result.error, result.status);
  }

  return successResponse(result);
}

export const POST = withErrorHandling(handler);

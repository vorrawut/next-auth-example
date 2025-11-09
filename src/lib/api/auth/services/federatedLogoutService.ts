import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export interface FederatedLogoutResult {
  success: boolean;
  logoutUrl: string;
}

export interface FederatedLogoutError {
  error: string;
  status: number;
}

/**
 * Service for handling federated logout logic
 */
export async function getFederatedLogoutUrl(
  request: NextRequest
): Promise<FederatedLogoutResult | FederatedLogoutError> {
  const session = await auth();

  if (!session) {
    return {
      error: "No active session",
      status: 401,
    };
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const idToken = token?.idToken as string | undefined;

  if (!idToken || !process.env.KEYCLOAK_ISSUER) {
    return {
      error: "Missing idToken or Keycloak issuer",
      status: 400,
    };
  }

  const endSessionUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
  const redirectUri = encodeURIComponent(
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  );
  const logoutUrl = `${endSessionUrl}?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}`;

  return {
    success: true,
    logoutUrl,
  };
}


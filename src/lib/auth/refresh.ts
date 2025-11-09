import type { JWT } from "next-auth/jwt";
import { AUTH_CONSTANTS } from "./constants";
import type { RefreshTokenResponse } from "./types";

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    throw new Error(AUTH_CONSTANTS.ERRORS.NO_REFRESH_TOKEN);
  }

  const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
        scope: "openid email profile", // Ensure we request the same scopes
      }),
      method: "POST",
      cache: "no-store",
    });

    const tokens = (await response.json()) as RefreshTokenResponse;

    if (!response.ok) {
      const isTokenExpired =
        tokens.error === AUTH_CONSTANTS.KEYCLOAK_ERRORS.INVALID_GRANT ||
        tokens.error === AUTH_CONSTANTS.KEYCLOAK_ERRORS.TOKEN_NOT_ACTIVE;

      if (isTokenExpired) {
        return {
          ...token,
          error: "RefreshAccessTokenError",
          refreshToken: undefined,
          accessToken: undefined,
          idToken: undefined,
        };
      }

      throw tokens;
    }

    return {
      ...token,
      idToken: tokens.id_token,
      accessToken: tokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + (tokens.expires_in || 3600)),
      refreshToken: tokens.refresh_token || token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Auth] Error refreshing access token:", error);
    }
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}


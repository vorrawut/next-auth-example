import type { JWT } from "next-auth/jwt";
import type { Session, Account, Profile } from "next-auth";
import { AUTH_CONSTANTS } from "./constants";
import { extractAndNormalizeRoles } from "@/utils/roleExtraction";
import { createMinimalTokenPayload } from "@/utils/sessionTokenPayload";
import { refreshAccessToken } from "./refresh";
import type { KeycloakProfile } from "./types";

export async function jwtCallback({
  token,
  account,
  profile,
}: {
  token: JWT;
  account?: Account | null;
  profile?: Profile;
}): Promise<JWT> {
  if (account) {
    token.idToken = account.id_token;
    token.accessToken = account.access_token;
    token.refreshToken = account.refresh_token;
    token.expiresAt = account.expires_at;

    // Decode and store full token payload for later use
    // Keycloak roles are typically in the ACCESS TOKEN, not the ID token
    // Try access_token first, then fallback to id_token
    let fullPayload: Record<string, unknown> | null = null;
    
    if (account.access_token) {
      const { decodeIdToken } = await import("@/utils/tokenDecode");
      // Decode access token - this usually has the roles
      fullPayload = decodeIdToken(account.access_token);
      
      if (process.env.NODE_ENV === "development") {
        console.log("[Auth] JWT Callback - Decoded access_token");
        console.log("[Auth] JWT Callback - Access token payload keys:", fullPayload ? Object.keys(fullPayload) : []);
        console.log("[Auth] JWT Callback - Has realm_access:", !!fullPayload?.realm_access);
        console.log("[Auth] JWT Callback - Has resource_access:", !!fullPayload?.resource_access);
      }
    }
    
    // If access token doesn't have roles, try ID token
    if (!fullPayload?.realm_access && !fullPayload?.resource_access && account.id_token) {
      const { decodeIdToken } = await import("@/utils/tokenDecode");
      const idTokenPayload = decodeIdToken(account.id_token);
      
      if (idTokenPayload) {
        // Merge ID token data with access token data
        fullPayload = { ...fullPayload, ...idTokenPayload };
        
        if (process.env.NODE_ENV === "development") {
          console.log("[Auth] JWT Callback - Decoded id_token as fallback");
        }
      }
    }
    
    // Store the complete payload
    if (fullPayload) {
      token.fullTokenPayload = fullPayload;
      
      if (process.env.NODE_ENV === "development") {
        console.log("[Auth] JWT Callback - Final fullTokenPayload keys:", Object.keys(fullPayload));
        console.log("[Auth] JWT Callback - Has realm_access:", !!fullPayload.realm_access);
        console.log("[Auth] JWT Callback - Has resource_access:", !!fullPayload.resource_access);
        if (fullPayload.realm_access) {
          console.log("[Auth] JWT Callback - Realm roles:", (fullPayload.realm_access as { roles?: string[] })?.roles);
        }
        if (fullPayload.resource_access) {
          console.log("[Auth] JWT Callback - Resource access keys:", Object.keys(fullPayload.resource_access as Record<string, unknown>));
        }
      }
    } else {
      console.error("[Auth] JWT Callback - Failed to decode both access_token and id_token");
    }

    // Extract roles from access_token (primary) or id_token (fallback)
    const tokenForExtraction = account.access_token || account.id_token;
    const { normalizedRoles } = extractAndNormalizeRoles(
      tokenForExtraction,
      profile as KeycloakProfile | undefined
    );

    if (process.env.NODE_ENV === "development") {
      console.log("[Auth] JWT Callback - Normalized roles:", normalizedRoles);
    }

    token.roles = normalizedRoles;
    return token;
  }

  const isTokenValid =
    token.expiresAt &&
    Date.now() < token.expiresAt * 1000 - AUTH_CONSTANTS.TOKEN_REFRESH_BUFFER_MS;

  if (isTokenValid) {
    return token;
  }

  const refreshedToken = await refreshAccessToken(token);
  
  // After refresh, decode and store the new full token payload
  // Try access_token first (has roles), then idToken
  let refreshedPayload: Record<string, unknown> | null = null;
  
  if (refreshedToken.accessToken) {
    const { decodeIdToken } = await import("@/utils/tokenDecode");
    refreshedPayload = decodeIdToken(refreshedToken.accessToken as string);
    
    if (process.env.NODE_ENV === "development") {
      console.log("[Auth] JWT Callback (after refresh) - Decoded access_token");
      console.log("[Auth] JWT Callback (after refresh) - Has realm_access:", !!refreshedPayload?.realm_access);
      console.log("[Auth] JWT Callback (after refresh) - Has resource_access:", !!refreshedPayload?.resource_access);
    }
  }
  
  // If access token doesn't have roles, try ID token
  if (!refreshedPayload?.realm_access && !refreshedPayload?.resource_access && refreshedToken.idToken) {
    const { decodeIdToken } = await import("@/utils/tokenDecode");
    const idTokenPayload = decodeIdToken(refreshedToken.idToken as string);
    if (idTokenPayload) {
      refreshedPayload = { ...refreshedPayload, ...idTokenPayload };
    }
  }
  
  // Store the payload (prefer refreshed, fallback to original if no roles)
  if (refreshedPayload && (refreshedPayload.realm_access || refreshedPayload.resource_access)) {
    refreshedToken.fullTokenPayload = refreshedPayload;
    console.log("[Auth] JWT Callback (after refresh) - Using refreshed token with roles");
  } else if (token.fullTokenPayload) {
    refreshedToken.fullTokenPayload = token.fullTokenPayload;
    console.log("[Auth] JWT Callback (after refresh) - Preserving original token payload (refresh missing roles)");
  }
  
  return refreshedToken;
}

export async function sessionCallback({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}): Promise<Session> {
  if (!token) {
    return session;
  }

  session.accessToken = token.accessToken as string;
  session.error = token.error as string | undefined;
  session.roles = (token.roles as string[]) || [];

  const minimalPayload = createMinimalTokenPayload(token.idToken as string | undefined);
  if (minimalPayload) {
    session.tokenPayload = minimalPayload;
  }

  return session;
}


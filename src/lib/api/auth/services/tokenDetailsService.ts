import { getToken } from "next-auth/jwt";
import { decodeTokenPayload } from "@/lib/auth/tokenDecode";

export interface TokenDetailsResult {
  tokenPayload: Record<string, unknown>;
}

export interface TokenDetailsError {
  error: string;
  status: number;
}

/**
 * Service for fetching full token details
 */
export async function getTokenDetails(
  request: Request
): Promise<TokenDetailsResult | TokenDetailsError> {
  const token = await getToken({
    req: request as unknown as { headers: Headers },
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return {
      error: "Unauthorized",
      status: 401,
    };
  }

  let fullPayload: Record<string, unknown> | null = null;

  if (token.fullTokenPayload) {
    fullPayload = { ...token.fullTokenPayload } as Record<string, unknown>;
  } else {
    fullPayload = decodeTokenPayload(
      token.accessToken as string | undefined,
      token.idToken as string | undefined
    );
  }

  if (!fullPayload) {
    return {
      error: "No token payload available",
      status: 401,
    };
  }

  // Fetch from userinfo endpoint if realm_access/resource_access are missing
  if (
    !fullPayload.realm_access &&
    !fullPayload.resource_access &&
    token.accessToken
  ) {
    try {
      const userinfoUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`;
      const userinfoResponse = await fetch(userinfoUrl, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });

      if (userinfoResponse.ok) {
        const userinfo = await userinfoResponse.json();
        if (userinfo.realm_access) {
          fullPayload.realm_access = userinfo.realm_access;
        }
        if (userinfo.resource_access) {
          fullPayload.resource_access = userinfo.resource_access;
        }
        if (userinfo.groups) {
          fullPayload.groups = userinfo.groups;
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[token-details] Error fetching userinfo:", error);
      }
    }
  }

  return {
    tokenPayload: fullPayload,
  };
}


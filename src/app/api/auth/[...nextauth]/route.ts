import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import type { JWT } from "next-auth/jwt";

// Validate required environment variables
const requiredEnvVars = {
  KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
  KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0 && process.env.NODE_ENV !== "test") {
  console.error(
    `❌ Missing required environment variables: ${missingVars.join(", ")}\n` +
    `Please check your .env.local file.`
  );
}

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        
        // Extract roles from Keycloak token
        // Keycloak can return roles from:
        // 1. realm_access.roles (realm roles)
        // 2. resource_access[client_id].roles (client roles)
        // 3. Groups (which are mapped to roles in Keycloak)
        let extractedRoles: string[] = [];
        
        if (profile) {
          const realmRoles = profile.realm_access?.roles || [];
          const resourceRoles = profile.resource_access?.[process.env.KEYCLOAK_CLIENT_ID || ""]?.roles || [];
          extractedRoles = [...realmRoles, ...resourceRoles];
        } else if (account.id_token) {
          // Fallback: decode id_token to get roles if profile is not available
          try {
            const payload = JSON.parse(Buffer.from(account.id_token.split(".")[1], "base64").toString());
            const realmRoles = payload.realm_access?.roles || [];
            const resourceRoles = payload.resource_access?.[process.env.KEYCLOAK_CLIENT_ID || ""]?.roles || [];
            extractedRoles = [...realmRoles, ...resourceRoles];
          } catch {
            extractedRoles = [];
          }
        }
        
        // Normalize roles (map Keycloak group names like "admins", "employees", "managers" to our role names)
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { normalizeRoles } = require("@/utils/roles");
        token.roles = normalizeRoles(extractedRoles);
        
        return token;
      }

      if (token.expiresAt && Date.now() < (token.expiresAt * 1000 - 60 * 1000)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.error = token.error as string | undefined;
        session.roles = (token.roles as string[]) || [];
        session.idToken = token.idToken as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken || "",
      }),
      method: "POST",
      cache: "no-store",
    });

    const tokens = await response.json();

    if (!response.ok) {
      throw tokens;
    }

    const updatedToken = {
      ...token,
      idToken: tokens.id_token,
      accessToken: tokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
      refreshToken: tokens.refresh_token || token.refreshToken,
    };

    return updatedToken;
  } catch (error) {
    console.error("Error refreshing access token", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const { handlers, auth } = NextAuth(authOptions);

export { auth };
export const { GET, POST } = handlers;


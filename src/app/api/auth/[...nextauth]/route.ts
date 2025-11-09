import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import type { JWT } from "next-auth/jwt";

// Debug: Log that the route file is being loaded
console.log("🔧 NextAuth route loaded", {
  hasKeycloakIssuer: !!process.env.KEYCLOAK_ISSUER,
  hasClientId: !!process.env.KEYCLOAK_CLIENT_ID,
  hasClientSecret: !!process.env.KEYCLOAK_CLIENT_SECRET,
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
});

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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, account }: any) {
      // Initial sign in - store tokens from account
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        return token;
      }

      // Check if token is still valid (with 60 second buffer)
      if (token.expiresAt && Date.now() < (token.expiresAt * 1000 - 60 * 1000)) {
        return token;
      }

      // Token expired or about to expire, refresh it
      return await refreshAccessToken(token);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.error = token.error as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/", // Redirect errors back to home
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
      cache: "no-store", // Important: prevent caching of token refresh
    });

    const tokens = await response.json();

    if (!response.ok) {
      throw tokens;
    }

    // Update token with new values
    // expiresAt is stored in seconds (Unix timestamp)
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

// NextAuth v5 beta: NextAuth() returns an object with handlers and auth
const nextAuthResult = NextAuth(authOptions);

// Debug: Log the structure of NextAuth result
console.log("🔧 NextAuth result structure:", {
  hasHandlers: !!nextAuthResult.handlers,
  hasAuth: !!nextAuthResult.auth,
  handlerKeys: nextAuthResult.handlers ? Object.keys(nextAuthResult.handlers) : [],
});

// Extract handlers and auth
const { handlers, auth } = nextAuthResult;

// Export auth function for server-side session access (NextAuth v5 pattern)
export { auth };

// Export GET and POST handlers from the handlers object
if (!handlers || !handlers.GET || !handlers.POST) {
  console.error("❌ NextAuth handlers are missing or invalid:", handlers);
  throw new Error("NextAuth handlers not properly initialized");
}

export const { GET, POST } = handlers;


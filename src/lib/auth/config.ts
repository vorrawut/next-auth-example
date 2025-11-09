import KeycloakProvider from "next-auth/providers/keycloak";
import { AUTH_CONSTANTS } from "./constants";
import { jwtCallback } from "./callbacks";
import { sessionCallback } from "./callbacks";

function validateAuthConfig(): void {
  const required = {
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0 && process.env.NODE_ENV !== "test") {
    const error = `Missing required environment variables: ${missing.join(", ")}`;
    console.error(`❌ ${error}\nPlease check your .env.local file.`);
    throw new Error(error);
  }
}

export function createAuthOptions() {
  validateAuthConfig();

  return {
    providers: [
      KeycloakProvider({
        clientId: process.env.KEYCLOAK_CLIENT_ID!,
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
        issuer: process.env.KEYCLOAK_ISSUER!,
      }),
    ],
    session: {
      strategy: "jwt" as const,
      maxAge: AUTH_CONSTANTS.SESSION_MAX_AGE,
    },
    callbacks: {
      jwt: jwtCallback,
      session: sessionCallback,
      redirect: async ({ url, baseUrl }: { url: string; baseUrl: string }) => {
        // If url is relative, make it absolute
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        // If url is on same origin, allow it
        if (new URL(url).origin === baseUrl) return url;
        // Default to home page
        return baseUrl;
      },
    },
    pages: {
      signIn: "/login",
      error: "/auth/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
  };
}

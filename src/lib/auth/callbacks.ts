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

    const { normalizedRoles } = extractAndNormalizeRoles(
      account.id_token,
      profile as KeycloakProfile | undefined
    );

    token.roles = normalizedRoles;
    return token;
  }

  const isTokenValid =
    token.expiresAt &&
    Date.now() < token.expiresAt * 1000 - AUTH_CONSTANTS.TOKEN_REFRESH_BUFFER_MS;

  if (isTokenValid) {
    return token;
  }

  return await refreshAccessToken(token);
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


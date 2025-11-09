export const AUTH_CONSTANTS = {
  SESSION_MAX_AGE: 30 * 24 * 60 * 60,
  TOKEN_REFRESH_BUFFER_MS: 60 * 1000,
  ERRORS: {
    NO_REFRESH_TOKEN: "No refresh token available",
    REFRESH_TOKEN_EXPIRED: "Refresh token expired or invalid, user needs to re-authenticate",
  },
  KEYCLOAK_ERRORS: {
    INVALID_GRANT: "invalid_grant",
    TOKEN_NOT_ACTIVE: "Token is not active",
  },
} as const;


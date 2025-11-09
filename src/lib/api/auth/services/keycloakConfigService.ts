export interface KeycloakConfigResult {
  issuer: string;
  clientId: string;
}

export interface KeycloakConfigError {
  error: string;
  status: number;
}

/**
 * Service for getting Keycloak configuration
 * Only exposes safe, non-sensitive configuration
 */
export function getKeycloakConfig():
  | KeycloakConfigResult
  | KeycloakConfigError {
  const issuer = process.env.KEYCLOAK_ISSUER;
  const clientId = process.env.KEYCLOAK_CLIENT_ID;

  if (!issuer || !clientId) {
    return {
      error: "Keycloak configuration not found",
      status: 500,
    };
  }

  return {
    issuer,
    clientId,
  };
}


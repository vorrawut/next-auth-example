/**
 * API route constants
 * Use these constants for API endpoint paths
 */

export const API_ROUTES = {
  AUTH: {
    BASE: "/api/auth",
    CALLBACK: "/api/auth/callback/keycloak",
    FEDERATED_LOGOUT: "/api/auth/federated-logout",
    TOKEN_DETAILS: "/api/auth/token-details",
    KEYCLOAK_CONFIG: "/api/auth/keycloak-config",
  },
} as const;

export type ApiRoute = typeof API_ROUTES[keyof typeof API_ROUTES][keyof typeof API_ROUTES[keyof typeof API_ROUTES]];

/**
 * Helper to build full API URL (useful for client-side fetch)
 */
export function getApiUrl(route: string): string {
  if (route.startsWith("/")) {
    return route;
  }
  return `/api/${route}`;
}

/**
 * Helper to check if a route is an API route
 */
export function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}


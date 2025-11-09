import type { TokenPayload } from "@/types/token";

export function decodeToken(idToken: string): TokenPayload | null {
  if (!idToken) return null;
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;
    // Decode base64 URL-safe string
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }
    const decoded = atob(base64);
    const payload = JSON.parse(decoded) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
}

export function formatTokenDate(timestamp?: number): string {
  if (!timestamp) return "N/A";
  return new Date(timestamp * 1000).toLocaleString();
}

export function extractAllPermissions(tokenPayload: TokenPayload | Record<string, unknown> | null): string[] {
  if (!tokenPayload) return [];
  
  const permissions: string[] = [];
  
  // Add realm roles
  const realmAccess = tokenPayload.realm_access as { roles?: string[] } | undefined;
  const realmRoles = realmAccess?.roles || [];
  permissions.push(...realmRoles);
  
  // Add all resource roles
  const resourceAccess = tokenPayload.resource_access as Record<string, { roles?: string[] }> | undefined || {};
  Object.values(resourceAccess).forEach((resource) => {
    const roles = resource.roles || [];
    permissions.push(...roles);
  });
  
  return permissions;
}

export function getResourceRolesByResource(tokenPayload: TokenPayload | Record<string, unknown> | null) {
  if (!tokenPayload) return [];
  
  const resourceAccess = tokenPayload.resource_access as Record<string, { roles?: string[] }> | undefined || {};
  return Object.entries(resourceAccess).map(([resource, data]) => ({
    resource,
    roles: data.roles || [],
  }));
}


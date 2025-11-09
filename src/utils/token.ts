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
  if (realmAccess && typeof realmAccess === "object" && "roles" in realmAccess) {
    const realmRoles = Array.isArray(realmAccess.roles) ? realmAccess.roles : [];
    permissions.push(...realmRoles);
  }
  
  // Add all resource roles
  const resourceAccess = tokenPayload.resource_access as Record<string, { roles?: string[] }> | undefined;
  if (resourceAccess && typeof resourceAccess === "object") {
    Object.values(resourceAccess).forEach((resource) => {
      if (resource && typeof resource === "object" && "roles" in resource) {
        const roles = Array.isArray(resource.roles) ? resource.roles : [];
        permissions.push(...roles);
      }
    });
  }
  
  return permissions;
}

export function getResourceRolesByResource(tokenPayload: TokenPayload | Record<string, unknown> | null) {
  if (!tokenPayload) return [];
  
  const resourceAccess = tokenPayload.resource_access as Record<string, { roles?: string[] }> | undefined;
  
  if (!resourceAccess || typeof resourceAccess !== "object") {
    return [];
  }
  
  return Object.entries(resourceAccess).map(([resource, data]) => {
    const roles = data && typeof data === "object" && "roles" in data 
      ? (Array.isArray(data.roles) ? data.roles : [])
      : [];
    return {
      resource,
      roles,
    };
  });
}


export type Role = "employee" | "manager" | "admin";

export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  employee: ["employee"],
  manager: ["employee", "manager"],
  admin: ["employee", "manager", "admin"],
};

// Map Keycloak group/role names to our internal role names
// Handles both singular and plural forms (e.g., "admin"/"admins")
// Also handles common Keycloak role patterns
const ROLE_NAMES: Role[] = ["admin", "manager", "employee"];

function createRoleMap(): Record<string, Role> {
  const map: Record<string, Role> = {};
  ROLE_NAMES.forEach((role) => {
    // Exact matches (singular and plural)
    map[role] = role;
    map[`${role}s`] = role;
    
    // Common Keycloak patterns
    map[`realm-${role}`] = role; // e.g., "realm-admin" -> "admin"
    map[`${role}-role`] = role; // e.g., "admin-role" -> "admin"
    map[`${role}_role`] = role; // e.g., "admin_role" -> "admin"
    
    // Uppercase variants
    map[role.toUpperCase()] = role;
    map[`${role}s`.toUpperCase()] = role;
    
    // With dashes/underscores
    map[role.replace(/-/g, "_")] = role;
    map[role.replace(/_/g, "-")] = role;
  });
  
  // Additional common Keycloak role mappings
  map["realm-admin"] = "admin";
  map["realm-manager"] = "manager";
  map["realm-employee"] = "employee";
  map["administrator"] = "admin";
  map["administrators"] = "admin";
  map["management"] = "manager";
  map["managers"] = "manager";
  map["staff"] = "employee";
  map["employees"] = "employee";
  map["users"] = "employee";
  map["user"] = "employee";
  
  return map;
}

const KEYCLOAK_ROLE_MAP = createRoleMap();

export function normalizeRole(role: string): Role | null {
  const normalized = role.toLowerCase().trim();
  
  // First try exact match
  if (KEYCLOAK_ROLE_MAP[normalized]) {
    return KEYCLOAK_ROLE_MAP[normalized];
  }
  
  // Try partial matches for common patterns
  // Check if role contains our role names (e.g., "realm-admin" contains "admin")
  if (normalized.includes("admin") && !normalized.includes("manager") && !normalized.includes("employee")) {
    return "admin";
  }
  if (normalized.includes("manager") && !normalized.includes("admin")) {
    return "manager";
  }
  if (normalized.includes("employee") || normalized.includes("user") || normalized.includes("staff")) {
    return "employee";
  }
  
  return null;
}

export function normalizeRoles(roles: string[]): Role[] {
  return roles
    .map((role) => normalizeRole(role))
    .filter((role): role is Role => role !== null);
}

export function hasRole(userRoles: string[] | undefined, requiredRole: Role): boolean {
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  // Normalize user roles first
  const normalizedUserRoles = normalizeRoles(userRoles);
  const roleLower = requiredRole.toLowerCase();

  // Check if user has the exact role
  if (normalizedUserRoles.includes(roleLower as Role)) {
    return true;
  }

  // Check if user has a higher role that includes the required role in its hierarchy
  return normalizedUserRoles.some((userRole) => {
    const userRoleHierarchy = ROLE_HIERARCHY[userRole];
    return userRoleHierarchy && userRoleHierarchy.includes(roleLower as Role);
  });
}

export function hasAnyRole(userRoles: string[] | undefined, requiredRoles: Role[]): boolean {
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  return requiredRoles.some((role) => hasRole(userRoles, role));
}

export function hasAllRoles(userRoles: string[] | undefined, requiredRoles: Role[]): boolean {
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  return requiredRoles.every((role) => hasRole(userRoles, role));
}

export function getHighestRole(userRoles: string[] | undefined): Role | null {
  if (!userRoles || userRoles.length === 0) {
    return null;
  }

  // Normalize roles first
  const normalizedRoles = normalizeRoles(userRoles);

  if (normalizedRoles.includes("admin")) {
    return "admin";
  }
  if (normalizedRoles.includes("manager")) {
    return "manager";
  }
  if (normalizedRoles.includes("employee")) {
    return "employee";
  }

  return null;
}

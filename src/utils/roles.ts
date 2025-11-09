export type Role = "employee" | "manager" | "admin";

export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  employee: ["employee"],
  manager: ["employee", "manager"],
  admin: ["employee", "manager", "admin"],
};

// Map Keycloak group/role names to our internal role names
// Handles both singular and plural forms (e.g., "admin"/"admins")
const ROLE_NAMES: Role[] = ["admin", "manager", "employee"];

function createRoleMap(): Record<string, Role> {
  const map: Record<string, Role> = {};
  ROLE_NAMES.forEach((role) => {
    map[role] = role;
    map[`${role}s`] = role; // plural form
  });
  return map;
}

const KEYCLOAK_ROLE_MAP = createRoleMap();

export function normalizeRole(role: string): Role | null {
  const normalized = role.toLowerCase().trim();
  return KEYCLOAK_ROLE_MAP[normalized] || null;
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

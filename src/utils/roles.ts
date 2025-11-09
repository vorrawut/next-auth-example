import { mapKeycloakRolesToInternal } from "@/config/roleMappings";

export type Role = "employee" | "manager" | "admin";

export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  employee: ["employee"],
  manager: ["employee", "manager"],
  admin: ["employee", "manager", "admin"],
};

export function normalizeRole(role: string): Role | null {
  return mapKeycloakRolesToInternal([role])[0] || null;
}

export function normalizeRoles(roles: string[]): Role[] {
  return mapKeycloakRolesToInternal(roles);
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

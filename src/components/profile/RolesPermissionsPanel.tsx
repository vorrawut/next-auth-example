"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/LoadingState";
import type { Session } from "next-auth";
import { useToken } from "@/contexts/TokenContext";
import { extractAllPermissions, getResourceRolesByResource } from "@/utils/token";
import { normalizeRoles } from "@/utils/roles";
import { getUnmappedRoles, mapKeycloakRoleToInternal } from "@/config/roleMappings";

interface RolesPermissionsPanelProps {
  session: Session | null;
}

export function RolesPermissionsPanel({ session }: RolesPermissionsPanelProps) {
  const { fullTokenPayload, loading } = useToken();
  
  // Extract data from full token payload
  // Use type assertion to handle Record<string, unknown> from context
  const realmAccess = fullTokenPayload?.realm_access as { roles?: string[] } | undefined;
  const realmRoles = Array.isArray(realmAccess?.roles) ? realmAccess.roles : [];
  
  const resourceAccess = fullTokenPayload?.resource_access as Record<string, { roles?: string[] }> | undefined;
  const resourceRolesByResource = getResourceRolesByResource(fullTokenPayload as { resource_access?: Record<string, { roles?: string[] }>; groups?: string[] } | null);
  const groups = Array.isArray(fullTokenPayload?.groups) ? (fullTokenPayload.groups as string[]) : [];
  const allPermissions = extractAllPermissions(fullTokenPayload as { realm_access?: { roles?: string[] }; resource_access?: Record<string, { roles?: string[] }> } | null);
  
  // Debug: Log raw token structure with detailed inspection
  if (fullTokenPayload && !loading) {
    // Direct inspection of token payload
    const directRealmAccess = fullTokenPayload["realm_access"];
    const directResourceAccess = fullTokenPayload["resource_access"];
    const directGroups = fullTokenPayload["groups"];
    
    console.log("[RolesPermissionsPanel] Raw Token Structure:", {
      hasFullToken: !!fullTokenPayload,
      fullTokenPayloadKeys: Object.keys(fullTokenPayload),
      // Direct property access
      directRealmAccess,
      directRealmAccessType: typeof directRealmAccess,
      directResourceAccess,
      directResourceAccessType: typeof directResourceAccess,
      directGroups,
      directGroupsType: typeof directGroups,
      // Extracted values
      hasRealmAccess: !!realmAccess,
      realmAccess,
      realmAccessType: typeof realmAccess,
      realmAccessKeys: realmAccess ? Object.keys(realmAccess) : [],
      realmRoles,
      realmRolesType: typeof realmRoles,
      realmRolesIsArray: Array.isArray(realmRoles),
      hasResourceAccess: !!resourceAccess,
      resourceAccess,
      resourceAccessType: typeof resourceAccess,
      resourceAccessKeys: resourceAccess ? Object.keys(resourceAccess) : [],
      resourceRolesByResource,
      resourceRolesByResourceLength: resourceRolesByResource.length,
      groups,
      groupsType: typeof groups,
      groupsIsArray: Array.isArray(groups),
      // Full payload sample (first 500 chars)
      fullTokenPayloadSample: JSON.stringify(fullTokenPayload).substring(0, 500),
    });
  }
  
  // Get normalized roles from session, or extract and normalize from full token as fallback
  const normalizedRoles = useMemo(() => {
    // Always try to normalize from full token payload (more reliable)
    if (fullTokenPayload && !loading) {
      const allRoles: string[] = [];
      
      // Add realm roles
      if (realmRoles.length > 0) {
        allRoles.push(...realmRoles);
      }
      
      // Add all resource roles
      resourceRolesByResource.forEach(({ roles }) => {
        allRoles.push(...roles);
      });
      
      // Add groups
      if (groups.length > 0) {
        allRoles.push(...groups);
      }
      
      // Normalize and return unique roles
      const normalized = normalizeRoles(allRoles);
      const unmapped = getUnmappedRoles(allRoles);
      
      // Debug logging (always show in browser console)
      console.log("[RolesPermissionsPanel] Debug Info:", {
        hasFullToken: !!fullTokenPayload,
        fullTokenPayloadKeys: fullTokenPayload ? Object.keys(fullTokenPayload) : [],
        realmAccess: fullTokenPayload?.realm_access,
        resourceAccess: fullTokenPayload?.resource_access,
        realmRoles,
        resourceRolesByResource,
        groups,
        allExtractedRoles: allRoles,
        normalizedRoles: normalized,
        normalizedRolesLength: normalized.length,
        unmappedRoles: unmapped,
        sessionRoles: session?.roles,
        // Test mapping directly
        testMapping: allRoles.length > 0 ? {
          firstRole: allRoles[0],
          mapped: mapKeycloakRoleToInternal(allRoles[0]),
          testRealmAdmin: mapKeycloakRoleToInternal("realm-admin"),
        } : null,
        // Test normalizeRoles function directly
        testNormalizeRoles: allRoles.length > 0 ? normalizeRoles([allRoles[0]]) : [],
      });
      
      // Log unmapped roles as warning (these need to be added to roleMappings.ts)
      if (unmapped.length > 0) {
        console.warn(
          "[RolesPermissionsPanel] Unmapped Keycloak roles detected. " +
          "Add mappings in src/config/roleMappings.ts:",
          unmapped
        );
      }
      
      // Additional debug: check if realm-admin is in allRoles
      if (allRoles.includes("realm-admin")) {
        console.log("[RolesPermissionsPanel] Found 'realm-admin' in allRoles, mapping result:", {
          directMapping: mapKeycloakRoleToInternal("realm-admin"),
          normalizedResult: normalized,
        });
      }
      
      return normalized;
    }
    
    // Fallback to session roles if token not loaded yet
    return session?.roles || [];
  }, [session?.roles, fullTokenPayload, loading, realmRoles, resourceRolesByResource, groups]);
  
  if (loading) {
    return (
      <Card>
        <CardHeader title="Roles & Permissions" />
        <CardContent>
          <LoadingState message="Loading roles and permissions..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Roles & Permissions" />
      <CardContent className="space-y-4">
        {/* Application Roles */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Application Roles (Normalized)
          </h3>
          <div className="flex flex-wrap gap-2">
            {normalizedRoles.length > 0 ? (
              normalizedRoles.map((role) => (
                <Badge key={role} variant="purple">
                  {role}
                </Badge>
              ))
            ) : (
              <div className="space-y-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm block">
                  No application roles assigned. Please log out and log back in to refresh roles.
                </span>
                {process.env.NODE_ENV === "development" && (
                  <details className="text-xs text-gray-400 dark:text-gray-500">
                    <summary className="cursor-pointer">Debug Info</summary>
                    <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                      {JSON.stringify({
                        hasFullToken: !!fullTokenPayload,
                        normalizedRolesLength: normalizedRoles.length,
                        normalizedRoles,
                        sessionRoles: session?.roles,
                        realmRolesCount: realmRoles.length,
                        resourceRolesCount: resourceRolesByResource.reduce((sum, r) => sum + r.roles.length, 0),
                        groupsCount: groups.length,
                      }, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Unmapped Roles Warning (Development Only) */}
        {process.env.NODE_ENV === "development" && fullTokenPayload && !loading && (() => {
          const allRoles: string[] = [];
          if (realmRoles.length > 0) allRoles.push(...realmRoles);
          resourceRolesByResource.forEach(({ roles }) => allRoles.push(...roles));
          if (groups.length > 0) allRoles.push(...groups);
          const unmapped = getUnmappedRoles(allRoles);
          
          if (unmapped.length > 0) {
            return (
              <div className="border-l-4 border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Unmapped Roles ({unmapped.length})
                </h3>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                  These Keycloak roles don't have mappings. Add them to <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">src/config/roleMappings.ts</code>
                </p>
                <div className="flex flex-wrap gap-2">
                  {unmapped.map((role) => (
                    <Badge key={role} variant="orange">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Realm Roles */}
        {realmRoles.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Realm Roles ({realmRoles.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {realmRoles.map((role) => (
                <Badge key={role} variant="blue">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Resource Roles */}
        {resourceRolesByResource.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Resource Roles & Permissions
            </h3>
            <div className="space-y-3">
              {resourceRolesByResource.map(({ resource, roles }) => (
                <div
                  key={resource}
                  className="border-l-2 border-green-400 dark:border-green-600 pl-3"
                >
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                    {resource} ({roles.length} {roles.length === 1 ? "permission" : "permissions"})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <Badge key={`${resource}-${role}`} variant="green">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups */}
        {groups.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Groups ({groups.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <Badge key={group} variant="orange">
                  {group}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* All Permissions Summary */}
        {allPermissions.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              All Permissions Summary ({allPermissions.length} total)
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {allPermissions.join(", ")}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


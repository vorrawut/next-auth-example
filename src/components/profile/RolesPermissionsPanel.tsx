import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { TokenPayload } from "@/types/token";
import type { Session } from "next-auth";
import { extractAllPermissions, getResourceRolesByResource } from "@/utils/token";

interface RolesPermissionsPanelProps {
  session: Session | null;
  tokenPayload: TokenPayload | null;
}

export function RolesPermissionsPanel({ session, tokenPayload }: RolesPermissionsPanelProps) {
  const realmRoles = tokenPayload?.realm_access?.roles || [];
  const resourceRolesByResource = getResourceRolesByResource(tokenPayload);
  const groups = tokenPayload?.groups || [];
  const allPermissions = extractAllPermissions(tokenPayload);

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
            {session?.roles && session.roles.length > 0 ? (
              session.roles.map((role) => (
                <Badge key={role} variant="purple">
                  {role}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                No application roles assigned
              </span>
            )}
          </div>
        </div>

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


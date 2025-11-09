"use client";

import { Badge } from "@/components/ui/Badge";
import { usePermissions } from "@/contexts/PermissionContext";

interface RolesDisplayProps {
  variant?: "purple" | "blue" | "green" | "orange";
}

export function RolesDisplay({ variant = "purple" }: RolesDisplayProps) {
  const { normalizedRoles } = usePermissions();

  if (!normalizedRoles || normalizedRoles.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
          Your Roles
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No roles assigned</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
        Your Roles
      </h3>
      <div className="flex flex-wrap gap-2">
        {normalizedRoles.map((role) => (
          <Badge key={role} variant={variant} size="sm">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        ))}
      </div>
    </div>
  );
}


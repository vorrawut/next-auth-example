"use client";

import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/Badge";
import { usePermissions } from "@/contexts/PermissionContext";

export function WelcomeCard() {
  const { data: session } = useSession();
  const { highestRole } = usePermissions();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
        Welcome, {session?.user?.name || session?.user?.email}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Role: {highestRole ? (
          <Badge variant="blue" size="xs">
            {highestRole.charAt(0).toUpperCase() + highestRole.slice(1)}
          </Badge>
        ) : (
          "Unknown"
        )}
      </p>
    </div>
  );
}


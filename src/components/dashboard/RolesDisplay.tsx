import { Badge } from "@/components/ui/Badge";
import type { Session } from "next-auth";

interface RolesDisplayProps {
  session: Session | null;
  variant?: "purple" | "blue" | "green" | "orange";
}

export function RolesDisplay({ session, variant = "purple" }: RolesDisplayProps) {
  if (!session?.roles || session.roles.length === 0) {
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
        {session.roles.map((role) => (
          <Badge key={role} variant={variant} size="sm">
            {role}
          </Badge>
        ))}
      </div>
    </div>
  );
}


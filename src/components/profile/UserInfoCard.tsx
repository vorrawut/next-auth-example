import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { InfoField } from "@/components/ui/InfoField";
import { Badge } from "@/components/ui/Badge";
import type { TokenPayload } from "@/types/token";
import type { Session } from "next-auth";
import type { Role } from "@/utils/roles";

interface UserInfoCardProps {
  session: Session | null;
  tokenPayload: TokenPayload | null;
  highestRole: Role | null;
}

export function UserInfoCard({ session, tokenPayload, highestRole }: UserInfoCardProps) {
  return (
    <Card>
      <CardHeader title="User Information" />
      <CardContent className="space-y-3 text-sm">
        <InfoField
          label="Name"
          value={session?.user?.name || "N/A"}
        />
        <InfoField
          label="Email"
          value={session?.user?.email || "N/A"}
        />
        <InfoField
          label="Username"
          value={tokenPayload?.preferred_username || "N/A"}
        />
        <InfoField
          label="Highest Role"
          value={
            highestRole ? (
              <Badge variant="blue" size="xs">
                {highestRole.charAt(0).toUpperCase() + highestRole.slice(1)}
              </Badge>
            ) : (
              "N/A"
            )
          }
        />
        <InfoField
          label="Email Verified"
          value={
            tokenPayload?.email_verified ? (
              <span className="text-green-600 dark:text-green-400">✓ Verified</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">✗ Not Verified</span>
            )
          }
        />
      </CardContent>
    </Card>
  );
}


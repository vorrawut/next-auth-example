"use client";

import { useSession } from "next-auth/react";
import { Card, CardHeader, CardContent, InfoField, Badge } from "@/components/ui";
import { useToken } from "@/contexts/TokenContext";
import { usePermissions } from "@/contexts/PermissionContext";
import { getTokenString, getTokenBoolean } from "@/utils/tokenHelpers";

export function UserInfoCard() {
  const { data: session } = useSession();
  const { fullTokenPayload } = useToken();
  const { highestRole } = usePermissions();
  
  // Extract user fields from full token payload
  const givenName = getTokenString(fullTokenPayload, "given_name") || "";
  const familyName = getTokenString(fullTokenPayload, "family_name") || "";
  const preferredUsername = getTokenString(fullTokenPayload, "preferred_username") || "";
  const emailVerified = getTokenBoolean(fullTokenPayload, "email_verified") ?? false;
  
  return (
    <Card>
      <CardHeader title="User Information" />
      <CardContent className="space-y-3 text-sm">
        <InfoField
          label="Name"
          value={session?.user?.name || "N/A"}
        />
        {givenName && (
          <InfoField
            label="First Name"
            value={givenName}
          />
        )}
        {familyName && (
          <InfoField
            label="Last Name"
            value={familyName}
          />
        )}
        <InfoField
          label="Email"
          value={session?.user?.email || "N/A"}
        />
        <InfoField
          label="Username"
          value={preferredUsername || "N/A"}
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
            emailVerified ? (
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


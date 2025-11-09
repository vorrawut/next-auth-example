import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { InfoField } from "@/components/ui/InfoField";
import { formatTokenDate } from "@/utils/token";
import type { TokenPayload } from "@/types/token";

interface TokenInfoCardProps {
  tokenPayload: TokenPayload | null;
}

export function TokenInfoCard({ tokenPayload }: TokenInfoCardProps) {
  return (
    <Card>
      <CardHeader title="Token Information" />
      <CardContent className="space-y-3 text-sm">
        <InfoField
          label="Issued At"
          value={formatTokenDate(tokenPayload?.iat)}
        />
        <InfoField
          label="Expires At"
          value={formatTokenDate(tokenPayload?.exp)}
        />
        <InfoField
          label="Issuer"
          value={
            <span className="break-all">{tokenPayload?.iss || "N/A"}</span>
          }
        />
        <InfoField
          label="Subject ID"
          value={
            <span className="break-all">{tokenPayload?.sub || "N/A"}</span>
          }
        />
        <InfoField
          label="Client ID"
          value={tokenPayload?.azp || "N/A"}
        />
      </CardContent>
    </Card>
  );
}


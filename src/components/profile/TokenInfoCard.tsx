"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { InfoField } from "@/components/ui/InfoField";
import { formatTokenDate } from "@/utils/token";
import { useToken } from "@/contexts/TokenContext";

export function TokenInfoCard() {
  const { fullTokenPayload } = useToken();
  
  if (!fullTokenPayload) {
    return (
      <Card>
        <CardHeader title="Token Information" />
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading token information...</p>
        </CardContent>
      </Card>
    );
  }
  
  const iat = fullTokenPayload.iat as number | undefined;
  const exp = fullTokenPayload.exp as number | undefined;
  const authTime = fullTokenPayload.auth_time as number | undefined;
  const jti = fullTokenPayload.jti as string | undefined;
  const iss = fullTokenPayload.iss as string | undefined;
  const aud = fullTokenPayload.aud as string | string[] | undefined;
  const sub = fullTokenPayload.sub as string | undefined;
  const typ = fullTokenPayload.typ as string | undefined;
  const azp = fullTokenPayload.azp as string | undefined;
  const sid = fullTokenPayload.sid as string | undefined;
  const acr = fullTokenPayload.acr as string | undefined;
  const scope = fullTokenPayload.scope as string | undefined;
  const allowedOrigins = fullTokenPayload["allowed-origins"] as string[] | undefined;
  
  return (
    <Card>
      <CardHeader title="Token Information" />
      <CardContent className="space-y-3 text-sm">
        <InfoField
          label="Issued At"
          value={formatTokenDate(iat)}
        />
        <InfoField
          label="Expires At"
          value={formatTokenDate(exp)}
        />
        {authTime && (
          <InfoField
            label="Auth Time"
            value={formatTokenDate(authTime)}
          />
        )}
        {jti && (
          <InfoField
            label="JWT ID"
            value={<span className="break-all font-mono text-xs">{jti}</span>}
          />
        )}
        <InfoField
          label="Issuer"
          value={<span className="break-all">{iss || "N/A"}</span>}
        />
        {aud && (
          <InfoField
            label="Audience"
            value={
              Array.isArray(aud) ? (
                <div className="space-y-1">
                  {aud.map((a, i) => (
                    <span key={i} className="block text-xs">{a}</span>
                  ))}
                </div>
              ) : (
                aud
              )
            }
          />
        )}
        <InfoField
          label="Subject ID"
          value={<span className="break-all font-mono text-xs">{sub || "N/A"}</span>}
        />
        {typ && (
          <InfoField
            label="Token Type"
            value={typ}
          />
        )}
        <InfoField
          label="Client ID"
          value={azp || "N/A"}
        />
        {sid && (
          <InfoField
            label="Session ID"
            value={<span className="break-all font-mono text-xs">{sid}</span>}
          />
        )}
        {acr && (
          <InfoField
            label="ACR"
            value={acr}
          />
        )}
        {scope && (
          <InfoField
            label="Scope"
            value={scope}
          />
        )}
        {allowedOrigins && allowedOrigins.length > 0 && (
          <InfoField
            label="Allowed Origins"
            value={
              <div className="space-y-1">
                {allowedOrigins.map((origin, i) => (
                  <span key={i} className="block text-xs">{origin}</span>
                ))}
              </div>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}


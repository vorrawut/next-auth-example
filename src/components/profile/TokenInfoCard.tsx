"use client";

import { Card, CardHeader, CardContent, InfoField } from "@/components/ui";
import { formatTokenDate } from "@/utils/token";
import { useToken } from "@/contexts/TokenContext";
import { getTokenNumber, getTokenString, getTokenArray } from "@/utils/tokenHelpers";

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
  
  const iat = getTokenNumber(fullTokenPayload, "iat");
  const exp = getTokenNumber(fullTokenPayload, "exp");
  const authTime = getTokenNumber(fullTokenPayload, "auth_time");
  const jti = getTokenString(fullTokenPayload, "jti");
  const iss = getTokenString(fullTokenPayload, "iss");
  const aud = fullTokenPayload.aud as string | string[] | undefined;
  const sub = getTokenString(fullTokenPayload, "sub");
  const typ = getTokenString(fullTokenPayload, "typ");
  const azp = getTokenString(fullTokenPayload, "azp");
  const sid = getTokenString(fullTokenPayload, "sid");
  const acr = getTokenString(fullTokenPayload, "acr");
  const scope = getTokenString(fullTokenPayload, "scope");
  const allowedOrigins = getTokenArray<string>(fullTokenPayload, "allowed-origins");
  
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


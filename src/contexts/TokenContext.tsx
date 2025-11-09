"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";

// Use Record to accept all fields from the token, not just those in TokenPayload
interface TokenContextType {
  fullTokenPayload: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

const TokenContext = createContext<TokenContextType>({
  fullTokenPayload: null,
  loading: true,
  error: null,
});

export function useToken() {
  return useContext(TokenContext);
}

interface TokenProviderProps {
  children: ReactNode;
}

export function TokenProvider({ children }: TokenProviderProps) {
  const { data: session, status } = useSession();
  const [fullTokenPayload, setFullTokenPayload] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if authenticated
    if (status !== "authenticated" || !session) {
      setLoading(false);
      setFullTokenPayload(null);
      return;
    }

    // If we already have the payload, don't fetch again
    if (fullTokenPayload) {
      setLoading(false);
      return;
    }

    async function fetchFullToken() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/auth/token-details");
        
        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized. Please log in again.");
          } else {
            setError(`Failed to fetch token details: ${response.statusText}`);
          }
          setFullTokenPayload(null);
          return;
        }
        
        const data = await response.json();
        setFullTokenPayload(data.tokenPayload);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch token details");
        setFullTokenPayload(null);
      } finally {
        setLoading(false);
      }
    }

    fetchFullToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  // Reset when session changes (logout/login)
  useEffect(() => {
    if (status === "unauthenticated") {
      setFullTokenPayload(null);
      setError(null);
      setLoading(false);
    }
  }, [status]);

  return (
    <TokenContext.Provider value={{ fullTokenPayload, loading, error }}>
      {children}
    </TokenContext.Provider>
  );
}


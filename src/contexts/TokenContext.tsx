"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { API_ROUTES } from "@/lib/routes";

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
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session) {
      setLoading(false);
      setFullTokenPayload(null);
      hasFetchedRef.current = false;
      return;
    }

    if (hasFetchedRef.current) {
      setLoading(false);
      return;
    }

    async function fetchFullToken() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ROUTES.AUTH.TOKEN_DETAILS);
        
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
        hasFetchedRef.current = true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch token details");
        setFullTokenPayload(null);
      } finally {
        setLoading(false);
      }
    }

    fetchFullToken();
  }, [status, session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setFullTokenPayload(null);
      setError(null);
      setLoading(false);
      hasFetchedRef.current = false;
    }
  }, [status]);

  return (
    <TokenContext.Provider value={{ fullTokenPayload, loading, error }}>
      {children}
    </TokenContext.Provider>
  );
}


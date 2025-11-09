"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { TokenProvider } from "@/contexts/TokenContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TokenProvider>{children}</TokenProvider>
    </SessionProvider>
  );
}


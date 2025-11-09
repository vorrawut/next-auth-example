"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { PAGE_ROUTES, getLoginRedirectUrl } from "@/lib/routes";

export function useLoginError() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const callbackUrl = getLoginRedirectUrl(searchParams.get("callbackUrl"));

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl);
      }
    });

    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "Configuration":
          setError("There's a problem with the server configuration. Please contact support.");
          break;
        case "AccessDenied":
          setError("Access denied. You don't have permission to access this application.");
          break;
        case "Verification":
          setError("The verification token has expired or has already been used.");
          break;
        case "Default":
          setError("An error occurred during authentication. Please try again.");
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
      }
    }
  }, [searchParams, callbackUrl, router]);

  return error;
}

"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoadingState } from "@/components/ui/LoadingState";
import { LogoutConfirmation } from "@/components/auth";
import { PAGE_ROUTES } from "@/lib/routes";

export default function LogoutPage() {
  const router = useRouter();
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <LoadingState />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push(PAGE_ROUTES.LOGIN);
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-8 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <div className="w-full max-w-md">
        <LogoutConfirmation />
      </div>
    </div>
  );
}

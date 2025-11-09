"use client";

import { Suspense } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { ResetPasswordHeader, ResetPasswordForm } from "@/components/auth";
import { PAGE_ROUTES } from "@/lib/routes";
import Link from "next/link";

function ResetPasswordContent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 p-8 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <div className="w-full max-w-md">
        <ResetPasswordHeader />
        <ResetPasswordForm />
        <div className="mt-6 text-center">
          <Link
            href={PAGE_ROUTES.LOGIN}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors inline-flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <LoadingState />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

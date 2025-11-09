"use client";

import { useSession } from "next-auth/react";

export function LogoutHeader() {
  const { data: session } = useSession();

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </div>
      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Are you sure you want to sign out?
      </p>
      {session?.user && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Signed in as <strong className="text-gray-900 dark:text-white">{session.user.name || session.user.email}</strong>
        </p>
      )}
    </div>
  );
}

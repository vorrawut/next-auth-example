"use client";

import { Button } from "@/components/ui/Button";

interface FirstTimeLoginSectionProps {
  onFirstTimeLogin: () => void;
  loading: boolean;
}

export function FirstTimeLoginSection({
  onFirstTimeLogin,
  loading,
}: FirstTimeLoginSectionProps) {
  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
        First Time Login?
      </h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        If an administrator created your account, you'll need to set a new password on your first login.
      </p>
      <Button
        onClick={onFirstTimeLogin}
        variant="primary"
        size="lg"
        fullWidth
        disabled={loading}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Redirecting...
          </span>
        ) : (
          "Login & Set Password"
        )}
      </Button>
    </div>
  );
}

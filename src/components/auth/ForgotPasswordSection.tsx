"use client";

import { Button } from "@/components/ui/Button";

interface ForgotPasswordSectionProps {
  onResetPassword: () => void;
  loading: boolean;
}

export function ForgotPasswordSection({
  onResetPassword,
  loading,
}: ForgotPasswordSectionProps) {
  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
        Forgot Your Password?
      </h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Request a password reset link to be sent to your email.
      </p>
      <Button
        onClick={onResetPassword}
        variant="secondary"
        size="lg"
        fullWidth
        disabled={loading}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
            Processing...
          </span>
        ) : (
          "Request Reset Link"
        )}
      </Button>
    </div>
  );
}

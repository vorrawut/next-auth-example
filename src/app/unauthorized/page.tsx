import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-6 text-center">
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400">
          403 - Access Denied
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          You don&apos;t have permission to access this page.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please contact your administrator if you believe this is an error.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}


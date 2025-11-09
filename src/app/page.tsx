import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import Nav from "@/components/Nav";
import { PAGE_ROUTES } from "@/lib/routes";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect(PAGE_ROUTES.LOGIN);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans dark:from-gray-900 dark:via-black dark:to-gray-900">
      <Nav />
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Welcome to Your Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              You're successfully authenticated with Keycloak
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🔐</div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Secure Authentication
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Powered by Keycloak OIDC for enterprise-grade security
              </p>
            </div>

            <div className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Fast & Reliable
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                JWT tokens with automatic refresh for seamless experience
              </p>
            </div>

            <div className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🛡️</div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Role-Based Access
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Fine-grained permissions and role management
              </p>
            </div>

            <div className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Modern Stack
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Built with Next.js, NextAuth.js, and TypeScript
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { Card, CardHeader, CardContent } from "@/components/ui";
import { LoadingState, ErrorState } from "@/components/ui";
import { PageHeader } from "@/components/ui";
import { PersonalInfo } from "@/components/dashboard";

export default function SecuredPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingState />;
  }

  if (status === "unauthenticated") {
    return <ErrorState message="Access Denied. Please log in." />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-6">
        <PageHeader title="Secured Page" backHref="/" />
        <Card>
          <CardHeader title={`Welcome, ${session?.user?.name || session?.user?.email}!`} />
          <CardContent>
            <PersonalInfo />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


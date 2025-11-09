"use client";

import { Card, CardContent } from "@/components/ui";
import { PageHeader } from "@/components/ui";
import { WelcomeCard, PersonalInfo, RolesDisplay } from "@/components/dashboard";

export default function EmployeeDashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-6">
        <PageHeader title="My Dashboard" backHref="/" />
        <Card>
          <CardContent className="space-y-4">
            <WelcomeCard />
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <PersonalInfo />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <RolesDisplay variant="purple" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


"use client";

import { useSession } from "next-auth/react";
import { InfoField } from "@/components/ui/InfoField";

export function PersonalInfo() {
  const { data: session } = useSession();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
        Personal Information
      </h3>
      <div className="space-y-2 text-sm">
        <InfoField
          label="Email"
          value={session?.user?.email || "N/A"}
          className="text-gray-700 dark:text-gray-300"
        />
        {session?.user?.name && (
          <InfoField
            label="Name"
            value={session?.user?.name}
            className="text-gray-700 dark:text-gray-300"
          />
        )}
      </div>
    </div>
  );
}


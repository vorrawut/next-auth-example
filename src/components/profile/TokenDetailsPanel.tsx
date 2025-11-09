"use client";

import { Card, CardHeader, CardContent, LoadingState, ErrorState } from "@/components/ui";
import { useToken } from "@/contexts/TokenContext";

export function TokenDetailsPanel() {
  const { fullTokenPayload, loading, error } = useToken();

  if (loading) {
    return (
      <Card>
        <CardHeader title="Token Details" />
        <CardContent>
          <LoadingState message="Loading full token details..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Token Details" />
        <CardContent>
          <ErrorState message={error} />
        </CardContent>
      </Card>
    );
  }

  if (!fullTokenPayload) {
    return (
      <Card>
        <CardHeader title="Token Details" />
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Token details are not available. Please refresh the page or log in again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Token Details (Full Payload)" />
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700">
          <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
            {JSON.stringify(fullTokenPayload, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}


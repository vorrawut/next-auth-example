import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import type { TokenPayload } from "@/types/token";

interface TokenDetailsPanelProps {
  tokenPayload: TokenPayload | null;
}

export function TokenDetailsPanel({ tokenPayload }: TokenDetailsPanelProps) {
  if (!tokenPayload) return null;

  return (
    <Card>
      <CardHeader title="Token Details" />
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700">
          <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
            {JSON.stringify(tokenPayload, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}


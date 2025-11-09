import { ReactNode } from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  backHref = "/",
  backLabel = "← Back to Home",
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-black dark:text-white">{title}</h1>
      <div className="flex items-center gap-3">
        {actions}
        <Link
          href={backHref}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}


import { ReactNode } from "react";

interface InfoFieldProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function InfoField({ label, value, className = "" }: InfoFieldProps) {
  return (
    <div className={className}>
      <span className="text-gray-600 dark:text-gray-400 font-medium">{label}:</span>
      <div className="text-gray-900 dark:text-gray-100 mt-1">{value}</div>
    </div>
  );
}


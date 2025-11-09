import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  className?: string;
}

export function CardHeader({ title, className = "" }: CardHeaderProps) {
  return (
    <h2 className={`text-xl font-semibold text-black dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 ${className}`}>
      {title}
    </h2>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}


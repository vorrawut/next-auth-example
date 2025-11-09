interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "blue" | "green" | "orange" | "gray";
  size?: "xs" | "sm" | "md";
  className?: string;
}

const variantStyles = {
  purple: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
  blue: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  green: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
  orange: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
  gray: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
};

const sizeStyles = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
};

export function Badge({
  children,
  variant = "gray",
  size = "xs",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}


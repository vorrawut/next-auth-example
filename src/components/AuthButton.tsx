"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { PAGE_ROUTES } from "@/lib/routes";

interface AuthButtonProps {
  type: "login" | "logout";
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export default function AuthButton({
  type,
  variant,
  size = "lg",
  fullWidth = false,
  className = "",
}: AuthButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (type === "login") {
      router.push(PAGE_ROUTES.LOGIN);
    } else {
      router.push(PAGE_ROUTES.LOGOUT);
    }
  };

  const buttonVariant = variant || (type === "login" ? "primary" : "danger");
  const buttonText = type === "login" ? "Login with Keycloak" : "Logout";

  return (
    <Button
      onClick={handleClick}
      variant={buttonVariant}
      size={size}
      fullWidth={fullWidth}
      className={className}
    >
      {buttonText}
    </Button>
  );
}


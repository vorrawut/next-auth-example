"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui";

export default function Login() {
  const handleLogin = () => {
    signIn("keycloak", { callbackUrl: "/" });
  };

  return (
    <Button onClick={handleLogin} variant="primary" size="lg" fullWidth className="md:w-[200px]">
      Login with Keycloak
    </Button>
  );
}


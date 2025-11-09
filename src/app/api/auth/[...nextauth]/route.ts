import NextAuth from "next-auth";
import { createAuthOptions } from "@/lib/auth/config";

export const authOptions = createAuthOptions();

const { handlers, auth } = NextAuth(authOptions);

export { auth };
export const { GET, POST } = handlers;


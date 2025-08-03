import { authOptions } from "@/lib/auth/options";
import NextAuth, { NextAuthOptions } from "next-auth";

const handler = NextAuth(authOptions as NextAuthOptions);

export { handler as GET, handler as POST };

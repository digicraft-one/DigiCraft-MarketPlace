import { NextAuthOptions } from "next-auth";
import credentialsProvider from "./providers";

export const authOptions: NextAuthOptions = {
    providers: [credentialsProvider],

    session: { strategy: "jwt" },
    pages: { signIn: "/login" },

    secret: process.env.NEXTAUTH_SECRET,
};

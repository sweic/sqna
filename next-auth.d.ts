import { DefaultSession } from "next-auth";
import NextAuth, { DefaultUser, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    accessTokenExpires: number;
    refreshTokenExpires: number;
    username: string;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    username: string;
    accessToken: string;
    error: string;
  }
}

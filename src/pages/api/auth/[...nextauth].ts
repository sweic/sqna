import argon2 from "argon2";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import NextAuth, { type NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { signOut } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../../server/db/client";
dotenv.config();
const getNewTokens = (token: JWT): JWT => {
  if (Date.now() > (token.refreshTokenExpires as number))
    return {
      ...token,
      error: "RefreshTokenExpires",
    };
  return {
    ...token,
    refreshTokenExpires: Date.now() + 1000 * 60 * 60 * 24 * 28,
    refreshToken: jwt.sign(uuidv4(), process.env.JWT_SECRET as jwt.Secret),
    accessToken: jwt.sign(uuidv4(), process.env.JWT_SECRET as jwt.Secret),
    accessTokenExpires: Date.now() + 1000 * 60 * 30,
  };
};
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user, account }) => {
      console.log("account" + account);
      console.log("user" + user);
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          refreshTokenExpires: Date.now() + 1000 * 60 * 60 * 24 * 28,
          accessTokenExpires: Date.now() + account.expires_at! * 1000,
          username: user.name as string,
          user,
        };
      }
      if (Date.now() < (token.accessTokenExpires as number)) return token;
      return getNewTokens(token);
    },
    session: async ({ session, token }) => {
      if (token.error) signOut({ callbackUrl: "/" });
      const username = (token.user as any).username;
      session.username = username;
      session.accessToken = token.accessToken as string;
      session.error = token.error as string;
      session.user = { name: username };
      console.log("token" + JSON.stringify(token));
      console.log("session" + JSON.stringify(session));

      return session;
    },
  },
  // Configure one or more authentication providers
  pages: {
    signIn: "",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      authorize: async (credentials, req) => {
        const { username, password } = credentials!;
        if (!username || !password) return null;
        const findUser = await prisma.user.findFirst({
          where: {
            username,
          },
        });
        if (!findUser || !(await argon2.verify(findUser.password, password)))
          return null;
        return { username: findUser.username, id: findUser.id.toString() };
      },
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);

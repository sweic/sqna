// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import EventEmitter from "events";
import { IncomingMessage, ServerResponse } from "http";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import ws from "ws";
import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions);
};
const ee = new EventEmitter();
export const createContext = async ({
  req,
  res,
}:
  | trpcNext.CreateNextContextOptions
  | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
  if (req instanceof IncomingMessage) {
    const session = req && res && (await getSession({ req }));
    return {
      req,
      res,
      session,
      prisma,
      ee,
    };
  }
  if (res instanceof ServerResponse) {
    const session = req && res && (await getServerAuthSession({ req, res }));
    return {
      req,
      res,
      session,
      prisma,
      ee,
    };
  }
  return {
    req,
    res,
    prisma,
    ee,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
// | trpcNext.CreateNextContextOptions
//   | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>

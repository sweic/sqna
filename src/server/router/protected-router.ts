// import * as trpc from "@trpc/server";
// import { t } from "./trpc";

import { t } from "./trpc";
// /**
//  * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
//  */
const protectedMiddleware = t.middleware(({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx,
      // infers that `session` is non-nullable to downstream resolvers
      session: { ...ctx.session, user: ctx.session?.user },
    },
  });
});
export const protectedRouter = t.procedure.use(protectedMiddleware);
// export const protectedRouter = createRouter().middleware(async ({ctx, next}) => {
//   if (!ctx.session || !ctx.session.username) {
//     throw new TRPCError({code: "UNAUTHORIZED"})
//   }
//   return next({
//     ctx: {
//       ...ctx,
//       session: {...ctx.session, username: ctx.session.username}
//     }
//   })
// })

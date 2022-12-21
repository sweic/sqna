import { z } from "zod";

import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import { prisma } from "../db/client";
import { t } from "../router/trpc";

export const authRouter = t.router({
  register: t.procedure
    .input(
      z.object({
        username: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { username, email, password } = input;
      const userExist = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email,
            },
            {
              username,
            },
          ],
        },
      });
      if (userExist?.username === username)
        throw new TRPCError({ code: "CONFLICT", message: "username" });
      else if (userExist?.email === email)
        throw new TRPCError({ code: "CONFLICT", message: "email" });

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: await argon2.hash(password),
        },
        select: {
          username: true,
        },
      });
      return newUser;
    }),
  login: t.procedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .query(async ({ ctx, input }) => {
      const { username, password } = input;
      const findUser = await prisma.user.findFirst({
        where: {
          username,
        },
      });
      const isVerified = await argon2.verify(findUser?.password!, password);
      if (!findUser || !isVerified) throw new TRPCError({ code: "NOT_FOUND" });
      return { username: findUser.username };
    }),
});

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../db/client";
import { protectedRouter } from "../router/protected-router";
import { t } from "../router/trpc";
const { sortRoom } = require("../utils/sortRoom");

export const dataRouter = t.router({
  fetchAll: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
    const _userData = await prisma.user.findFirst({
      where: {
        username: input,
      },
      select: {
        id: true,
        rooms: {
          include: {
            questions: true,
            polls: {
              include: {
                choices: true,
              },
            },
          },
        },
      },
    });
    if (!_userData) throw new TRPCError({ code: "NOT_FOUND" });

    return _userData;
  }),
  createRoom: protectedRouter
    .input(z.object({ user: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user, title } = input;
      console.log("user here", input.user);
      const newRoom = await prisma.room.create({
        data: {
          title,
          user: {
            connect: {
              username: user,
            },
          },
        },
        include: {
          questions: true,
          polls: true,
        },
      });
      return newRoom;
    }),
  endActiveRoom: protectedRouter
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const activeRoom = await prisma.room.update({
        where: {
          id: input,
        },
        data: {
          code: {
            set: null,
          },
        },
        include: {
          polls: {
            include: {
              choices: true,
            },
          },
          questions: true,
        },
      });
      if (!activeRoom) throw new TRPCError({ code: "NOT_FOUND" });
      const sortedRoom = sortRoom(activeRoom);
      ctx.ee.emit("update", sortedRoom);
      return sortedRoom;
    }),
  startActiveRoom: protectedRouter
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      var roomCode: number = 0;
      var loopbreak: number = 0;
      while (true) {
        if (loopbreak > 10) break;
        roomCode = generateRoomCode();
        loopbreak += 1;
        const roomTaken = await prisma.room.findFirst({
          where: {
            code: roomCode,
          },
        });
        if (!roomTaken) break;
      }
      const updatedRoom = await prisma.room.update({
        where: {
          id: input,
        },
        data: {
          code: {
            set: roomCode,
          },
        },
        include: {
          polls: {
            include: {
              choices: true,
            },
          },
          questions: true,
        },
      });
      if (!updatedRoom) throw new TRPCError({ code: "NOT_FOUND" });
      return sortRoom(updatedRoom);
    }),
});

function generateRoomCode() {
  return Math.floor(1000000 + Math.random() * 9000000);
}

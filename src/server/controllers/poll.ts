import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../db/client";
import { protectedRouter } from "../router/protected-router";
import { t } from "../router/trpc";
const { sortRoom } = require("../utils/sortRoom");
export const pollRouter = t.router({
  createPoll: protectedRouter
    .input(
      z.object({
        roomid: z.number(),
        title: z.string(),
        selections: z.number(),
        choices: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomid, title, selections, choices } = input;
      const poll = await prisma.poll.create({
        data: {
          room: {
            connect: {
              id: roomid,
            },
          },
          query: title,
          active: false,
          selections: selections,
          choices: {
            createMany: {
              data: choices.map((choice) => ({ title: choice })),
            },
          },
        },
        include: {
          choices: true,
        },
      });
      if (!poll) throw new TRPCError({ code: "BAD_REQUEST" });
      return poll;
    }),
  startPoll: protectedRouter
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const poll = await prisma.poll.update({
        where: {
          id: input,
        },
        data: {
          active: {
            set: true,
          },
        },
        include: {
          room: {
            include: {
              polls: {
                include: {
                  choices: true,
                },
              },
              questions: true,
            },
          },
          choices: true,
        },
      });
      if (!poll) throw new TRPCError({ code: "NOT_FOUND" });
      const sortedRoom = sortRoom(poll.room);
      ctx.ee.emit("update", sortedRoom);
      return poll;
    }),
  endPoll: protectedRouter
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const poll = await prisma.poll.update({
        where: {
          id: input,
        },
        data: {
          active: {
            set: false,
          },
        },
        include: {
          room: {
            include: {
              polls: {
                include: {
                  choices: true,
                },
              },
              questions: true,
            },
          },
          choices: true,
        },
      });
      if (!poll) throw new TRPCError({ code: "NOT_FOUND" });
      const sortedRoom = sortRoom(poll.room);
      ctx.ee.emit("update", sortedRoom);
      return poll;
    }),
  startAndEndPoll: protectedRouter
    .input(z.object({ end: z.number(), start: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { end, start } = input;
      const endedPoll = prisma.poll.update({
        where: {
          id: end,
        },
        data: {
          active: {
            set: false,
          },
        },
        include: {
          choices: true,
        },
      });
      const startedPoll = prisma.poll.update({
        where: {
          id: start,
        },
        data: {
          active: {
            set: true,
          },
        },
        include: {
          room: {
            include: {
              polls: {
                include: {
                  choices: true,
                },
              },
              questions: true,
            },
          },
          choices: true,
        },
      });

      try {
        const transaction = await prisma.$transaction([endedPoll, startedPoll]);
        const sortedRoom = sortRoom(transaction[1].room);
        ctx.ee.emit("update", sortedRoom);
        return transaction;
      } catch {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),
  votePoll: t.procedure
    .input(
      z.object({
        roomid: z.number(),
        pollid: z.number(),
        choiceids: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomid, choiceids, pollid } = input;
      console.time("start");
      const updatedRoom = await prisma.room.update({
        where: {
          id: roomid,
        },
        data: {
          polls: {
            update: {
              where: {
                id: pollid,
              },
              data: {
                choices: {
                  updateMany: {
                    where: {
                      OR: [
                        {
                          id: {
                            in: choiceids,
                          },
                        },
                      ],
                    },
                    data: {
                      votes: {
                        increment: 1,
                      },
                    },
                  },
                },
              },
            },
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
      console.timeEnd("start");
      if (!updatedRoom) throw new TRPCError({ code: "NOT_FOUND" });
      const sortedRoom = sortRoom(updatedRoom);
      ctx.ee.emit("update", sortedRoom);
      return sortedRoom;
    }),
  removePoll: t.procedure
    .input(z.object({ user: z.string(), id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const _poll = await prisma.poll.delete({
        where: {
          id,
        },
        include: {
          room: {
            include: {
              polls: {
                include: {
                  choices: true,
                },
              },
              questions: true,
            },
          },
        },
      });
      if (!_poll) throw new TRPCError({ code: "NOT_FOUND" });
      const sortedRoom = sortRoom(_poll.room);
      ctx.ee.emit("update", sortedRoom);
      return sortedRoom;
    }),
});

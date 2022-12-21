import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../db/client";
import { protectedRouter } from "../router/protected-router";
import { t } from "../router/trpc";
const { sortRoom } = require("../utils/sortRoom");

export const questionRouter = t.router({
  createQuestion: t.procedure
    .input(z.object({ id: z.number(), query: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, query } = input;
      const newRoom = await prisma.room.update({
        where: {
          id,
        },
        data: {
          questions: {
            create: {
              query,
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
      if (!newRoom) throw new TRPCError({ code: "NOT_FOUND" });
      const sortedRoom = sortRoom(newRoom);
      ctx.ee.emit("update", sortedRoom);
      return sortedRoom;
    }),
  likeQuestion: t.procedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const updatedQuestion = await prisma.question.update({
        where: {
          id: input,
        },
        data: {
          votes: {
            increment: 1,
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
        },
      });
      if (!updatedQuestion) throw new TRPCError({ code: "NOT_FOUND" });
      const sortedRoom = sortRoom(updatedQuestion.room);
      ctx.ee.emit("update", sortedRoom);
      return sortedRoom;
    }),
  unlikeQuestion: t.procedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const updatedQuestion = await prisma.question.update({
        where: {
          id: input,
        },
        data: {
          votes: {
            decrement: 1,
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
        },
      });
      if (!updatedQuestion) throw new TRPCError({ code: "NOT_FOUND" });
      const sortedRoom = sortRoom(updatedQuestion.room);
      ctx.ee.emit("update", sortedRoom);
      return sortedRoom;
    }),
  answerQuestion: protectedRouter
    .input(
      z.object({
        questionid: z.number(),
        answer: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { questionid, answer } = input;
      const updatedQuestion = await prisma.question.update({
        where: {
          id: questionid,
        },
        data: {
          answer: {
            set: answer,
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
        },
      });
      if (!updatedQuestion) throw new TRPCError({ code: "NOT_FOUND" });
      const sortedRoom = sortRoom(updatedQuestion.room);
      ctx.ee.emit("update", sortedRoom);
      return sortedRoom;
    }),
  pinQuestion: protectedRouter
    .input(z.object({ toPin: z.number(), toUnpin: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { toPin, toUnpin } = input;
      const pinQuestion = prisma.question.update({
        where: {
          id: toPin,
        },
        data: {
          pinned: true,
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
      if (toUnpin) {
        const unpinQuestion = prisma.question.update({
          where: {
            id: toUnpin!,
          },
          data: {
            pinned: false,
          },
        });
        const transaction = await prisma.$transaction([
          unpinQuestion,
          pinQuestion,
        ]);
        console.log("unpinned");
        if (!transaction[0]) throw new TRPCError({ code: "NOT_FOUND" });
        const sortedRoom = sortRoom(transaction[1].room);
        ctx.ee.emit("update", sortedRoom);
        return sortedRoom;
      } else {
        const transaction = await prisma.$transaction([pinQuestion]);
        if (!pinQuestion) throw new TRPCError({ code: "NOT_FOUND" });
        const sortedRoom = sortRoom(transaction[0].room);
        ctx.ee.emit("update", sortedRoom);
        return sortedRoom;
      }
    }),
  unpinQuestion: protectedRouter
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const unpinQuestion = await prisma.question.update({
        where: {
          id: input,
        },
        data: {
          pinned: false,
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
      if (!unpinQuestion) throw new TRPCError({ code: "NOT_FOUND" });
      const sortedRoom = sortRoom(unpinQuestion.room);
      ctx.ee.emit("update", sortedRoom);
      return sortedRoom;
    }),
  deleteQuestion: protectedRouter
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const question = await prisma.question.delete({
        where: {
          id: input,
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
      if (!question) throw new TRPCError({ code: "NOT_FOUND" });
      question.room.questions = question.room.questions.filter(
        (question) => question.id != input
      );
      const sortedRoom = sortRoom(question.room);
      ctx.ee.emit("update", sortedRoom);
      return sortedRoom;
    }),
});

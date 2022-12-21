import { Question } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { PollType, RoomData } from "shared/types/data";
import { z } from "zod";
import { prisma } from "../db/client";
import { t } from "../router/trpc";
const { sortRoom } = require("../utils/sortRoom");
export interface RoomObject {
  room: RoomData;
  pinnedQuestion?: Question;
  activePoll?: PollType;
}
export const roomRouter = t.router({
  updateRoom: t.procedure.input(z.number()).subscription(({ ctx, input }) => {
    return observable<RoomObject>((emit) => {
      const onUpdate = (data: RoomObject) => {
        if (data.room.id !== input) return;
        console.log("sent");
        emit.next(data);
      };
      console.log("received");
      ctx.ee.on("update", onUpdate);
      return () => {
        ctx.ee.off("update", onUpdate);
      };
    });
  }),
  fetchRoom: t.procedure
    .input(z.object({ username: z.string(), id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { username, id } = input;
      const _room = await prisma.room.findFirst({
        where: {
          user: {
            is: {
              username,
            },
          },
          id,
        },
        include: {
          questions: true,
          polls: {
            include: {
              choices: true,
            },
          },
        },
      });
      if (!_room) throw new TRPCError({ code: "NOT_FOUND" });
      return sortRoom(_room);
    }),
});

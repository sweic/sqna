// src/server/router/index.ts
import { authRouter } from "../controllers/auth";
import { dataRouter } from "../controllers/data";
import { pollRouter } from "../controllers/poll";
import { questionRouter } from "../controllers/questions";
import { roomRouter } from "../controllers/room";
import { t } from "./trpc";

export const appRouter = t.router({
  auth: authRouter,
  data: dataRouter,
  room: roomRouter,
  question: questionRouter,
  poll: pollRouter,
});

export type AppRouter = typeof appRouter;

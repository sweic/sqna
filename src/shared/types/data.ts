import { Choice, Poll, Question, Room } from "@prisma/client";
import { inferQueryOutput } from "shared/utils/trpc";
export type UserData = UserRooms & {
  user: string;
};

export type UserRooms = inferQueryOutput<"data.fetchAll">;
export type PollType = Poll & { choices: Choice[] };
export type RoomData = Room & {
  questions: Question[];
  polls: PollType[];
};

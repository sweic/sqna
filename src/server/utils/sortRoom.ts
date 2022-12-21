import { Question } from "@prisma/client";
import { PollType, RoomData } from "shared/types/data";

export const sortRoom = (
  room: RoomData
): { room: RoomData; pinnedQuestion?: Question; activePoll?: PollType } => {
  room.polls.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  room.questions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const pinnedQuestion = room.questions.find((question) => question.pinned);
  const activePoll = room.polls.find((poll) => poll.active);
  for (const poll of room.polls) {
    poll.choices.sort((a, b) => a.id - b.id);
  }

  return { room, pinnedQuestion, activePoll };
};

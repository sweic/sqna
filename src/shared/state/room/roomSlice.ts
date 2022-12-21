import { Poll, Question, Room } from "@prisma/client";
import { PollType, RoomData } from "shared/types/data";
import create from "zustand";

export type Meta = Room;

interface RoomDataObject {
  meta: Room | null;
  questions: Question[];
  polls: PollType[];
  setRoom: (room: RoomData) => void;
  setMeta: (room: Room) => void;
  setQuestions: (questions: Question[]) => void;
  setPolls: (polls: PollType[]) => void;
  pinnedQuestion: Question | null;
  activePoll: PollType | null;
  setPinnedQuestion: (question?: Question) => void;
  setActivePoll: (poll?: PollType) => void;
}

export default create<RoomDataObject>((set) => ({
  meta: null,
  questions: [],
  polls: [],
  setRoom: (room) =>
    set(() => ({
      meta: {
        code: room.code,
        id: room.id,
        title: room.title,
        userid: room.userid,
      },
      questions: room.questions,
      polls: room.polls,
    })),
  setMeta: (meta) => set((state) => ({ ...state, meta })),
  setQuestions: (questions) => set((state) => ({ ...state, questions })),
  setPolls: (polls) => set((state) => ({ ...state, polls })),
  pinnedQuestion: null,
  activePoll: null,
  setPinnedQuestion: (pinnedQuestion) => set(() => ({ pinnedQuestion })),
  setActivePoll: (activePoll) => set(() => ({ activePoll })),
}));

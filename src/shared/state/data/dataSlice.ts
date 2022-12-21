import { UserData, UserRooms } from "shared/types/data";
import create from "zustand";

interface DataStoreObject {
  rooms: UserRooms | null;
  setRooms: (room: UserRooms) => void;
}

export default create<DataStoreObject>((set) => ({
  rooms: null,
  setRooms: (rooms) => set(() => ({ rooms })),
}));

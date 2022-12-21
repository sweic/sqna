import create from "zustand";

interface StoreObject {
  user: string;
  loginUser: (user: string) => void;
}

export default create<StoreObject>((set) => ({
  user: "",
  loginUser: (user) => set(() => ({ user })),
  logoutUser: () => set(() => ({ user: "" }), true),
}));

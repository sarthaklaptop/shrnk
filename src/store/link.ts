import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  image: string | null;
  email: string | null;
  id: string | null;
  credits: number | null;
}

interface UserStore {
  user: User;
  setUser: (user: User) => void;
  updateCredits: (credits: number) => void;
  clearUser: () => void;
}

export const userStorage = create<UserStore>((set) => ({
  user: {
    image: null,
    email: null,
    id: null,
    credits: null
  },
  setUser: ({ image, email, id, credits }: User) => set({ user: { image, email, id, credits} }),
  updateCredits: (credits: number) =>
    set((state: any) => ({ user: { ...state.user, credits } })),
  clearUser: () =>
    set({ user: { image: null, email: null, id: null, credits: null } }),
}));

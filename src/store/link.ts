import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  image: string | null;
  email: string | null;
}

export const userStorage = create(persist( (set) => ({
    user: {
      image: null,
      email: null,
    },
    setUser: ({image, email}:User) => set({ user: { image, email } }),
  }), {
    name: "shrnk-storage", 
    storage: createJSONStorage(() => localStorage),
  }));
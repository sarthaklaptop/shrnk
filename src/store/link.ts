import { create } from "zustand";

interface User {
  image: string | null;
  email: string | null;
  id: string | null;
  credits: number | null;
  userType: "FREE" | "PREMIUM";
}

interface UserStore {
  user: User;
  setUser: (user: User | null) => void;
  updateCredits: (credits: number) => void;
  updateUserType: (userType: "FREE" | "PREMIUM") => void;
  clearUser: () => void;
}

export const userStorage = create<UserStore>((set) => ({
  user: {
    image: null,
    email: null,
    id: null,
    credits: null,
    userType: "FREE",
  },
  setUser: (user) =>
    set({
      user: user || {
        image: null,
        email: null,
        id: null,
        credits: null,
        userType: "FREE",
      },
    }),
  updateCredits: (credits: number) =>
    set((state: any) => ({ user: { ...state.user, credits } })),
  clearUser: () =>
    set({
      user: {
        image: null,
        email: null,
        id: null,
        credits: null,
        userType: "FREE",
      },
    }),
  updateUserType: (UserType: "FREE" | "PREMIUM") =>
    set((state) => ({ user: { ...state.user, UserType } })),
}));

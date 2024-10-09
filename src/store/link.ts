import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export const linkStore = create(persist( (set) => ({
    links: [ {
      shortLink: "8d1cl4",
      longLink: "https://www.youtube.com/watch?v=V7LfrS3T5fs&t=51s",
    } ],
    setLinks: (links: any) => set({ links }),
  }), {
    name: "link-storage", 
    storage: createJSONStorage(() => localStorage),
  }));
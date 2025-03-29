import create from "zustand";
import { devtools } from "zustand/middleware";

export interface WelcomeStore {
  ready: boolean;
  makeReady: () => void;
}

export const useWelcomeStore = create<
  WelcomeStore,
  [["zustand/devtools", never]]
>(
  devtools(
    (set) => ({
      ready: false,
      makeReady: () => set({ ready: true }),
    }),
    { name: "WelcomeStore" },
  ),
);

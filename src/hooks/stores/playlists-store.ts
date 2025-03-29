import create from "zustand";
import { devtools } from "zustand/middleware";

export interface PlaylistsStore {
  step: string;
  progress: number;
  setStep: (step: string) => void;
  setProgress: (progress: number) => void;
  resetProgress: () => void;
}

const initStep = "Loading playlists...";

export const usePlaylistsStore = create<
  PlaylistsStore,
  [["zustand/devtools", never]]
>(
  devtools(
    (set) => ({
      step: initStep,
      progress: 0,
      setStep: (step: string) => set({ step }),
      setProgress: (progress: number) => set({ progress }),
      resetProgress: () => set({ progress: 0, step: initStep }),
    }),
    { name: "PlaylistsStore" },
  ),
);

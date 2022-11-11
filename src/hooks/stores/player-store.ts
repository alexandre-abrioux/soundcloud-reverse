import create from "zustand";
import { devtools } from "zustand/middleware";

export interface PlayerStore {
  paused: boolean;
  currentPlayingTrack: SoundCloudTrack | null;
  currentPlayingPlaylist: SoundCloudPlaylist | null;
  setPaused: (paused: boolean) => void;
  setCurrentPlayingTrack: (track: SoundCloudTrack) => void;
  setCurrentPlayingPlaylist: (playlist: SoundCloudPlaylist) => void;
}

export const usePlayerStore = create<
  PlayerStore,
  [["zustand/devtools", never]]
>(
  devtools(
    (set) => ({
      paused: true,
      currentPlayingTrack: null,
      currentPlayingPlaylist: null,
      setPaused: (paused: boolean) => set({ paused }),
      setCurrentPlayingTrack: (track: SoundCloudTrack) =>
        set({ currentPlayingTrack: track }),
      setCurrentPlayingPlaylist: (playlist: SoundCloudPlaylist) =>
        set({ currentPlayingPlaylist: playlist }),
    }),
    { name: "PlayerStore" }
  )
);

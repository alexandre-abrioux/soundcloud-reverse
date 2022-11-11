import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface SettingsStore {
  volume: number;
  muted: boolean;
  smoothing: number;
  fftShow: boolean;
  fftEnlarge: boolean;
  selectedPlugin: string;
  selectedPlaylistID: number | null;
  displayStats: boolean;
  updateSettings: (settings: Partial<SettingsStore>) => void;
}

export const useSettingsStore = create<
  SettingsStore,
  [["zustand/devtools", never], ["zustand/persist", SettingsStore]]
>(
  devtools(
    persist(
      (set) => ({
        volume: 50,
        muted: false,
        smoothing: 40,
        fftShow: true,
        fftEnlarge: true,
        selectedPlugin: "fft",
        selectedPlaylistID: null,
        displayStats: false,
        updateSettings: set,
      }),
      { name: "settings" }
    ),
    { name: "SettingsStore" }
  )
);

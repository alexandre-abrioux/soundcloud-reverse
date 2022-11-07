import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface SettingsStore {
  volume: number;
  smoothing: number;
  fftShow: boolean;
  fftEnlarge: boolean;
  selectedPlugin: string;
  selectedPlaylistID: number | null;
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
        smoothing: 40,
        fftShow: true,
        fftEnlarge: true,
        selectedPlugin: "fft",
        selectedPlaylistID: null,
        updateSettings: set,
      }),
      { name: "settings" }
    )
  )
);

import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface SettingsStore {
  volume: number;
  nbBarsMax: number;
  nbLinesMax: number;
  fftShow: boolean;
  fftEnlarge: boolean;
  smoothing: number;
  accent: number;
  selectedPlaylistID: number | null;
  updateSettings: (
    settings: Partial<Omit<SettingsStore, "updateSettings">>
  ) => void;
}

export const useSettingsStore = create<
  SettingsStore,
  [["zustand/devtools", never], ["zustand/persist", SettingsStore]]
>(
  devtools(
    persist(
      (set) => ({
        volume: 50,
        nbBarsMax: 255,
        nbLinesMax: 50,
        fftShow: true,
        fftEnlarge: true,
        smoothing: 40,
        accent: 40,
        selectedPlaylistID: null,
        updateSettings: set,
      }),
      { name: "settings.v2" }
    )
  )
);

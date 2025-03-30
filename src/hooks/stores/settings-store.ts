import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { LOCAL_STORAGE_KEYS } from "./localstorage.js";

const defaultSettings = {
  volume: 50,
  muted: false,
  smoothing: 40,
  fftShow: true,
  fftEnlarge: true,
  selectedPlugin: "fft",
  selectedPlaylistID: null,
  pinPlaylists: false,
  displayStats: false,
  isDirty: false,
  isDirtySmoothing: false,
} as const;

export interface SettingsStore {
  volume: number;
  muted: boolean;
  smoothing: number;
  fftShow: boolean;
  fftEnlarge: boolean;
  selectedPlugin: string;
  selectedPlaylistID: number | null;
  pinPlaylists: boolean;
  displayStats: boolean;
  isDirty: boolean;
  isDirtySmoothing: boolean;
  updateSettings: (settings: Partial<SettingsStore>) => void;
  resetSettings: () => void;
  resetSmoothing: () => void;
}

export const useSettingsStore = create<
  SettingsStore,
  [["zustand/devtools", never], ["zustand/persist", SettingsStore]]
>(
  devtools(
    persist(
      (set, getState) => ({
        ...defaultSettings,
        updateSettings: (newSettings) => {
          const { smoothing } = getState();
          set({
            ...newSettings,
            isDirty: true,
            isDirtySmoothing:
              (newSettings.smoothing || smoothing) !==
              defaultSettings.smoothing,
          });
        },
        resetSettings: () => {
          const { selectedPlugin, selectedPlaylistID } = getState();
          set({
            ...defaultSettings,
            selectedPlugin,
            selectedPlaylistID,
          });
        },
        resetSmoothing: () =>
          set({
            smoothing: defaultSettings.smoothing,
            isDirtySmoothing: false,
          }),
      }),
      { name: LOCAL_STORAGE_KEYS.SETTINGS },
    ),
    { name: "SettingsStore" },
  ),
);

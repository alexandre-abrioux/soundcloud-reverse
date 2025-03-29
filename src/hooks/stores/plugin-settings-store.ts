import create from "zustand";
import { devtools, persist } from "zustand/middleware";

type PluginSettingsStore<T extends Record<string, number>> = T & {
  updateSettings: (settings: Partial<PluginSettingsStore<T>>) => void;
};

export const createPluginSettingsStore = <T extends Record<string, number>>(
  name: string,
  settingsDefaults: T,
) =>
  create<
    PluginSettingsStore<T>,
    [["zustand/devtools", never], ["zustand/persist", PluginSettingsStore<T>]]
  >(
    devtools(
      persist(
        (set) => ({
          ...settingsDefaults,
          updateSettings: set,
        }),
        { name: `plugin.${name}` },
      ),
      { name: `PluginSettingsStore-${name}` },
    ),
  );

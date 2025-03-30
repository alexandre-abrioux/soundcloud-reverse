import { create, Mutate, StoreApi, UseBoundStore } from "zustand";
import { devtools, persist } from "zustand/middleware";

type PluginSettingsStore<T extends Record<string, number>> = T & {
  isDirty: boolean;
  updateSettings: (settings: Partial<PluginSettingsStore<T>>) => void;
  resetSettings: () => void;
};

export const pluginSettingsStores: Record<
  string,
  UseBoundStore<
    Mutate<
      StoreApi<PluginSettingsStore<Record<string, number>>>,
      [
        ["zustand/devtools", never],
        ["zustand/persist", PluginSettingsStore<Record<string, number>>],
      ]
    >
  >
> = {};

export const createPluginSettingsStore = <T extends Record<string, number>>(
  name: string,
  settingsDefaults: T,
) => {
  const pluginSettingStore = create<
    PluginSettingsStore<T>,
    [["zustand/devtools", never], ["zustand/persist", PluginSettingsStore<T>]]
  >(
    devtools(
      persist(
        (set) => ({
          ...settingsDefaults,
          isDirty: false,
          updateSettings: (newSettings) => {
            set({ ...newSettings, isDirty: true });
          },
          resetSettings: () =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            set({ ...(settingsDefaults as any), isDirty: false }),
        }),
        { name: `plugin.${name}` },
      ),
      { name: `PluginSettingsStore-${name}` },
    ),
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pluginSettingsStores[name] = pluginSettingStore as any;
  return pluginSettingStore;
};

import { createPluginSettingsStore } from "../hooks/stores/plugin-settings-store.js";
import { PluginSettings } from "./plugins.js";

export const convertPluginSettingsToStore = (
  name: string,
  settings: PluginSettings,
) => {
  const settingsDefaults: Record<string, number> = {};
  for (const setting in settings) {
    settingsDefaults[setting] = settings[setting].default;
  }
  return createPluginSettingsStore(name, settingsDefaults);
};

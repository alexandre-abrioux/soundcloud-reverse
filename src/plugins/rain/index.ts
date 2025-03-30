import { useRain } from "./hook.js";
import { Plugin } from "../plugins.js";
import { name } from "./name.js";
import { settings } from "./settings.js";
import { useRainSettingsStore } from "./store.js";

export const rainPlugin: Plugin = {
  name,
  needsFrequencyData: false,
  usePlugin: useRain,
  settings,
  usePluginSettingsStore: useRainSettingsStore,
};

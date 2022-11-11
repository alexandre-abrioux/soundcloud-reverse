import { useRain } from "./hook";
import { Plugin } from "../plugins";
import { name } from "./name";
import { settings } from "./settings";
import { useRainSettingsStore } from "./store";

export const rainPlugin: Plugin = {
  name,
  needsFrequencyData: false,
  usePlugin: useRain,
  settings,
  usePluginSettingsStore: useRainSettingsStore,
};

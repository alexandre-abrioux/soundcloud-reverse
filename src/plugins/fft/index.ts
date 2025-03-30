import { useFft } from "./hook.js";
import { Plugin } from "../plugins.js";
import { name } from "./name.js";
import { settings } from "./settings.js";
import { useFftSettingsStore } from "./store.js";

export const fftPlugin: Plugin = {
  name,
  needsFrequencyData: true,
  usePlugin: useFft,
  settings,
  usePluginSettingsStore: useFftSettingsStore,
};

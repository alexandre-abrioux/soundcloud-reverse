import { useFft } from "./hook";
import { Plugin } from "../plugins";
import { name } from "./name";
import { settings } from "./settings";
import { useFftSettingsStore } from "./store";

export const fftPlugin: Plugin = {
  name,
  needsFrequencyData: true,
  usePlugin: useFft,
  settings,
  usePluginSettingsStore: useFftSettingsStore,
};

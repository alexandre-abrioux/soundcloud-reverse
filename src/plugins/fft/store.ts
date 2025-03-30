import { settings } from "./settings.js";
import { name } from "./name.js";
import { convertPluginSettingsToStore } from "../utils.js";

export const useFftSettingsStore = convertPluginSettingsToStore(name, settings);

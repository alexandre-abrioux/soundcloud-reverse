import { settings } from "./settings";
import { name } from "./name";
import { convertPluginSettingsToStore } from "../utils";

export const useFftSettingsStore = convertPluginSettingsToStore(name, settings);

import { PluginSettings } from "../plugins.js";

export const settings: PluginSettings = {
  nbLinesMax: { name: "Rows", min: 1, max: 50, step: 1, default: 50 },
  nbBarsMax: { name: "Cols", min: 0, max: 255, step: 5, default: 255 },
  accent: { name: "Accent", min: 0, max: 100, step: 1, default: 40 },
};

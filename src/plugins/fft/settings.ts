import { PluginSettings } from "../plugins";

export const settings: PluginSettings = {
  nbBarsMax: { name: "Bars", min: 0, max: 255, step: 5, default: 255 },
  nbLinesMax: { name: "Lines", min: 1, max: 50, step: 1, default: 50 },
  accent: { name: "Accent", min: 0, max: 100, step: 1, default: 40 },
};

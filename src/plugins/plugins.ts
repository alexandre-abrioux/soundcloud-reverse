import { fftPlugin } from "./fft/index.js";
import { createPluginSettingsStore } from "../hooks/stores/plugin-settings-store.js";
import { rainPlugin } from "./rain/index.js";
import { MouseEventHandler } from "react";

export type PluginHook = () => PluginHookReturn;
export type PluginHookReturn = {
  draw: (ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp) => void;
  onClick?: MouseEventHandler;
  postResize: ((ctx: CanvasRenderingContext2D) => void) | undefined;
  postClear?: (() => void) | undefined;
};
export type PluginSettings = Record<
  string,
  { name: string; min: number; max: number; step: number; default: number }
>;
export type Plugin = {
  name: string;
  needsFrequencyData: boolean;
  usePlugin: PluginHook;
  settings: PluginSettings;
  usePluginSettingsStore: ReturnType<typeof createPluginSettingsStore>;
};

export const plugins: Plugin[] = [fftPlugin, rainPlugin];

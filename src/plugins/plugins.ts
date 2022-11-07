import { fftPlugin } from "./fft";
import { createPluginSettingsStore } from "../hooks/stores/plugin-settings-store";

export type PluginHook = () => PluginHookReturn;
export type PluginHookReturn = {
  draw: (ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp) => void;
  postResize: ((ctx: CanvasRenderingContext2D) => void) | undefined;
  postClear?: (() => void) | undefined;
};
export type PluginSettings = Record<
  string,
  { name: string; min: number; max: number; step: number; default: number }
>;
export type Plugin = {
  name: string;
  usePlugin: PluginHook;
  settings: PluginSettings;
  usePluginSettingsStore: ReturnType<typeof createPluginSettingsStore>;
};

export const plugins: Plugin[] = [fftPlugin];

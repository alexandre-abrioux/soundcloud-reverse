import { useSettingsStore } from "./stores/settings-store.js";
import { useMemo } from "react";
import { plugins } from "../plugins/plugins.js";

export const useCurrentPlugin = () => {
  const pluginName = useSettingsStore((state) => state.selectedPlugin);
  return useMemo(() => {
    const plugin = plugins.find((p) => p.name === pluginName);
    if (!plugin) throw new Error(`plugin ${pluginName} does not exist`);
    return plugin;
  }, [pluginName]);
};

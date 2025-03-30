import { useSettingsStore } from "./stores/settings-store.js";
import { pluginSettingsStores } from "./stores/plugin-settings-store.js";
import { useMemo } from "react";

export const useCurrentPluginSettingsStore = () => {
  const pluginName = useSettingsStore((state) => state.selectedPlugin);
  return useMemo(() => pluginSettingsStores[pluginName], [pluginName]);
};

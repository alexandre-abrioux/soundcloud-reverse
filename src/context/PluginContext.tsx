import React, { createContext, PropsWithChildren, useMemo } from "react";
import { PluginHook, PluginHookReturn } from "../plugins/plugins.js";
import { useCurrentPlugin } from "../hooks/useCurrentPlugin.js";

export const PluginContext = createContext<PluginHookReturn>(
  {} as PluginHookReturn,
);
PluginContext.displayName = "PluginContext";

export const PluginContainer: React.FC<
  PropsWithChildren<{ plugin: PluginHook }>
> = ({ plugin: usePlugin, children }) => {
  const plugin = usePlugin();

  const pluginMemoized = useMemo(
    () => plugin,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.values(plugin),
  );

  return (
    <PluginContext.Provider value={pluginMemoized}>
      {children}
    </PluginContext.Provider>
  );
};

export const PluginProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { name, usePlugin } = useCurrentPlugin();
  return (
    <PluginContainer key={`plugin-container-${name}`} plugin={usePlugin}>
      {children}
    </PluginContainer>
  );
};

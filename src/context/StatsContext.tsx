import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { useSettingsStore } from "../hooks/stores/settings-store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StatsContext = any | null;

export const StatsContext = createContext<StatsContext>({} as StatsContext);
StatsContext.displayName = "StatsContext";

export const StatsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [stats, setStats] = useState<StatsContext>(null);
  const displayStats = useSettingsStore((state) => state.displayStats);

  useEffect(() => {
    if (!displayStats) return;
    console.log("create stats");
    const stats = new window.Stats();
    stats.showPanel(0);
    window.document.body.appendChild(stats.dom);
    setStats(stats);
    return () => {
      setStats(null);
      stats.dom.remove();
    };
  }, [displayStats]);

  return (
    <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>
  );
};

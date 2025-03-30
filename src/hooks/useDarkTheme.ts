import { usePlayerStore } from "./stores/player-store.js";
import { useSettingsStore } from "./stores/settings-store.js";

export const useDarkTheme = () => {
  const paused = usePlayerStore((state) => state.paused);
  const fftShow = useSettingsStore((state) => state.fftShow);
  const isDark = fftShow && !paused;
  return { isDark };
};

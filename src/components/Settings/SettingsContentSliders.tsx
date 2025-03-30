import { SettingsSlider } from "./SettingsSlider.js";
import { useSettingsStore } from "../../hooks/stores/settings-store.js";
import { useCurrentPlugin } from "../../hooks/useCurrentPlugin.js";

export const SettingsContentSliders = () => {
  const fftShow = useSettingsStore((state) => state.fftShow);
  const {
    name: pluginName,
    needsFrequencyData,
    settings,
    usePluginSettingsStore,
  } = useCurrentPlugin();
  if (!fftShow) return null;

  return (
    <>
      {needsFrequencyData && (
        <SettingsSlider
          store={useSettingsStore}
          setting="smoothing"
          name="Smooth"
          max={99}
        />
      )}
      {Object.keys(settings).map((setting, i) => (
        <SettingsSlider
          key={`plugin-slider-${pluginName}-${i}`}
          store={usePluginSettingsStore}
          setting={setting}
          name={settings[setting].name}
          min={settings[setting].min}
          max={settings[setting].max}
          step={settings[setting].step}
        />
      ))}
    </>
  );
};

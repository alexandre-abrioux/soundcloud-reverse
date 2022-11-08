import { SettingSlider, SliderStore } from "./SettingSlider";
import { useSettingsStore } from "../../hooks/stores/settings-store";
import { useCurrentPlugin } from "../../hooks/useCurrentPlugin";

export const SettingsContentRight = () => {
  const { settings, usePluginSettingsStore } = useCurrentPlugin();

  return (
    <>
      <SettingSlider
        store={useSettingsStore as SliderStore}
        setting="volume"
        name="Volume"
        max={100}
      />
      <SettingSlider
        store={useSettingsStore as SliderStore}
        setting="smoothing"
        name="Smooth"
        max={99}
      />
      {Object.keys(settings).map((setting, i) => (
        <SettingSlider
          key={`plugin-slider-${i}`}
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

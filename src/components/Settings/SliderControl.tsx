import { Slider } from "@mui/material";
import { SliderStore, SliderStoreContent } from "./SettingsSlider.js";

export const SliderControl = <T extends SliderStoreContent>({
  store,
  setting,
  max,
  min = 0,
  step = 1,
}: {
  store: SliderStore<T>;
  setting: string;
  max: number;
  min?: number;
  step?: number;
}) => {
  const value = store((state) => state[setting]) as number;
  const updateSettings = store((state) => state.updateSettings);
  return (
    <Slider
      value={value}
      min={min}
      step={step}
      max={max}
      onChange={(e, newValue) =>
        updateSettings({ [setting]: newValue as number })
      }
      orientation="vertical"
      valueLabelDisplay="auto"
      size="small"
      color="secondary"
    />
  );
};

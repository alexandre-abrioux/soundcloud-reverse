import { Box, Slider } from "@mui/material";
import {
  SettingsStore,
  useSettingsStore,
} from "../../hooks/stores/settings-store";

type KeysMatching<T extends object, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

type NumericSettings = KeysMatching<SettingsStore, number>;

export const SettingSlider = ({
  name,
  setting,
  max,
  min,
  step,
}: {
  name: string;
  setting: NumericSettings;
  max: number;
  min?: number;
  step?: number;
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <Box px={1} width={35} textAlign="center" fontSize="small" pb={1}>
        {name}
      </Box>
      <Box height={100} display="flex" justifyContent="center" pt={1}>
        <SliderControl setting={setting} max={max} min={min} step={step} />
      </Box>
    </Box>
  );
};

const SliderControl = ({
  setting,
  max,
  min = 0,
  step = 1,
}: {
  setting: NumericSettings;
  max: number;
  min?: number;
  step?: number;
}) => {
  const value = useSettingsStore((state) => state[setting]);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
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

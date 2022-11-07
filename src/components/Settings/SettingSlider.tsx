import { Box, Slider } from "@mui/material";
import { StoreApi, UseBoundStore } from "zustand";
import { Mutate } from "zustand/vanilla";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SliderStoreContent = Record<string, any> & {
  updateSettings: (settings: Partial<SliderStoreContent>) => void;
};

export type SliderStore = UseBoundStore<
  Mutate<
    StoreApi<SliderStoreContent>,
    [["zustand/devtools", never], ["zustand/persist", SliderStoreContent]]
  >
>;

export const SettingSlider = ({
  store,
  setting,
  name,
  max,
  min,
  step,
}: {
  store: SliderStore;
  setting: string;
  name: string;
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
        <SliderControl
          store={store}
          setting={setting}
          max={max}
          min={min}
          step={step}
        />
      </Box>
    </Box>
  );
};

const SliderControl = ({
  store,
  setting,
  max,
  min = 0,
  step = 1,
}: {
  store: SliderStore;
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

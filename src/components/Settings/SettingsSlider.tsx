import { Box } from "@mui/material";
import { Mutate, StoreApi, UseBoundStore } from "zustand";
import { SliderControl } from "./SliderControl.js";

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

export const SettingsSlider = ({
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

import { Box } from "@mui/material";
import { Mutate, StoreApi, UseBoundStore } from "zustand";
import { SliderControl } from "./SliderControl.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SliderStoreContent = Record<string, any> & {
  updateSettings: (settings: Partial<SliderStoreContent>) => void;
};

export type SliderStore<T extends SliderStoreContent> = UseBoundStore<
  Mutate<StoreApi<T>, [["zustand/devtools", never], ["zustand/persist", T]]>
>;

export const SettingsSlider = <T extends SliderStoreContent>({
  store,
  setting,
  name,
  max,
  min,
  step,
}: {
  store: SliderStore<T>;
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

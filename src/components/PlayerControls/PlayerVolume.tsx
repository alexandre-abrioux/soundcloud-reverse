import { useSettingsStore } from "../../hooks/stores/settings-store.js";
import { Box } from "@mui/material";
import { SliderControl } from "../Settings/SliderControl.js";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

const volumeIconProps = {
  fontSize: "small",
  sx: { cursor: "pointer" },
} as const;

export const PlayerVolume = () => {
  const volume = useSettingsStore((state) => state.volume);
  const muted = useSettingsStore((state) => state.muted);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="end"
      pl={1}
    >
      <Box
        flex={0}
        textAlign="center"
        onClick={() => {
          updateSettings({ muted: !muted });
        }}
      >
        {(muted && <VolumeOffIcon {...volumeIconProps} />) ||
          (volume > 50 && <VolumeUpIcon {...volumeIconProps} />) ||
          (volume > 0 && <VolumeDownIcon {...volumeIconProps} />) || (
            <VolumeMuteIcon {...volumeIconProps} />
          )}
      </Box>
      <Box flex={1} display="flex" justifyContent="center" pt={1}>
        <SliderControl
          store={useSettingsStore}
          setting="volume"
          max={100}
          min={0}
          step={1}
        />
      </Box>
    </Box>
  );
};

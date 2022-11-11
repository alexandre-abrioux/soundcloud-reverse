import { Box, FormControlLabel, Switch } from "@mui/material";
import { useSettingsStore } from "../../hooks/stores/settings-store";

export const SettingsContentLeft = () => {
  const fftShow = useSettingsStore((state) => state.fftShow);
  const fftEnlarge = useSettingsStore((state) => state.fftEnlarge);
  const displayStats = useSettingsStore((state) => state.displayStats);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  return (
    <Box display="flex" flexDirection="column" mr={3}>
      <Box>Settings</Box>
      <Box display="flex" flexDirection="column" whiteSpace="nowrap">
        <FormControlLabel
          label="Visual"
          control={
            <Switch
              checked={fftShow}
              onChange={(e) => updateSettings({ fftShow: e.target.checked })}
            />
          }
          sx={{ marginRight: 0 }}
        />
        {fftShow && (
          <>
            <FormControlLabel
              label="Full Screen"
              control={
                <Switch
                  checked={fftEnlarge}
                  onChange={(e) =>
                    updateSettings({ fftEnlarge: e.target.checked })
                  }
                />
              }
              sx={{ marginRight: 0 }}
            />
            <FormControlLabel
              label="Stats"
              control={
                <Switch
                  checked={displayStats}
                  onChange={(e) =>
                    updateSettings({ displayStats: e.target.checked })
                  }
                />
              }
              sx={{ marginRight: 0 }}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

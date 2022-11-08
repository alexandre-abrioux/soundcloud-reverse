import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
} from "@mui/material";
import { plugins } from "../../plugins/plugins";
import { useSettingsStore } from "../../hooks/stores/settings-store";

export const SettingsContentLeft = () => {
  const fftShow = useSettingsStore((state) => state.fftShow);
  const fftEnlarge = useSettingsStore((state) => state.fftEnlarge);
  const selectedPluginName = useSettingsStore((state) => state.selectedPlugin);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  return (
    <Box display="flex" flexDirection="column">
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
        <FormControlLabel
          label="Full Screen"
          control={
            <Switch
              checked={fftEnlarge}
              onChange={(e) => updateSettings({ fftEnlarge: e.target.checked })}
            />
          }
          sx={{ marginRight: 0 }}
        />
        {plugins.length > 1 && (
          <FormControl>
            <FormLabel>Plugin</FormLabel>
            <RadioGroup
              value={selectedPluginName}
              onChange={(e) => {
                updateSettings({
                  selectedPlugin: e.target.value,
                });
              }}
            >
              {plugins.map((plugin) => (
                <FormControlLabel
                  value={plugin.name}
                  key={`plugin-${plugin.name}`}
                  control={<Radio size="small" />}
                  label={plugin.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
      </Box>
    </Box>
  );
};

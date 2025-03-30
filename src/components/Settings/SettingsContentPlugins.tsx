import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { plugins } from "../../plugins/plugins.js";
import { useSettingsStore } from "../../hooks/stores/settings-store.js";

export const SettingsContentPlugins = () => {
  const fftShow = useSettingsStore((state) => state.fftShow);
  const selectedPluginName = useSettingsStore((state) => state.selectedPlugin);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  if (!fftShow) return null;

  return (
    <Box display="flex" flexDirection="column" whiteSpace="nowrap">
      <Box>Plugin</Box>
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
    </Box>
  );
};

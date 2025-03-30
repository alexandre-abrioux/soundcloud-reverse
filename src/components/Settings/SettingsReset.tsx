import { Box, Typography } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useCurrentPluginSettingsStore } from "../../hooks/useCurrentPluginSettingsStore.js";
import { useSettingsStore } from "../../hooks/stores/settings-store.js";
import { useCallback } from "react";

export const SettingsReset = () => {
  const usePluginSettingsStore = useCurrentPluginSettingsStore();
  const isDirtySmoothing = useSettingsStore((state) => state.isDirtySmoothing);
  const resetSmoothing = useSettingsStore((state) => state.resetSmoothing);
  const isPluginSettingsDirty = usePluginSettingsStore(
    (state) => state.isDirty,
  );
  const pluginSettingsReset = usePluginSettingsStore(
    (state) => state.resetSettings,
  );

  const reset = useCallback(() => {
    resetSmoothing();
    pluginSettingsReset();
  }, [resetSmoothing, pluginSettingsReset]);

  if (!isPluginSettingsDirty && !isDirtySmoothing) return <Box />;

  return (
    <Box
      onClick={reset}
      display="flex"
      alignItems="center"
      sx={{ cursor: "pointer" }}
    >
      <RestartAltIcon fontSize="small" />
      <Typography fontSize="small" pl={1}>
        Reset Plugin
      </Typography>
    </Box>
  );
};

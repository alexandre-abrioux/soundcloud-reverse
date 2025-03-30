import { Box } from "@mui/material";
import { useSettingsStore } from "../../hooks/stores/settings-store.js";
import { Logout } from "./Logout.js";
import { SettingsContentLeft } from "./SettingsContentLeft.js";
import { SettingsContentSliders } from "./SettingsContentSliders.js";
import { SettingsContentPlugins } from "./SettingsContentPlugins.js";
import { SettingsReset } from "./SettingsReset.js";

export const SettingsContent = () => {
  const fftShow = useSettingsStore((state) => state.fftShow);

  return (
    <Box
      position="absolute"
      display="flex"
      flexDirection="column"
      top={20}
      right={20}
      sx={{
        opacity: 0,
        transitionProperty: "opacity, top, right",
        transitionDuration: "0.3s",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        mt={2}
        mr={3}
        px={2}
        py={2}
        sx={{
          background: `rgba(0, 0, 0, ${fftShow ? "0.8" : "0.2"})`,
        }}
      >
        <Box display="flex">
          <SettingsContentLeft />
          <SettingsContentPlugins />
          <SettingsContentSliders />
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <SettingsReset />
          <Logout />
        </Box>
      </Box>
    </Box>
  );
};

import { Box } from "@mui/material";
import { SettingsGear } from "./SettingsGear";
import { SettingsContent } from "./SettingsContent";

export const Settings = () => (
  <Box
    position="fixed"
    top={0}
    right={0}
    sx={{
      userSelect: "none",
      "&:hover": {
        "> .MuiBox-root:first-of-type": {
          opacity: 0,
          top: 20,
          right: 20,
        },
        "> .MuiBox-root:last-of-type": {
          opacity: 1,
          top: 0,
          right: 0,
          paddingBottom: "20px",
          paddingLeft: "20px",
        },
      },
    }}
  >
    <SettingsGear />
    <SettingsContent />
  </Box>
);

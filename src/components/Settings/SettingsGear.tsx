import SettingsIcon from "@mui/icons-material/Settings";
import { Box } from "@mui/material";

export const SettingsGear = () => (
  <Box
    position="absolute"
    top={0}
    right={0}
    mt={2}
    mr={3}
    sx={{
      opacity: 1,
      transitionProperty: "opacity, top, right",
      transitionDuration: "0.3s",
    }}
  >
    <SettingsIcon sx={{ fontSize: "3rem" }} />
  </Box>
);

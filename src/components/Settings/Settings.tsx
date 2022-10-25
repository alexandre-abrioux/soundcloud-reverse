import { Box, FormControlLabel, Switch } from "@mui/material";
import { useSettingsStore } from "../../hooks/stores/settings-store";
import { SettingSlider } from "./SettingSlider";
import SettingsIcon from "@mui/icons-material/Settings";
import { Logout } from "./Logout";

export const Settings = () => {
  const fftShow = useSettingsStore((state) => state.fftShow);
  const fftEnlarge = useSettingsStore((state) => state.fftEnlarge);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  return (
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
            <Box display="flex" flexDirection="column">
              <Box>Settings</Box>
              <Box display="flex" flexDirection="column" whiteSpace="nowrap">
                <FormControlLabel
                  label="Visual"
                  control={
                    <Switch
                      checked={fftShow}
                      onChange={(e) =>
                        updateSettings({ fftShow: e.target.checked })
                      }
                    />
                  }
                  sx={{ marginRight: 0 }}
                />
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
              </Box>
            </Box>
            <SettingSlider name="Volume" setting="volume" max={100} />
            <SettingSlider name="Bars" setting="nbBarsMax" max={255} step={5} />
            <SettingSlider name="Lines" setting="nbLinesMax" min={1} max={50} />
            <SettingSlider name="Smooth" setting="smoothing" max={99} />
            <SettingSlider name="Accent" setting="accent" max={100} />
          </Box>
          <Box display="flex" justifyContent="right" mt={2}>
            <Logout />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

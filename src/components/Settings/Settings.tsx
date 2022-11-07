import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
} from "@mui/material";
import { useSettingsStore } from "../../hooks/stores/settings-store";
import { SettingSlider, SliderStore } from "./SettingSlider";
import SettingsIcon from "@mui/icons-material/Settings";
import { Logout } from "./Logout";
import { createPluginSettingsStore } from "../../hooks/stores/plugin-settings-store";
import { useCurrentPlugin } from "../../hooks/useCurrentPlugin";
import { plugins } from "../../plugins/plugins";

export const Settings = () => {
  const fftShow = useSettingsStore((state) => state.fftShow);
  const fftEnlarge = useSettingsStore((state) => state.fftEnlarge);
  const selectedPluginName = useSettingsStore((state) => state.selectedPlugin);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const { settings, usePluginSettingsStore } = useCurrentPlugin();

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
            <SettingSlider
              store={useSettingsStore as SliderStore}
              setting="volume"
              name="Volume"
              max={100}
            />
            <SettingSlider
              store={useSettingsStore as SliderStore}
              setting="smoothing"
              name="Smooth"
              max={99}
            />
            {Object.keys(settings).map((setting, i) => (
              <SettingSlider
                key={`plugin-slider-${i}`}
                store={usePluginSettingsStore}
                setting={setting}
                name={settings[setting].name}
                min={settings[setting].min}
                max={settings[setting].max}
                step={settings[setting].step}
              />
            ))}
          </Box>
          <Box display="flex" justifyContent="right" mt={2}>
            <Logout />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

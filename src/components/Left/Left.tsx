import { Box } from "@mui/material";
import { Playlists } from "./Playlists.js";
import { Tracks } from "./Tracks.js";
import { useSettingsStore } from "../../hooks/stores/settings-store.js";
import { usePlayerStore } from "../../hooks/stores/player-store.js";
import { memo, useContext } from "react";
import { PluginContext } from "../../context/PluginContext.js";
import { PluginHookReturn } from "../../plugins/plugins.js";

export const Left = () => {
  const { onClick } = useContext(PluginContext);
  return <LeftContent onClick={onClick} />;
};

const LeftContent = memo(
  ({ onClick }: { onClick: PluginHookReturn["onClick"] }) => {
    const paused = usePlayerStore((state) => state.paused);
    const fftShow = useSettingsStore((state) => state.fftShow);
    const fftEnlarge = useSettingsStore((state) => state.fftEnlarge);

    return (
      <Box
        position="fixed"
        height="100vh"
        width="100vw"
        pr={5} // hide scrollbar
        sx={{ overflowY: "scroll", userSelect: "none" }}
        onClick={onClick}
      >
        <Box
          display="inline-block"
          paddingX={3}
          paddingY={4}
          ml={3}
          sx={{
            background: `rgba(0, 0, 0, ${fftShow ? "0.8" : "0.2"})`,
            opacity: fftShow && !paused && fftEnlarge ? 0 : 1,
            transitionProperty: "background, opacity",
            transitionDuration: "0.5s",
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <Playlists />
          <Tracks />
        </Box>
      </Box>
    );
  },
);

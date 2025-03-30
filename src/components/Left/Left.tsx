import { Box } from "@mui/material";
import { Playlists } from "./Playlists.js";
import { Tracks } from "./Tracks.js";
import { useSettingsStore } from "../../hooks/stores/settings-store.js";
import { usePlayerStore } from "../../hooks/stores/player-store.js";
import { memo, useContext, useState } from "react";
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
    const pinPlaylists = useSettingsStore((state) => state.pinPlaylists);
    const [forceShowLeft, setForceShowLeft] = useState(false);

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
          minWidth="40vw"
          minHeight="100vh"
          ml={3}
          sx={{
            background: `rgba(0, 0, 0, ${fftShow && !paused ? "0.8" : "0.2"})`,
            opacity:
              forceShowLeft || pinPlaylists || !fftShow || !fftEnlarge || paused
                ? 1
                : 0,
            transitionProperty: "background, opacity",
            transitionDuration: "0.5s",
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <Playlists setForceShowLeft={setForceShowLeft} />
          <Tracks />
        </Box>
      </Box>
    );
  },
);

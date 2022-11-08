import { Box } from "@mui/material";
import { Playlists } from "./Playlists";
import { Tracks } from "./Tracks";
import { useSettingsStore } from "../../hooks/stores/settings-store";
import { usePlayerStore } from "../../hooks/stores/player-store";

export const Left = () => {
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
};

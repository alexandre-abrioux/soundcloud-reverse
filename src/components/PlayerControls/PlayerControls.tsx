import { Box, keyframes, Link } from "@mui/material";
import { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { PlayerArtwork } from "./PlayerArtwork";
import { PlayerActions } from "./PlayerActions";
import { PlayerWaves } from "./PlayerWaves";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useSettingsStore } from "../../hooks/stores/settings-store";
import { usePlayerStore } from "../../hooks/stores/player-store";

const enterAnimation = keyframes({
  from: {
    opacity: 0,
    transform: "translateX(2vw)",
  },
  to: {
    opacity: 1,
  },
});

export const PlayerControls = () => {
  const paused = usePlayerStore((state) => state.paused);
  const currentPlayingTrack = usePlayerStore(
    (state) => state.currentPlayingTrack
  );
  const fftShow = useSettingsStore((state) => state.fftShow);
  const fftEnlarge = useSettingsStore((state) => state.fftEnlarge);
  if (!currentPlayingTrack) return null;

  return (
    <Box
      display="flex"
      position="fixed"
      minWidth="40vw"
      maxWidth="50vw"
      bottom={0}
      right={0}
      mb={fftShow && !fftEnlarge && !paused ? "12vh" : 2}
      mr={3}
      paddingX={2}
      paddingY={2}
      borderRadius={0.5}
      sx={{
        background: `rgba(0, 0, 0, ${fftShow ? "0.8" : "0.2"})`,
        animation: `0.5s ${enterAnimation} ease`,
        transitionProperty: "background, margin-bottom",
        transitionDuration: "0.5s",
        transitionDelay: "0s, 0.2s",
      }}
    >
      <PlayerArtwork />
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        ml={2.5}
      >
        <Box display="flex">
          <PlayerActions />
          <Box
            flex="1"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Box sx={{ color: "text.secondary" }} fontWeight="700">
              {currentPlayingTrack.user.username}
            </Box>
            <Box>{currentPlayingTrack.title}</Box>
          </Box>
          <Box flex="0">
            <Link href={currentPlayingTrack.permalink_url} target="_blank">
              <OpenInNewIcon sx={{ fontSize: "1rem", color: "#4d4f53" }} />
            </Link>
          </Box>
        </Box>
        <PlayerWaves />
      </Box>
    </Box>
  );
};

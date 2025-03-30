import { Box, keyframes, SvgIcon, SvgIconProps } from "@mui/material";
import { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext.js";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { usePlayerStore } from "../../hooks/stores/player-store.js";
import { actionPink } from "../../config/theme.js";

const controlButtonSize = "1.5rem";

const ControlButton = ({
  icon: Icon,
  sx,
  ...rest
}: {
  icon: typeof SvgIcon;
} & SvgIconProps) => {
  return (
    <Icon
      viewBox="5.5 5.5 13 13"
      sx={{
        width: controlButtonSize,
        height: controlButtonSize,
        cursor: "pointer",
        ...sx,
      }}
      {...rest}
    />
  );
};

const spin = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const PlayerActions = () => {
  const { player } = useContext(PlayerContext);
  const paused = usePlayerStore((state) => state.paused);
  if (!player) return null;
  return (
    <Box
      display="flex"
      alignItems="center"
      color={actionPink}
      sx={{
        animation: `0.5s ${spin} ease`,
      }}
    >
      <ControlButton
        icon={SkipPreviousIcon}
        sx={{ marginRight: 1.5 }}
        onClick={() => player.previous()}
      />
      {paused ? (
        <ControlButton
          icon={PlayArrowIcon}
          onClick={() => player.audio.play()}
        />
      ) : (
        <ControlButton icon={PauseIcon} onClick={() => player.audio.pause()} />
      )}
      <ControlButton
        icon={SkipNextIcon}
        sx={{ marginLeft: 1.5, marginRight: 1.5 }}
        onClick={() => player.next({ loop: true })}
      />
    </Box>
  );
};

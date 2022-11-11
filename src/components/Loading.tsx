import { Box, CircularProgress } from "@mui/material";
import { usePlaylistsStore } from "../hooks/stores/playlists-store";

export const Loading = () => {
  const step = usePlaylistsStore((state) => state.step);
  const progress = usePlaylistsStore((state) => state.progress);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Box mb={1}>
        <CircularProgress variant="determinate" value={progress} />
      </Box>
      {step}
    </Box>
  );
};

import { Box, CircularProgress } from "@mui/material";
import { usePlaylists } from "../hooks/usePlaylists";

export const Loading = () => {
  const { step, progress } = usePlaylists();

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

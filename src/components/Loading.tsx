import { Box } from "@mui/material";
import { usePlaylists } from "../hooks/usePlaylists";

export const Loading = () => {
  const { step } = usePlaylists();

  return (
    <Box
      display="flex"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      {step}
    </Box>
  );
};

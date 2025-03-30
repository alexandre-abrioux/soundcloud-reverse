import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

export const Welcome = () => {
  const { connect } = useContext(AuthContext);
  return (
    <Box
      display="flex"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Button variant="contained" onClick={connect}>
        Connect with SoundCloud
      </Button>
    </Box>
  );
};

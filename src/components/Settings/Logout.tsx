import { Box, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../context/AuthContext.js";
import { useContext } from "react";

export const Logout = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Box
      onClick={logout}
      display="flex"
      alignItems="center"
      sx={{ cursor: "pointer" }}
    >
      <LogoutIcon fontSize="small" />
      <Typography fontSize="small" pl={1}>
        Disconnect
      </Typography>
    </Box>
  );
};

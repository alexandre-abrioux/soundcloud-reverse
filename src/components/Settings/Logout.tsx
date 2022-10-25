import { Box, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const logout = () => {
  localStorage.clear();
  window.location.reload();
};

export const Logout = () => {
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

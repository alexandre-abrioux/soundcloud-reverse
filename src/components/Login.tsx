import { Box } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Login = () => {
  const { handleOAuthRedirect } = useContext(AuthContext);
  handleOAuthRedirect();
  return (
    <Box
      display="flex"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      Authentication in progress...
    </Box>
  );
};

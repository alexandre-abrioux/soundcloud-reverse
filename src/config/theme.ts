import { createTheme } from "@mui/material";
import { lightBlue, pink } from "@mui/material/colors";

const textPrimary = "#7f88a2";
const textSecondary = "#e188ba";
export const actionPink = "#d27a99";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: pink,
    secondary: lightBlue,
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
  },
  typography: { fontFamily: ["Rajdhani", "sans-serif"].join(",") },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&::before": {
            borderBottom: "1px solid #434343 !important",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: textPrimary,
        },
      },
    },
  },
});

import { Welcome } from "./components/Welcome";
import { createTheme, ThemeProvider } from "@mui/material";
import { lightBlue, pink } from "@mui/material/colors";
import { useAuthStore } from "./hooks/stores/auth-store";
import "@fontsource/rajdhani/400.css";
import "@fontsource/rajdhani/700.css";
import { Loading } from "./components/Loading";
import { usePlaylistsStore } from "./hooks/stores/playlists-store";
import { AuthProvider } from "./components/AuthContext";
import { Main } from "./components/Main";
import { EngineProvider } from "./context/EngineContext";
import { PlayerProvider } from "./context/PlayerContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const textPrimary = "#7f88a2";
const textSecondary = "#e188ba";
export const actionPink = "#d27a99";

const theme = createTheme({
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

const queryClient = new QueryClient();

export const App = () => {
  const { token } = useAuthStore();
  const playlists = usePlaylistsStore((state) => state.playlists);
  return (
    <QueryClientProvider client={queryClient}>
      <EngineProvider>
        <PlayerProvider>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              {token ? playlists ? <Main /> : <Loading /> : <Welcome />}
            </AuthProvider>
          </ThemeProvider>
        </PlayerProvider>
      </EngineProvider>
    </QueryClientProvider>
  );
};

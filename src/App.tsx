import { ThemeProvider } from "@mui/material";
import "@fontsource/rajdhani/400.css";
import "@fontsource/rajdhani/700.css";
import { AuthProvider } from "./components/AuthContext";
import { EngineProvider } from "./context/EngineContext";
import { PlayerProvider } from "./context/PlayerContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { theme } from "./config/theme";
import { queryClient } from "./config/react-query";
import { AppContent } from "./AppContent";
import { StatsProvider } from "./context/StatsContext";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StatsProvider>
        <EngineProvider>
          <PlayerProvider>
            <ThemeProvider theme={theme}>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </ThemeProvider>
          </PlayerProvider>
        </EngineProvider>
      </StatsProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

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
import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "./components/Login";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StatsProvider>
        <EngineProvider>
          <PlayerProvider>
            <ThemeProvider theme={theme}>
              <BrowserRouter>
                <AuthProvider>
                  <Routes>
                    <Route path={import.meta.env.VITE_BASE_PATH}>
                      <Route path="/" element={<AppContent />} />
                      <Route path="/login" element={<Login />} />
                    </Route>
                  </Routes>
                </AuthProvider>
              </BrowserRouter>
            </ThemeProvider>
          </PlayerProvider>
        </EngineProvider>
      </StatsProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

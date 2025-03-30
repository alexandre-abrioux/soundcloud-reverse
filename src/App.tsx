import { ThemeProvider } from "@mui/material";
import "./css/index.css" with { type: "css" };
import { EngineProvider } from "./context/EngineContext.js";
import { PlayerProvider } from "./context/PlayerContext.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { theme } from "./config/theme.js";
import { queryClient } from "./config/react-query.js";
import { AppContent } from "./AppContent.js";
import { StatsProvider } from "./context/StatsContext.js";
import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "./components/Login.js";
import { AuthProvider } from "./context/AuthContext.js";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StatsProvider>
        <EngineProvider>
          <PlayerProvider>
            <ThemeProvider theme={theme}>
              <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
                <AuthProvider>
                  <Routes>
                    <Route>
                      <Route path="" element={<AppContent />} />
                      <Route path="login" element={<Login />} />
                    </Route>
                  </Routes>
                </AuthProvider>
              </BrowserRouter>
            </ThemeProvider>
          </PlayerProvider>
        </EngineProvider>
      </StatsProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
};

import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
} from "react";
import { useAuthStore } from "../hooks/stores/auth-store";

type AuthContext = {
  connect: () => void;
};

export const AuthContext = createContext<AuthContext>({} as AuthContext);
AuthContext.displayName = "AuthContext";

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    window.SC.initialize({
      client_id: import.meta.env.VITE_SOUNDCLOUD_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_SOUNDCLOUD_REDIRECT_URI,
      oauth_token: token,
    });
  }, []);

  const connect = useCallback(async () => {
    const session = await window.SC.connect();
    setToken(session.oauth_token);
  }, []);

  const contextValue = { connect };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

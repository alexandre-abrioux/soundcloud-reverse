import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { LOCAL_STORAGE_KEYS } from "./localstorage.js";

export interface AuthStore {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  state: string;
  codeVerifier: string;
  setAccessToken: (accessToken: string) => void;
  setAccessTokenExpiresAt: (accessToken: string) => void;
  setRefreshToken: (accessToken: string) => void;
  setState: (accessToken: string) => void;
  setCodeVerifier: (accessToken: string) => void;
}

export const useAuthStore = create<
  AuthStore,
  [["zustand/devtools", never], ["zustand/persist", AuthStore]]
>(
  devtools(
    persist(
      (set) => ({
        accessToken: "",
        accessTokenExpiresAt: "",
        refreshToken: "",
        state: "",
        codeVerifier: "",
        setAccessToken: (accessToken) => set({ accessToken }),
        setAccessTokenExpiresAt: (accessTokenExpiresAt) =>
          set({ accessTokenExpiresAt }),
        setRefreshToken: (refreshToken) => set({ refreshToken }),
        setState: (state) => set({ state }),
        setCodeVerifier: (codeVerifier) => set({ codeVerifier }),
      }),
      { name: LOCAL_STORAGE_KEYS.SC_TOKEN },
    ),
    { name: "AuthStore" },
  ),
);

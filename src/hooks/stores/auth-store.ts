import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface AuthStore {
  token: string;
  setToken: (token: string) => void;
}

export const useAuthStore = create<
  AuthStore,
  [["zustand/devtools", never], ["zustand/persist", AuthStore]]
>(
  devtools(
    persist(
      (set) => ({
        token: "",
        setToken: (token) => set({ token }),
      }),
      { name: "soundcloud.token.v2" }
    )
  )
);

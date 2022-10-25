import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface PlaylistsStore {
  playlists: SoundCloudPlaylist[] | null;
  setPlaylists: (playlists: SoundCloudPlaylist[] | null) => void;
}

export const usePlaylistsStore = create<
  PlaylistsStore,
  [["zustand/devtools", never], ["zustand/persist", PlaylistsStore]]
>(
  devtools(
    persist(
      (set) => ({
        playlists: null,
        setPlaylists: (playlists) => set({ playlists }),
      }),
      { name: "soundcloud.playlists.v2" }
    )
  )
);

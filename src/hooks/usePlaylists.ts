import { useCallback, useContext } from "react";
import { useSettingsStore } from "./stores/settings-store.js";
import { useQuery } from "@tanstack/react-query";
import { usePlaylistsStore } from "./stores/playlists-store.js";
import { AuthContext } from "../context/AuthContext.js";

export const usePlaylists = () => {
  const { isConnected, logout } = useContext(AuthContext);
  const setStep = usePlaylistsStore((state) => state.setStep);
  const setProgress = usePlaylistsStore((state) => state.setProgress);
  const resetProgress = usePlaylistsStore((state) => state.resetProgress);
  const selectedPlaylistID = useSettingsStore(
    (state) => state.selectedPlaylistID,
  );
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const {
    data: playlists,
    isFetching,
    refetch,
  } = useQuery<SoundCloudPlaylist[]>({
    queryKey: ["soundcloud.playlists"],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: isConnected,
    retry: (failureCount, error) => {
      if ("status" in error && error.status === 401) {
        logout();
        return false;
      }
      return failureCount < 3;
    },
    queryFn: async () => {
      //---------------------------------------------------------------------------------
      // Retrieve Playlists
      const playlists: SoundCloudPlaylist[] =
        await window.SC.get("/me/playlists");
      // The track arrays returned by /me/playlists are ordered by track creation date.
      // We retrieve the chronological order by fetching each playlist individually.
      // We then reverse that order.
      const promises = [];
      const nbPlaylistsToLoad = playlists.length + 1;
      let nbPlaylistLoaded = 0;
      for (let i = 0; i < playlists.length; i++) {
        promises.push(
          window.SC.get("/playlists/" + playlists[i].id).then(
            (playlist: SoundCloudPlaylist) => {
              nbPlaylistLoaded++;
              const percent = Math.round(
                (nbPlaylistLoaded / nbPlaylistsToLoad) * 100,
              );
              console.info(
                "[" +
                  percent +
                  "%] Loaded playlist " +
                  playlists[i].id +
                  " details from SoundCloud (" +
                  playlists[i].title +
                  ")",
              );
              playlists[i].tracks = playlist.tracks.reverse();
              setProgress(percent);
              setStep("Loaded playlist " + playlists[i].title);
            },
          ),
        );
      }
      await Promise.all(promises);
      //---------------------------------------------------------------------------------
      // Retrieve Favorites
      const favorites: SoundCloudTrack[] = await window.SC.get("/me/favorites");
      // The favorites are already sorted properly.
      playlists.unshift({
        kind: "playlist",
        id: 0,
        title: "Likes",
        tracks: favorites,
      });
      setProgress(100);
      setStep("Loaded favorites.");
      //---------------------------------------------------------------------------------
      // Update selected playlist ID
      if (
        playlists &&
        playlists.length > 0 &&
        (selectedPlaylistID === null ||
          playlists.every((playlist) => playlist.id !== selectedPlaylistID))
      ) {
        updateSettings({ selectedPlaylistID: playlists[0].id });
      }
      return playlists;
    },
  });

  const refetchPlaylists = useCallback(() => {
    resetProgress();
    void refetch();
  }, [refetch, resetProgress]);

  return { playlists, isFetching, refetchPlaylists };
};

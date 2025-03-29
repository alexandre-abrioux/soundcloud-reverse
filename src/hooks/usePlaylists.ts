import { useContext, useEffect } from "react";
import { useSettingsStore } from "./stores/settings-store";
import { useQuery } from "@tanstack/react-query";
import { usePlaylistsStore } from "./stores/playlists-store";
import { AuthContext } from "../context/AuthContext";

export const usePlaylists = () => {
  const { isConnected } = useContext(AuthContext);
  const setStep = usePlaylistsStore((state) => state.setStep);
  const setProgress = usePlaylistsStore((state) => state.setProgress);
  const selectedPlaylistID = useSettingsStore(
    (state) => state.selectedPlaylistID,
  );
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const { data: playlists, isFetching } = useQuery<SoundCloudPlaylist[]>({
    queryKey: ["soundcloud.playlists"],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: isConnected,
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
      setStep("Loading favorites...");
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
      return playlists;
    },
  });

  useEffect(() => {
    if (
      playlists &&
      playlists.length > 0 &&
      (selectedPlaylistID === null ||
        playlists.every((playlist) => playlist.id !== selectedPlaylistID))
    ) {
      updateSettings({ selectedPlaylistID: playlists[0]?.id });
    }
  }, [selectedPlaylistID, playlists]);

  return { playlists, isFetching };
};

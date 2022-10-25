import { useEffect, useState } from "react";
import { usePlaylistsStore } from "./stores/playlists-store";
import { useSettingsStore } from "./stores/settings-store";

export const usePlaylists = () => {
  const playlists = usePlaylistsStore((state) => state.playlists);
  const setPlaylists = usePlaylistsStore((state) => state.setPlaylists);
  const selectedPlaylistID = useSettingsStore(
    (state) => state.selectedPlaylistID
  );
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const [step, setStep] = useState("Loading playlists...");

  useEffect(() => {
    if (playlists) return;
    void (async () => {
      //---------------------------------------------------------------------------------
      // Retrieve Playlists
      const playlists: SoundCloudPlaylist[] = await window.SC.get(
        "/me/playlists"
      );
      // The track arrays returned by /me/playlists are ordered by track creation date.
      // We retrieve the chronological order by fetching each playlist individually.
      // We then reverse that order.
      const promises = [];
      let nbPlaylistLoaded = 0;
      for (let i = 0; i < playlists.length; i++) {
        promises.push(
          window.SC.get("/playlists/" + playlists[i].id).then(
            (playlist: SoundCloudPlaylist) => {
              nbPlaylistLoaded++;
              const percent = Math.round(
                (nbPlaylistLoaded / playlists.length) * 100
              );
              console.info(
                "[" +
                  percent +
                  "%] Loaded playlist " +
                  playlists[i].id +
                  " details from SoundCloud (" +
                  playlists[i].title +
                  ")"
              );
              playlists[i].tracks = playlist.tracks.reverse();
              setStep(
                "Loaded playlist " + playlists[i].title + " (" + percent + "%)"
              );
            }
          )
        );
      }
      await Promise.all(promises);
      //---------------------------------------------------------------------------------
      // Retrieve Favorites
      setStep("Loading favorites...");
      const favorites: SoundCloudTrack[] = await window.SC.get("/me/favorites");
      setStep("Loaded favorites.");
      // The favorites are already sorted properly.
      playlists.unshift({
        kind: "playlist",
        id: 0,
        title: "Likes",
        tracks: favorites,
      });
      setPlaylists(playlists);
      if (
        selectedPlaylistID === null ||
        !playlists.some((playlist) => playlist.id === selectedPlaylistID)
      ) {
        updateSettings({ selectedPlaylistID: playlists[0]?.id });
      }
    })();
  }, []);

  return { step };
};

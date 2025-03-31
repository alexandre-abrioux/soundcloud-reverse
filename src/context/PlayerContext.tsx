import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useAuthStore } from "../hooks/stores/auth-store.js";
import { analyser, audioCtx, EngineContext, player } from "./EngineContext.js";
import { findByID } from "../utils.js";
import { usePlayerStore } from "../hooks/stores/player-store.js";

type PlayerContext = {
  play: (playlist: SoundCloudPlaylist, track: SoundCloudTrack) => void;
};

export const PlayerContext = createContext<PlayerContext>({} as PlayerContext);
PlayerContext.displayName = "PlayerContext";

export const PlayerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { accessToken } = useAuthStore();
  const { updateEngine } = useContext(EngineContext);
  const currentPlayingTrack = usePlayerStore(
    (state) => state.currentPlayingTrack,
  );
  const setPaused = usePlayerStore((state) => state.setPaused);
  const setCurrentPlayingTrack = usePlayerStore(
    (state) => state.setCurrentPlayingTrack,
  );
  const setCurrentPlayingPlaylist = usePlayerStore(
    (state) => state.setCurrentPlayingPlaylist,
  );

  useEffect(() => {
    if (!accessToken) return;
    player._oauthToken = accessToken;
  }, [accessToken]);

  useEffect(() => {
    if (!analyser) return;
    const playerEventListener = (e: Event) => {
      console.info("Track [", currentPlayingTrack?.id, "] >", e.type);
      setPaused(true);
      switch (e.type) {
        case "playing":
          void audioCtx.resume(); // Fixes muted in Chrome
          setCurrentPlayingPlaylist(player._playlist);
          setCurrentPlayingTrack(
            player._playlist.tracks[player._playlistIndex],
          );
          updateEngine();
          setPaused(false);
          // @ts-expect-error Custom property to reset the wave seek ASAP to zero on track change
          player.audio.__id = currentPlayingTrack?.id;
          break;
        case "seeking":
          setPaused(false);
          break;
        case "pause":
          setPaused(true);
          break;
        case "error":
        case "ended":
          player.next({ loop: true });
          break;
      }
    };

    player.on("playing", playerEventListener);
    player.on("pause", playerEventListener);
    player.on("error", playerEventListener);
    player.on("ended", playerEventListener);

    return () => {
      player.off("playing", playerEventListener);
      player.off("pause", playerEventListener);
      player.off("error", playerEventListener);
      player.off("ended", playerEventListener);
    };
  }, [
    currentPlayingTrack,
    setPaused,
    setCurrentPlayingPlaylist,
    setCurrentPlayingTrack,
    updateEngine,
  ]);

  const play = useCallback<PlayerContext["play"]>(
    (playlist, track) => {
      console.info("Track [", track.id, "] > queued", track);
      setCurrentPlayingPlaylist(playlist);
      setCurrentPlayingTrack(track);
      player._playlist = playlist;
      player.play({
        playlistIndex: playlist.tracks.findIndex(findByID(track.id)),
      });
    },
    [setCurrentPlayingPlaylist, setCurrentPlayingTrack],
  );

  const contextValue: PlayerContext = {
    play,
  };

  const contextValueMemoized = useMemo(
    () => contextValue,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.values(contextValue),
  );

  return (
    <PlayerContext.Provider value={contextValueMemoized}>
      {children}
    </PlayerContext.Provider>
  );
};

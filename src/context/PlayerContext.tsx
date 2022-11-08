import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import SoundCloudAudio from "soundcloud-audio";
import { useAuthStore } from "../hooks/stores/auth-store";
import { EngineContext } from "./EngineContext";
import { findByID } from "../utils";
import { usePlayerStore } from "../hooks/stores/player-store";

type PlayerContext = {
  player: SoundCloudAudio | undefined;
  play: (playlist: SoundCloudPlaylist, track: SoundCloudTrack) => void;
};

export const PlayerContext = createContext<PlayerContext>({} as PlayerContext);
PlayerContext.displayName = "PlayerContext";

export const PlayerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuthStore();
  const { audioCtx, analyser, gainNode, updateEngine } =
    useContext(EngineContext);
  const currentPlayingTrack = usePlayerStore(
    (state) => state.currentPlayingTrack
  );
  const setPaused = usePlayerStore((state) => state.setPaused);
  const setCurrentPlayingTrack = usePlayerStore(
    (state) => state.setCurrentPlayingTrack
  );
  const setCurrentPlayingPlaylist = usePlayerStore(
    (state) => state.setCurrentPlayingPlaylist
  );

  const player = useMemo(() => {
    if (!token) return;
    const player = new SoundCloudAudio(token);
    player.audio.crossOrigin = "anonymous";
    return player;
  }, [token]);

  const audioSrc = useMemo(() => {
    if (!audioCtx) return;
    if (!player) return;
    return audioCtx.createMediaElementSource(player.audio);
  }, [audioCtx, player]);

  useEffect(() => {
    if (!audioSrc) return;
    if (!analyser) return;
    if (!gainNode) return;
    audioSrc.connect(analyser);
    audioSrc.connect(gainNode);
    return () => {
      audioSrc.disconnect(analyser);
      audioSrc.disconnect(gainNode);
    };
  }, [audioSrc, analyser, gainNode]);

  useEffect(() => {
    if (!player) return;
    if (!audioCtx) return;
    if (!analyser) return;
    const playerEventListener = (e: Event) => {
      console.info("Track [", currentPlayingTrack?.id, "] >", e.type);
      setPaused(true);
      switch (e.type) {
        case "playing":
          audioCtx.resume(); // Fixes muted in Chrome
          setCurrentPlayingPlaylist(player._playlist);
          setCurrentPlayingTrack(
            player._playlist.tracks[player._playlistIndex]
          );
          updateEngine();
          setPaused(false);
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
  }, [player, currentPlayingTrack, currentPlayingTrack]);

  const play = useCallback<PlayerContext["play"]>(
    (playlist, track) => {
      if (!player) return;
      console.info("Track [", track.id, "] > queued", track);
      setCurrentPlayingPlaylist(playlist);
      setCurrentPlayingTrack(track);
      player._playlist = playlist;
      player.play({
        playlistIndex: playlist.tracks.findIndex(findByID(track.id)),
      });
    },
    [player]
  );

  const contextValue: PlayerContext = {
    player,
    play,
  };

  const contextValueMemoized = useMemo(
    () => contextValue,
    Object.values(contextValue)
  );

  return (
    <PlayerContext.Provider value={contextValueMemoized}>
      {children}
    </PlayerContext.Provider>
  );
};

import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import SoundCloudAudio from "soundcloud-audio";
import { useAuthStore } from "../hooks/stores/auth-store";
import { EngineContext } from "./EngineContext";
import { findByID } from "../utils";

type PlayerContext = {
  player: SoundCloudAudio | undefined;
  paused: boolean;
  play: (playlist: SoundCloudPlaylist, track: SoundCloudTrack) => void;
  currentPlayingTrack: SoundCloudTrack | null;
  currentPlayingPlaylist: SoundCloudPlaylist | null;
};

export const PlayerContext = createContext<PlayerContext>({} as PlayerContext);
PlayerContext.displayName = "PlayerContext";

export const PlayerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuthStore();
  const { audioCtx, analyser, gainNode, updateEngine } =
    useContext(EngineContext);
  const [paused, setPaused] = useState<PlayerContext["paused"]>(true);
  const [currentPlayingTrack, setCurrentPlayingTrack] =
    useState<PlayerContext["currentPlayingTrack"]>(null);
  const [currentPlayingPlaylist, setCurrentPlayingPlaylist] =
    useState<PlayerContext["currentPlayingPlaylist"]>(null);

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
    paused,
    play,
    currentPlayingTrack,
    currentPlayingPlaylist,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

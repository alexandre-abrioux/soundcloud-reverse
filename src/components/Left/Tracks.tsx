import { usePlaylistsStore } from "../../hooks/stores/playlists-store";
import { useSettingsStore } from "../../hooks/stores/settings-store";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Link } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { MouseEvent, useCallback, useContext, useEffect } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { actionPink } from "../../App";
import { usePlayerStore } from "../../hooks/stores/player-store";

export const Tracks = () => {
  const { play } = useContext(PlayerContext);
  const playlists = usePlaylistsStore((state) => state.playlists);
  const currentPlayingTrack = usePlayerStore(
    (state) => state.currentPlayingTrack
  );
  const selectedPlaylistID = useSettingsStore(
    (state) => state.selectedPlaylistID
  );
  const playlist = playlists?.find(
    (playlist) => playlist.id === selectedPlaylistID
  );

  if (!playlist) return null;

  const playTrack = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const trackIndex =
        e.currentTarget.attributes.getNamedItem("data-track-index")?.value;
      if (!trackIndex) return;
      const track = playlist.tracks[Number(trackIndex)];
      play(playlist, track);
    },
    [play, playlist]
  );

  const tracks = playlist?.tracks;
  if (!tracks) return null;

  return (
    <Box display="flex" flexDirection="column">
      {tracks?.map((track, i) => (
        <Box
          display="flex"
          alignItems="center"
          key={`track-${track.id}`}
          data-track-index={i}
          onClick={playTrack}
        >
          <Box
            flex="1"
            display="flex"
            alignItems="center"
            sx={{
              color: (theme) =>
                currentPlayingTrack?.id === track.id
                  ? theme.palette.text.secondary
                  : theme.palette.text.primary,
              cursor: "pointer",
              "&:hover": {
                color: (theme) =>
                  currentPlayingTrack?.id === track.id
                    ? theme.palette.text.secondary
                    : "#96a0bf",
                svg: {
                  color:
                    currentPlayingTrack?.id === track.id
                      ? actionPink
                      : "#7f88a2",
                },
              },
            }}
          >
            <PlayArrowIcon
              sx={{
                color: () =>
                  currentPlayingTrack?.id === track.id ? actionPink : "#4f535c",
              }}
            />
            <Box flex="1" mx={1}>
              [ {track.user.username} ] {track.title}
            </Box>
          </Box>
          <Link
            href={track.permalink_url}
            target="_blank"
            display="flex"
            mr={1.1}
            ml={3}
          >
            <OpenInNewIcon sx={{ fontSize: "1rem", color: "#4d4f53" }} />
          </Link>
        </Box>
      ))}
    </Box>
  );
};

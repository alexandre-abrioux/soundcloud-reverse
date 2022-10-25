import { usePlaylistsStore } from "../../hooks/stores/playlists-store";
import { useSettingsStore } from "../../hooks/stores/settings-store";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Link } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { actionPink } from "../../App";

export const Tracks = () => {
  const { play, currentPlayingTrack } = useContext(PlayerContext);
  const playlists = usePlaylistsStore((state) => state.playlists);
  const selectedPlaylistID = useSettingsStore(
    (state) => state.selectedPlaylistID
  );
  const playlist = playlists?.find(
    (playlist) => playlist.id === selectedPlaylistID
  );

  if (!playlist) return null;
  const tracks = playlist?.tracks;
  if (!tracks) return null;

  return (
    <Box display="flex" flexDirection="column">
      {tracks?.map((track) => (
        <Box
          display="flex"
          alignItems="center"
          key={track.id}
          onClick={() => play(playlist, track)}
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

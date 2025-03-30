import { Box, IconButton, MenuItem, Select, useTheme } from "@mui/material";
import { useSettingsStore } from "../../hooks/stores/settings-store.js";
import CachedIcon from "@mui/icons-material/Cached";
import { useQueryClient } from "@tanstack/react-query";
import { usePlaylists } from "../../hooks/usePlaylists.js";
import { usePlaylistsStore } from "../../hooks/stores/playlists-store.js";
import { useEffect } from "react";

export const Playlists = ({
  setForceShowLeft,
}: {
  setForceShowLeft: (forceShowLeft: boolean) => void;
}) => {
  const { palette } = useTheme();
  const { playlists } = usePlaylists();
  const resetProgress = usePlaylistsStore((state) => state.resetProgress);
  const selectedPlaylistID = useSettingsStore(
    (state) => state.selectedPlaylistID,
  );
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const queryClient = useQueryClient();

  useEffect(() => {
    const playlistsElement = document.querySelector("#playlists");
    if (!playlistsElement) return;
    const observer = new IntersectionObserver(
      ([e]) => e.target.toggleAttribute("data-stuck", e.intersectionRatio < 1),
      { threshold: [1] },
    );
    observer.observe(playlistsElement);
    return () => {
      observer.unobserve(playlistsElement);
    };
  }, []);

  return (
    <Box
      id="playlists"
      display="flex"
      alignItems="center"
      paddingX={3}
      paddingY={4}
      position="sticky"
      top={-1} // for IntersectionObserver to work
      sx={{
        "&[data-stuck]": {
          background: "rgba(0, 0, 0, 0.9)",
          boxShadow: "0 0 15px black",
          clipPath: "inset(0 0 -15px 0)",
        },
      }}
    >
      <Select
        variant="standard"
        sx={{
          flex: 1,
          marginLeft: 1,
          marginRight: 1,
        }}
        value={
          playlists?.find((playlist) => playlist.id === selectedPlaylistID)?.id
        }
        onOpen={() => setForceShowLeft(true)}
        onClose={() => setTimeout(() => setForceShowLeft(false), 500)}
        onChange={(e) => {
          updateSettings({ selectedPlaylistID: Number(e.target.value) });
        }}
      >
        {playlists?.map((playlist) => (
          <MenuItem value={playlist.id} key={playlist.id}>
            {playlist.title}
          </MenuItem>
        ))}
      </Select>

      <IconButton
        onClick={async () => {
          resetProgress();
          void queryClient.fetchQuery({
            queryKey: ["soundcloud.playlists"],
          });
        }}
      >
        <CachedIcon fontSize="small" sx={{ color: palette.text.primary }} />
      </IconButton>
    </Box>
  );
};

import { Box, IconButton, MenuItem, Select, useTheme } from "@mui/material";
import { useSettingsStore } from "../../hooks/stores/settings-store.js";
import CachedIcon from "@mui/icons-material/Cached";
import { usePlaylists } from "../../hooks/usePlaylists.js";
import { useEffect } from "react";
import { useDarkTheme } from "../../hooks/useDarkTheme.js";

export const Playlists = ({
  setForceShowLeft,
}: {
  setForceShowLeft: (forceShowLeft: boolean) => void;
}) => {
  const { palette } = useTheme();
  const { isDark } = useDarkTheme();
  const { playlists, refetchPlaylists } = usePlaylists();
  const selectedPlaylistID = useSettingsStore(
    (state) => state.selectedPlaylistID,
  );
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  useEffect(() => {
    const playlistsElement = document.querySelector("#playlists");
    if (!playlistsElement) return;
    const observer = new IntersectionObserver(
      ([e]) => e.target.toggleAttribute("data-stuck", e.intersectionRatio < 1),
      { threshold: [1] },
    );
    observer.observe(playlistsElement);
    return () => {
      observer.disconnect();
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
        transitionProperty: "background",
        transitionDuration: ".3s",
        background: isDark ? "transparent" : "#292929",
        "&[data-stuck]": {
          background: isDark ? "#0b0b0b" : "#292929",
          boxShadow: `0 0 15px ${isDark ? "#000" : "#222"}`,
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

      <IconButton onClick={refetchPlaylists}>
        <CachedIcon fontSize="small" sx={{ color: palette.text.primary }} />
      </IconButton>
    </Box>
  );
};

import { Box, IconButton, MenuItem, Select, useTheme } from "@mui/material";
import { usePlaylistsStore } from "../../hooks/stores/playlists-store";
import { useSettingsStore } from "../../hooks/stores/settings-store";
import CachedIcon from "@mui/icons-material/Cached";

export const Playlists = () => {
  const { palette } = useTheme();
  const playlists = usePlaylistsStore((state) => state.playlists);
  const setPlaylists = usePlaylistsStore((state) => state.setPlaylists);
  const selectedPlaylistID = useSettingsStore(
    (state) => state.selectedPlaylistID
  );
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  return (
    <Box display="flex" alignItems="center" mb={3}>
      <Select
        variant="standard"
        sx={{
          flex: 1,
          marginRight: 1,
        }}
        value={
          playlists?.find((playlist) => playlist.id === selectedPlaylistID)?.id
        }
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
        onClick={() => {
          setPlaylists(null);
        }}
      >
        <CachedIcon fontSize="small" sx={{ color: palette.text.primary }} />
      </IconButton>
    </Box>
  );
};

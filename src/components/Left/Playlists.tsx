import { Box, IconButton, MenuItem, Select, useTheme } from "@mui/material";
import { useSettingsStore } from "../../hooks/stores/settings-store.js";
import CachedIcon from "@mui/icons-material/Cached";
import { useQueryClient } from "@tanstack/react-query";
import { usePlaylists } from "../../hooks/usePlaylists.js";
import { usePlaylistsStore } from "../../hooks/stores/playlists-store.js";

export const Playlists = () => {
  const { palette } = useTheme();
  const { playlists } = usePlaylists();
  const resetProgress = usePlaylistsStore((state) => state.resetProgress);
  const selectedPlaylistID = useSettingsStore(
    (state) => state.selectedPlaylistID,
  );
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const queryClient = useQueryClient();

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

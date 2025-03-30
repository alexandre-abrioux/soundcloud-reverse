import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { LOCAL_STORAGE_KEYS } from "../hooks/stores/localstorage.js";

export const queryClient = new QueryClient();
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: LOCAL_STORAGE_KEYS.REACT_QUERY,
});
persistQueryClient({
  queryClient,
  persister,
  dehydrateOptions: {
    shouldDehydrateMutation: () => false,
    shouldDehydrateQuery: (query) => {
      return (
        query.state.status === "success" &&
        query.queryKey.join("") === "soundcloud.playlists"
      );
    },
  },
});

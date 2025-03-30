import { useContext } from "react";
import { usePlaylists } from "./hooks/usePlaylists.js";
import { Main } from "./components/Main.js";
import { Loading } from "./components/Loading.js";
import { Welcome } from "./components/Welcome.js";
import { AuthContext } from "./context/AuthContext.js";

export const AppContent = () => {
  const { isConnected } = useContext(AuthContext);
  const { playlists, isFetching } = usePlaylists();
  return isConnected ? (
    playlists && !isFetching ? (
      <Main />
    ) : (
      <Loading />
    )
  ) : (
    <Welcome />
  );
};

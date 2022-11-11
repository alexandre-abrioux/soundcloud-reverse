import { useContext } from "react";
import { AuthContext } from "./components/AuthContext";
import { usePlaylists } from "./hooks/usePlaylists";
import { Main } from "./components/Main";
import { Loading } from "./components/Loading";
import { Welcome } from "./components/Welcome";

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

import { useContext } from "react";
import { usePlaylists } from "./hooks/usePlaylists";
import { Main } from "./components/Main";
import { Loading } from "./components/Loading";
import { Welcome } from "./components/Welcome";
import { AuthContext } from "./context/AuthContext";

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

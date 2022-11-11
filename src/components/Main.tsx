import { PlayerControls } from "./PlayerControls/PlayerControls";
import { Background } from "./Background";
import { Left } from "./Left/Left";
import { Settings } from "./Settings/Settings";
import { PluginProvider } from "../context/PluginContext";

export const Main = () => {
  return (
    <>
      <PluginProvider>
        <Background />
        <Left />
      </PluginProvider>
      <Settings />
      <PlayerControls />
    </>
  );
};

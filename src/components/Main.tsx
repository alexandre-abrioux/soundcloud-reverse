import { PlayerControls } from "./PlayerControls/PlayerControls.js";
import { Background } from "./Background.js";
import { Left } from "./Left/Left.js";
import { Settings } from "./Settings/Settings.js";
import { PluginProvider } from "../context/PluginContext.js";

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

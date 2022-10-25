import { PlayerControls } from "./PlayerControls/PlayerControls";
import { Background } from "./Background";
import { Left } from "./Left/Left";
import { Settings } from "./Settings/Settings";

export const Main = () => {
  return (
    <>
      <Background />
      <Left />
      <Settings />
      <PlayerControls />
    </>
  );
};

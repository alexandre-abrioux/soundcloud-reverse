import { useEffect, useState } from "react";
import { Box, Skeleton } from "@mui/material";
import { usePlayerStore } from "../../hooks/stores/player-store";

export const PlayerArtwork = () => {
  const currentPlayingTrack = usePlayerStore(
    (state) => state.currentPlayingTrack,
  );
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentPlayingTrack?.artwork_url]);

  return (
    <>
      {(!currentPlayingTrack?.artwork_url || !imageLoaded) && (
        <Skeleton
          variant="rectangular"
          animation={currentPlayingTrack?.artwork_url ? "wave" : false}
          width={100}
          height={100}
          sx={{ bgcolor: "grey.900" }}
        />
      )}
      <Box display={imageLoaded ? "block" : "none"} lineHeight={0}>
        <img
          src={currentPlayingTrack?.artwork_url}
          alt=""
          onLoad={() => setImageLoaded(true)}
          width={100}
          height={100}
        />
      </Box>
    </>
  );
};

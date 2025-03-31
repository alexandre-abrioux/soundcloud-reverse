import { useCallback, useEffect, useState } from "react";
import { css, Skeleton } from "@mui/material";
import { useCanvas } from "../../hooks/useCanvas.js";
import { normalize } from "../../utils.js";
import { useQuery } from "@tanstack/react-query";
import { usePlayerStore } from "../../hooks/stores/player-store.js";
import { player } from "../../context/EngineContext.js";

let renderWaveCursor = 0;
const updateRenderWaveCursor = (e: MouseEvent) => {
  renderWaveCursor = e.offsetX;
};
const resetRenderWaveCursor = () => {
  renderWaveCursor = 0;
};

export const PlayerWaves = () => {
  const paused = usePlayerStore((state) => state.paused);
  const currentPlayingTrack = usePlayerStore(
    (state) => state.currentPlayingTrack,
  );
  const [hovering, setHovering] = useState(false);

  const { data: waveformData, isLoading: waveFormLoading } = useQuery<{
    width: number;
    height: number;
    samples: number[];
  }>({
    queryKey: ["soundcloud.wave", currentPlayingTrack?.id],
    queryFn: async () => {
      if (!currentPlayingTrack?.waveform_url) return;
      const waveformData = await fetch(
        currentPlayingTrack.waveform_url.replace(/\.png$/, ".json"),
      );
      return waveformData.json();
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!waveformData) return;
      const { width, height } = ctx.canvas;
      const barsSize = 2;
      const spaceSize = 1;
      const gapSize = barsSize + spaceSize;
      const nbBars = Math.floor(width / gapSize);
      const barArraySize = Math.floor(waveformData.width / nbBars);
      const cursorX = normalize(renderWaveCursor, width, nbBars);

      const currentTime =
        // @ts-expect-error Custom property to reset the seek time ASAP when changing song
        player.audio.__id !== currentPlayingTrack?.id
          ? 0
          : normalize(player.audio.currentTime, player.audio.duration, nbBars);

      ctx.clearRect(0, 0, width, height);
      for (let x = 0; x < nbBars; x++) {
        const subArray = waveformData.samples.slice(
          barArraySize * x,
          barArraySize * (x + 1),
        );
        const maxValue = Math.max.apply(null, subArray);
        const barHeight = Math.floor((height * maxValue) / waveformData.height);
        let fillStyle = "rgba(150,150,150,";
        fillStyle = x < cursorX ? "rgba(33,150,243," : fillStyle;
        fillStyle = x < currentTime ? "rgba(225,136,186," : fillStyle;
        ctx.fillStyle = fillStyle + "1)";
        ctx.fillRect(
          x * gapSize,
          (2 * height) / 3,
          barsSize,
          (-barHeight * 2) / 3,
        );
        ctx.fillStyle = fillStyle + "0.5)";
        ctx.fillRect(
          x * gapSize,
          (2 * height) / 3 + spaceSize,
          barsSize,
          barHeight / 3,
        );
      }
    },
    [currentPlayingTrack?.id, waveformData],
  );

  const seek = useCallback((e: MouseEvent) => {
    const canvas = e.target as HTMLCanvasElement;
    const position = normalize(
      renderWaveCursor,
      canvas.width,
      player.audio.duration,
    );
    player.setTime(position);
  }, []);

  const { canvasRef, canvas } = useCanvas({
    start: !!waveformData && (!paused || hovering),
    draw,
    onClick: seek,
    maxFps: hovering ? null : 3,
  });

  useEffect(() => {
    if (!canvas) return;
    const mouseMove = (e: MouseEvent) => {
      setHovering(true);
      updateRenderWaveCursor(e);
    };
    const mouseLeave = () => {
      resetRenderWaveCursor();
      setHovering(false);
    };
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mouseleave", mouseLeave);
    return () => {
      canvas.removeEventListener("mousemove", mouseMove);
      canvas.removeEventListener("mouseleave", mouseLeave);
    };
  }, [canvas]);

  if (waveFormLoading)
    return (
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="100%"
        height="50px"
        sx={{ bgcolor: "grey.900" }}
      />
    );

  return (
    <canvas
      ref={canvasRef}
      css={css({
        cursor: "pointer",
        marginTop: 5,
        width: "100%",
        height: "50px",
      })}
    />
  );
};

import { useSettingsStore } from "../hooks/stores/settings-store";
import { css } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { resizeCanvas, useCanvas } from "../hooks/useCanvas";
import { clearCanvas } from "../utils";
import { usePlayerStore } from "../hooks/stores/player-store";
import { PluginContext } from "../context/PluginContext";

export const Background = () => {
  const paused = usePlayerStore((state) => state.paused);
  const fftShow = useSettingsStore((state) => state.fftShow);
  const fftEnlarge = useSettingsStore((state) => state.fftEnlarge);
  const { draw, postResize, postClear } = useContext(PluginContext);
  const [resizedOnce, setResizedOnce] = useState(false);
  const [fftStart, setFftStart] = useState(fftShow);

  const { canvasRef, context } = useCanvas({
    start: fftStart,
    autoResize: false,
    updateStats: true,
    draw,
    ctxOptions: {
      alpha: false,
    },
  });

  const resizeCanvasHook: CallableFunction | undefined = useMemo(() => {
    if (!context) return;
    if (!postResize) return;
    return () => {
      resizeCanvas(context);
      postResize(context);
    };
  }, [context, postResize]);

  // resize on first render, and after that only when the window is resized
  useEffect(() => {
    if (!resizedOnce && resizeCanvasHook) {
      resizeCanvasHook();
      setResizedOnce(true);
    }
  }, [resizedOnce, resizeCanvasHook]);

  // trigger resize on window resize
  useEffect(() => {
    if (!resizeCanvasHook) return;
    let resizeTimeout: number;
    const resizeListener = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resizeCanvasHook, 200);
    };
    window.addEventListener("resize", resizeListener);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resizeListener);
    };
  }, [resizeCanvasHook]);

  // trigger resize on fftEnlarge change
  useEffect(() => {
    if (!resizeCanvasHook) return;
    const resizeTimeout = window.setTimeout(resizeCanvasHook, 200);
    return () => {
      clearTimeout(resizeTimeout);
    };
  }, [resizeCanvasHook, fftEnlarge]);

  const visible = fftShow && !paused;

  // after we stop rendering
  useEffect(() => {
    if (visible) {
      setFftStart(true);
      return;
    }
    const timeout = window.setTimeout(() => {
      setFftStart(false);
      if (context) clearCanvas(context);
      if (postClear) postClear();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [visible, context, postClear]);

  return (
    <canvas
      ref={canvasRef}
      css={css({
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        opacity: visible ? 1 : 0,
        height: fftEnlarge ? "100vh" : "10vh",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
        transitionProperty: fftEnlarge ? "opacity" : "opacity, height",
        transitionDuration: "0.5s",
      })}
    />
  );
};

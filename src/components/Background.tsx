import { useSettingsStore } from "../hooks/stores/settings-store";
import { css } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { resizeCanvas, useCanvas } from "../hooks/useCanvas";
import { EngineContext } from "../context/EngineContext";
import {
  clearCanvas,
  logScale,
  logScaleOneTo100,
  normalize,
  resizeCanvasKeepContent,
} from "../utils";
import { PlayerContext } from "../context/PlayerContext";

export const Background = () => {
  const { analyser, nbValuesToKeepInArray, frequencyData, frequencyDataCopy } =
    useContext(EngineContext);
  const { paused } = useContext(PlayerContext);
  const fftShow = useSettingsStore((state) => state.fftShow);
  const fftEnlarge = useSettingsStore((state) => state.fftEnlarge);
  const nbBarsMax = useSettingsStore((state) => state.nbBarsMax);
  const nbLinesMax = useSettingsStore((state) => state.nbLinesMax);
  const accent = useSettingsStore((state) => state.accent);
  const [resizedOnce, setResizedOnce] = useState(false);
  const [fftStart, setFftStart] = useState(fftShow);
  const [nbBars, setNbBars] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [barHorizOffset, setBarHorizOffset] = useState(0);
  const [barArraySize, setBarArraySize] = useState(0);

  const preRenderCanvas = useMemo(() => {
    return window.document.createElement("canvas");
  }, []);

  const preRenderCtx = useMemo(() => {
    const ctx = preRenderCanvas.getContext("2d", {
      alpha: false,
    });
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = false;
    return ctx;
  }, [preRenderCanvas]);

  const updateBackgroundParams: CallableFunction | undefined = useMemo(() => {
    if (!nbValuesToKeepInArray) return;
    if (!preRenderCtx) return;
    if (nbBarsMax === undefined) return;
    return () => {
      const { width, height } = preRenderCtx.canvas;
      let nbBars = Math.min(width / 3, nbValuesToKeepInArray);
      if (nbBarsMax > 0) nbBars = Math.min(nbBarsMax, nbBars);
      const nbLines = Math.round(Math.min(nbLinesMax, height));
      const barWidth = Math.max(2, Math.floor(((width / nbBars) * 2) / 3));
      nbBars = ((width / barWidth) * 2) / 3;
      nbBars = Math.floor(Math.min(nbBars, width / 3, nbValuesToKeepInArray));
      const barHorizOffset = Math.max(
        1,
        Math.round((width - nbBars * barWidth * 1.5) / 2 + barWidth / 4)
      );
      const lineHeight = Math.round(Math.max(height / nbLines, 1));
      const barArraySize = Math.floor(nbValuesToKeepInArray / nbBars);
      setNbBars(nbBars);
      setLineHeight(lineHeight);
      setBarWidth(barWidth);
      setBarHorizOffset(barHorizOffset);
      setBarArraySize(barArraySize);
    };
  }, [preRenderCtx, nbValuesToKeepInArray, nbBarsMax, nbLinesMax]);

  useEffect(() => {
    if (!updateBackgroundParams) return;
    updateBackgroundParams();
  }, [updateBackgroundParams]);

  // whenever a draw parameter is updated, clear preRenderCanvas
  useEffect(() => {
    if (!preRenderCtx) return;
    const { width, height } = preRenderCtx.canvas;
    const barWidthTotal = barWidth * 1.5;
    const spaceBetweenBars = barWidthTotal - barWidth;
    let running = true;
    const animationFrameId = window.requestAnimationFrame(() => {
      if (!running) return;
      preRenderCtx.clearRect(0, 0, barHorizOffset, height);
      preRenderCtx.clearRect(width - barHorizOffset, 0, barHorizOffset, height);
      for (let x = 0; x < nbBars; x++) {
        preRenderCtx.clearRect(
          barHorizOffset + barWidth + x * barWidthTotal,
          0,
          spaceBetweenBars,
          height
        );
      }
    });
    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [preRenderCtx, nbBars, barWidth, barHorizOffset]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!analyser) return;
      if (!preRenderCtx) return;
      if (!frequencyData) return;
      if (!frequencyDataCopy) return;
      if (!nbValuesToKeepInArray) return;

      const preRenderCanvas = preRenderCtx.canvas;
      analyser.getByteFrequencyData(frequencyData);
      const frequencyDataTruncated = frequencyData.subarray(
        0,
        nbValuesToKeepInArray
      );
      const frequencyDataGrouped = new Uint8Array(nbBars);
      let maxAmp = 0;
      for (let i = 0; i < nbBars; i++) {
        const subArray = frequencyDataTruncated.subarray(
          barArraySize * i,
          barArraySize * (i + 1)
        );
        frequencyDataGrouped[i] = Math.max.apply(null, Array.from(subArray));
        maxAmp = Math.max(frequencyDataGrouped[i], maxAmp);
      }
      if (accent > 0) {
        for (let i = 0; i < nbBars; i++) {
          const slope = frequencyDataGrouped[i] - frequencyDataCopy[i];
          if (slope > 0) {
            frequencyDataGrouped[i] +=
              slope * logScaleOneTo100.valueToLog(accent);
            frequencyDataGrouped[i] = Math.min(frequencyDataGrouped[i], 255);
          }
        }
      }
      const logScaleColorG = logScale({
        maxval: maxAmp,
        minlval: 90,
        maxlval: 150,
      });
      const colorB = 150 + normalize(maxAmp, 255, 55);
      frequencyDataCopy.set(frequencyDataGrouped);
      preRenderCtx.drawImage(preRenderCanvas, 0, lineHeight);
      const barWidthTotal = barWidth * 1.5;
      for (let x = 0; x < nbBars; x++) {
        const colorR = 50 + normalize(frequencyDataGrouped[x], maxAmp, 205);
        const colorG = logScaleColorG.valueToLog(frequencyDataGrouped[x]);
        // 50 90 150
        // 255 130 160
        preRenderCtx.fillStyle =
          "rgb(" + colorR + "," + colorG + "," + colorB + ")";
        preRenderCtx.fillRect(
          x * barWidthTotal + barHorizOffset,
          0,
          barWidth,
          lineHeight
        );
      }
      ctx.drawImage(preRenderCanvas, 0, 0);
      ctx.scale(1, -1);
      ctx.drawImage(preRenderCanvas, 0, -ctx.canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    },
    [
      analyser,
      preRenderCtx,
      frequencyData,
      frequencyDataCopy,
      nbValuesToKeepInArray,
      nbBars,
      lineHeight,
      barWidth,
      barHorizOffset,
      barArraySize,
      accent,
    ]
  );

  const { canvasRef, context } = useCanvas({
    start: fftStart,
    autoResize: false,
    draw,
    ctxOptions: {
      alpha: false,
    },
  });

  const resizeBothCanvas: CallableFunction | undefined = useMemo(() => {
    if (!context) return;
    if (!preRenderCtx) return;
    if (!updateBackgroundParams) return;
    return () => {
      console.log("RESIZE");
      resizeCanvas(context);
      const canvas = context.canvas;
      const { width, height } = canvas;
      resizeCanvasKeepContent(preRenderCtx, width, Math.ceil(height / 2));
      updateBackgroundParams();
    };
  }, [context, preRenderCtx, updateBackgroundParams]);

  // resize the first time updateBackgroundParams is updated,
  // but after that only when the window is resized
  useEffect(() => {
    if (!resizedOnce && resizeBothCanvas) {
      resizeBothCanvas();
      setResizedOnce(true);
    }
  }, [resizedOnce, resizeBothCanvas]);

  // trigger resize on window resize
  useEffect(() => {
    if (!resizeBothCanvas) return;
    let resizeTimeout: number;
    const resizeListener = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resizeBothCanvas, 200);
    };
    window.addEventListener("resize", resizeListener);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resizeListener);
    };
  }, [resizeBothCanvas]);

  // trigger resize on fftEnlarge change
  useEffect(() => {
    if (!resizeBothCanvas) return;
    const resizeTimeout = window.setTimeout(resizeBothCanvas, 200);
    return () => {
      clearTimeout(resizeTimeout);
    };
  }, [resizeBothCanvas, fftEnlarge]);

  const visible = fftShow && !paused;

  useEffect(() => {
    if (visible) {
      setFftStart(true);
      return;
    }
    const timeout = window.setTimeout(() => {
      setFftStart(false);
      context && clearCanvas(context);
      preRenderCtx && clearCanvas(preRenderCtx);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [visible, context, preRenderCtx]);

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

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearCanvas,
  logScale,
  logScaleOneTo100,
  normalize,
  resizeCanvasKeepContent,
} from "../../utils";
import { EngineContext } from "../../context/EngineContext";
import { useFftSettingsStore } from "./store";
import { PluginHook, PluginHookReturn } from "../plugins";

export const useFft: PluginHook = () => {
  const { analyser, nbValuesToKeepInArray, frequencyData, frequencyDataCopy } =
    useContext(EngineContext);
  const nbBarsMax = useFftSettingsStore((state) => state.nbBarsMax);
  const nbLinesMax = useFftSettingsStore((state) => state.nbLinesMax);
  const accent = useFftSettingsStore((state) => state.accent);
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
        Math.round((width - nbBars * barWidth * 1.5) / 2 + barWidth / 4),
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
          height,
        );
      }
    });
    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [preRenderCtx, nbBars, barWidth, barHorizOffset]);

  const draw: PluginHookReturn["draw"] = useCallback(
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
        nbValuesToKeepInArray,
      );
      const frequencyDataGrouped = new Uint8Array(nbBars);
      let maxAmp = 0;
      for (let i = 0; i < nbBars; i++) {
        const subArray = frequencyDataTruncated.subarray(
          barArraySize * i,
          barArraySize * (i + 1),
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
          lineHeight,
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
    ],
  );

  const postResize: PluginHookReturn["postResize"] = useMemo(() => {
    if (!preRenderCtx) return;
    if (!updateBackgroundParams) return;
    return (ctx: CanvasRenderingContext2D) => {
      const canvas = ctx.canvas;
      const { width, height } = canvas;
      resizeCanvasKeepContent(preRenderCtx, width, Math.ceil(height / 2));
      updateBackgroundParams();
    };
  }, [preRenderCtx, updateBackgroundParams]);

  const postClear: PluginHookReturn["postClear"] = useMemo(() => {
    return () => {
      if (preRenderCtx) clearCanvas(preRenderCtx);
    };
  }, [preRenderCtx]);

  return {
    draw,
    postResize,
    postClear,
  };
};

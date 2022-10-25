import { useCallback, useEffect, useState } from "react";
import { resizeCanvasKeepContent } from "../utils";

export const resizeCanvas = (ctx: CanvasRenderingContext2D) => {
  const canvas = ctx.canvas;
  const { width, height } = canvas.getBoundingClientRect();
  const { devicePixelRatio: ratio = 1 } = window;
  const w = width * ratio;
  const h = height * ratio;
  resizeCanvasKeepContent(ctx, w, h);
  ctx.scale(ratio, ratio);
};

export const useCanvas = ({
  start,
  autoResize = true,
  draw,
  maxFps = null,
  ctxOptions,
}: {
  start: boolean;
  autoResize?: boolean;
  draw: (ctx: CanvasRenderingContext2D, time: DOMHighResTimeStamp) => void;
  maxFps?: number | null;
  ctxOptions?: CanvasRenderingContext2DSettings;
}) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [context, setContext] = useState<CanvasRenderingContext2D>();

  // create canvas
  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    setCanvas(canvas);
  }, []);

  // create context
  useEffect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d", ctxOptions);
    if (!ctx) {
      console.error("Could not retrieve canvas context");
      return;
    }
    ctx.imageSmoothingEnabled = false;
    setContext(ctx);
  }, [canvas]);

  // resize canvas
  useEffect(() => {
    if (!context) return;
    let resizeTimeout: number;
    const resizeListener = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => resizeCanvas(context), 300);
    };
    if (autoResize) {
      resizeCanvas(context);
      window.addEventListener("resize", resizeListener);
    }
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resizeListener);
    };
  }, [context, autoResize]);

  // animate canvas
  useEffect(() => {
    if (!context) return;
    if (!start) return;
    const maxDelta = maxFps !== null && 1000 / maxFps;
    let previousTime = 0;
    let running = true;
    let animationFrameId: number;
    const render: FrameRequestCallback = (time) => {
      if (!running) return;
      animationFrameId = window.requestAnimationFrame(render);
      if (maxFps !== null) {
        const delta = time - previousTime;
        if (delta < maxDelta) return;
      }
      draw(context, time);
      previousTime = time;
    };
    animationFrameId = window.requestAnimationFrame(render);
    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [context, start, draw, maxFps]);

  return { canvasRef, canvas, context };
};

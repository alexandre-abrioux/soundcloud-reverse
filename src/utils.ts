export const normalize = (val: number, maxOrigin: number, maxDest: number) => {
  if (maxOrigin === 0) return 0;
  return Math.round((maxDest * val) / maxOrigin);
};

export const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const resizeCanvasKeepContent = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
) => {
  const canvas = ctx.canvas;
  const _canvas = window.document.createElement("canvas");
  const _ctx = _canvas?.getContext("2d");
  _canvas.width = w;
  _canvas.height = h;
  _ctx?.drawImage(canvas, 0, 0, w, h);
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(_canvas, 0, 0);
};

export const findByID = (id: number) => {
  return function (element: { id: number }) {
    return element.id === id;
  };
};

type Scale = {
  minval: number;
  maxval: number;
  minlval: number;
  maxlval: number;
  scale: number;
  valueToLog: (n: number) => number;
  logToValue: (n: number) => number;
};

export const logScale = (options?: {
  minval?: number;
  maxval?: number;
  minlval?: number;
  maxlval?: number;
}): Scale => {
  const scale = {
    minval: options?.minval || 0,
    maxval: options?.maxval || 100,
    minlval: options?.minlval || 1,
    maxlval: options?.maxlval || 100,
  };
  scale.minlval = Math.log(scale.minlval);
  scale.maxlval = Math.log(scale.maxlval);

  const scaleNb =
    scale.maxval - scale.minval === 0
      ? 0
      : (scale.maxlval - scale.minlval) / (scale.maxval - scale.minval);

  const valueToLog = function (value: number) {
    return Math.exp((value - scale.minval) * scaleNb + scale.minlval);
  };

  const logToValue = function (log: number) {
    return scale.minval + (Math.log(log) - scale.minlval) / scaleNb;
  };

  return {
    ...scale,
    scale: scaleNb,
    valueToLog,
    logToValue,
  };
};

export const logScaleOneTo100 = logScale();

import { useCallback, useContext, useMemo, useState } from "react";
import { EngineContext } from "../../context/EngineContext";
import { PluginHook, PluginHookReturn } from "../plugins";
import { useRainSettingsStore } from "./store";

const branches = new Array(0);

class Branch {
  public x: number;
  public y: number;
  constructor(width: number) {
    this.x = Math.random() * width;
    this.y = 0;
  }
}

const generateRandomColors = () => {
  return {
    random_r: Math.floor(200 * Math.random()),
    random_g: Math.floor(200 * Math.random()),
    random_b: Math.floor(200 * Math.random()),
    random_r_multiplicateur: Math.floor(20 * Math.random()),
    random_g_multiplicateur: Math.floor(20 * Math.random()),
    random_b_multiplicateur: Math.floor(20 * Math.random()),
  };
};

export const useRain: PluginHook = () => {
  const { analyser, timeDomainData } = useContext(EngineContext);
  const [colors, setColors] = useState<ReturnType<typeof generateRandomColors>>(
    generateRandomColors(),
  );
  const intensity = useRainSettingsStore((state) => state.intensity);

  const draw: PluginHookReturn["draw"] = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!analyser) return;
      if (!timeDomainData) return;

      const { canvas } = ctx;
      const { width, height } = canvas;
      const {
        random_r,
        random_g,
        random_b,
        random_r_multiplicateur,
        random_g_multiplicateur,
        random_b_multiplicateur,
      } = colors;

      analyser.getFloatTimeDomainData(timeDomainData);
      const signal =
        (timeDomainData.reduce((a, b) => Math.abs(a) + Math.abs(b), 0) /
          timeDomainData.length) *
        intensity;

      ctx.fillStyle =
        "rgba(" +
        random_r_multiplicateur * 2 +
        "," +
        random_g_multiplicateur * 2 +
        "," +
        random_b_multiplicateur * 2 +
        ",0.05)";
      ctx.fillRect(0, 0, width, height);

      const maxBranches = Math.ceil(
        Math.min(Math.exp(signal) / width, width / 80),
      );
      if (branches.length < maxBranches)
        branches.push(
          ...new Array(maxBranches - branches.length)
            .fill(0)
            .map(() => new Branch(width)),
        );

      ctx.lineWidth = Math.min(signal, 1);
      const color_r = Math.floor(signal * random_r_multiplicateur) + random_r;
      const color_g = Math.floor(signal * random_g_multiplicateur) + random_g;
      const color_b = Math.floor(signal * random_b_multiplicateur) + random_b;
      ctx.strokeStyle = "rgb(" + color_r + "," + color_g + "," + color_b + ")";

      for (let j = 0; j < branches.length; j++) {
        const branch = branches[j];
        const moveTo_x = branch.x;
        const moveTo_y = branch.y;

        const x_change = Math.cos(Math.random() * Math.PI) * signal;
        branch.x +=
          Math.sign(x_change) * Math.min(Math.abs(x_change), width / 10);
        branch.y += Math.min(signal * 2, height / 5);

        ctx.beginPath();
        ctx.moveTo(moveTo_x, moveTo_y);
        ctx.lineTo(branch.x, branch.y);
        ctx.closePath();
        ctx.stroke();
        if (
          branch.x < 0 ||
          branch.y < 0 ||
          branch.x > width ||
          branch.y > height
        ) {
          branches.splice(j, 1);
        }
      }
    },
    [analyser, timeDomainData, intensity, colors],
  );

  const onClick: PluginHookReturn["onClick"] = useCallback(() => {
    setColors(generateRandomColors());
  }, []);

  const postResize: PluginHookReturn["postResize"] = useMemo(
    () => () => undefined,
    [],
  );

  const postClear: PluginHookReturn["postClear"] = useMemo(
    () => () => undefined,
    [],
  );

  return {
    draw,
    onClick,
    postResize,
    postClear,
  };
};

import { z } from "zod";
import { WorkerData, WorkerResult } from "../interfaces/interfaces";

export default ({
  xStart,
  yStart,
  blockWidth,
  blockHeight,
  width,
  height,
  reMin,
  reMax,
  imMin,
  imMax,
  iterations,
}: z.infer<typeof WorkerData>): z.infer<typeof WorkerResult> => {
  const pixels = [];

  for (let y = yStart; y < yStart + blockHeight; y++) {
    for (let x = xStart; x < xStart + blockWidth; x++) {
      const re = (x / width) * (reMax - reMin) + reMin;
      const im = (y / height) * (imMax - imMin) + imMin;
      const iter = mandelbrot(re, im, iterations);
      pixels.push(iter);
    }
  }

  return {
    xStart,
    yStart,
    blockWidth,
    blockHeight,
    pixels,
  };
};

function mandelbrot(cx: number, cy: number, iterations: number) {
  let x = 0;
  let y = 0;
  let i = 0;
  while (x * x + y * y <= 4 && i < iterations) {
    const xTemp = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = xTemp;
    i++;
  }
  return i;
}

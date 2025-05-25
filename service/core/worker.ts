import { z } from "zod";
import { WorkerData, WorkerResult } from "../interfaces/interfaces";

export default ({
  xStart,
  yStart,
  blockWidth,
  blockHeight,
  width,
  height,
  real,
  imaginary,
  zoom,
  iterations,
}: z.infer<typeof WorkerData>): z.infer<typeof WorkerResult> => {
  const pixels: number[] = [];

  const aspectRatio = width / height;
  const scale = 1 / zoom;

  const reMin = real - scale * aspectRatio;
  const reMax = real + scale * aspectRatio;
  const imMin = imaginary - scale;
  const imMax = imaginary + scale;

  for (let y = yStart; y < yStart + blockHeight; y++) {
    for (let x = xStart; x < xStart + blockWidth; x++) {
      const re = ((x + 0.5) / width) * (reMax - reMin) + reMin;
      const im = imMax - ((y + 0.5) / height) * (imMax - imMin);
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
  return i / iterations;
}

import { IWorkerData, IWorkerResult } from "../interfaces/interfaces";

export default ({
  xStart,
  yStart,
  width,
  height,
  totalWidth,
  totalHeight,
  reMin,
  reMax,
  imMin,
  imMax,
  iterations,
}: IWorkerData): IWorkerResult => {
  const pixels = [];

  for (let y = yStart; y < yStart + height; y++) {
    for (let x = xStart; x < xStart + width; x++) {
      const re = (x / totalWidth) * (reMax - reMin) + reMin;
      const im = (y / totalHeight) * (imMax - imMin) + imMin;
      const iter = mandelbrot(re, im, iterations);
      pixels.push(iter);
    }
  }

  return {
    xStart,
    yStart,
    width,
    height,
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

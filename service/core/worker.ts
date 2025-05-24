import { IWorkerData } from "../interfaces/interfaces";

export default ({
  xStart,
  yStart,
  width,
  height,
  totalWidth,
  totalHeight,
}: IWorkerData) => {
  const pixels = [];

  for (let y = yStart; y < yStart + height; y++) {
    for (let x = xStart; x < xStart + width; x++) {
      const re = (x / totalWidth) * 3.5 - 2.5;
      const im = (y / totalHeight) * 2.0 - 1.0;
      const iter = mandelbrot(re, im);
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

function mandelbrot(cx: number, cy: number, maxIter = 1000) {
  let x = 0;
  let y = 0;
  let i = 0;
  while (x * x + y * y <= 4 && i < maxIter) {
    const xTemp = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = xTemp;
    i++;
  }
  return i;
}

import path from "path";
import Piscina from "piscina";
import {
  IComputeMandelbrot,
  IWorkerData,
  IWorkerResult,
} from "../interfaces/interfaces";

export async function computeMandelbrot({
  blockSize,
  height,
  threads,
  iterations,
  width,
  reMin,
  reMax,
  imMin,
  imMax,
  ws,
}: IComputeMandelbrot) {
  const tasks: IWorkerData[] = [];

  const piscina = new Piscina<IWorkerData, IWorkerResult>({
    filename: path.join(__dirname, "worker.js"),
    maxThreads: threads,
  });

  for (let x = 0; x < width; x += blockSize) {
    for (let y = 0; y < height; y += blockSize) {
      tasks.push({
        xStart: x,
        yStart: y,
        width: blockSize,
        height: blockSize,
        totalWidth: width,
        totalHeight: height,
        reMin,
        reMax,
        imMin,
        imMax,
        iterations,
      });
    }
  }

  tasks.forEach(async (task) => {
    const data = await piscina.run(task);
    ws.send(JSON.stringify({ type: "block", data }));
  });
}

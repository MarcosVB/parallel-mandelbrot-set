import path from "path";
import Piscina from "piscina";
import {
  ComputeMandelbrot,
  WorkerData,
  WorkerResult,
} from "../interfaces/interfaces";
import { z } from "zod";

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
}: z.infer<typeof ComputeMandelbrot>) {
  const tasks: Array<z.infer<typeof WorkerData>> = [];

  const piscina = new Piscina<
    z.infer<typeof WorkerData>,
    z.infer<typeof WorkerResult>
  >({
    filename: path.join(__dirname, "worker.js"),
    maxThreads: threads,
  });

  for (let x = 0; x < width; x += blockSize) {
    for (let y = 0; y < height; y += blockSize) {
      tasks.push({
        xStart: x,
        yStart: y,
        blockWidth: blockSize,
        blockHeight: blockSize,
        width,
        height,
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

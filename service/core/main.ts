import path from "path";
import { Worker } from "worker_threads";
import WebSocket from "ws";

const WIDTH = 800;
const HEIGHT = 600;
const BLOCK_SIZE = 40;

export function computeMandelbrot(ws: WebSocket) {
  for (let y = 0; y < HEIGHT; y += BLOCK_SIZE) {
    for (let x = 0; x < WIDTH; x += BLOCK_SIZE) {
      setupWorker(x, y, ws);
    }
  }
}

function setupWorker(x: number, y: number, ws: WebSocket) {
  const worker = new Worker(path.join(__dirname, "worker.js"), {
    workerData: {
      xStart: x,
      yStart: y,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
      totalWidth: WIDTH,
      totalHeight: HEIGHT,
    },
  });

  worker.on("message", (data) => {
    ws.send(JSON.stringify({ type: "block", data }));
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err);
  });

  worker.on("exit", (code) => {
    if (code !== 0) console.error(`Worker exited with code ${code}`);
  });
}
